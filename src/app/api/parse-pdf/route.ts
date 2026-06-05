import { DOMMatrix, DOMPoint, DOMRect } from "@napi-rs/canvas";
import { type NextRequest, NextResponse } from "next/server";

// Force Node.js runtime — Edge runtime lacks Buffer, fs, and native addons
// required by pdf-parse and @napi-rs/canvas.
export const runtime = "nodejs";
export const maxDuration = 30;

// Polyfill browser geometry globals that pdfjs-dist (used internally by
// pdf-parse v2) expects in Node.js environments.
if (typeof globalThis.DOMMatrix === "undefined") {
  globalThis.DOMMatrix = DOMMatrix as unknown as typeof globalThis.DOMMatrix;
}
if (typeof globalThis.DOMPoint === "undefined") {
  globalThis.DOMPoint = DOMPoint as unknown as typeof globalThis.DOMPoint;
}
if (typeof globalThis.DOMRect === "undefined") {
  globalThis.DOMRect = DOMRect as unknown as typeof globalThis.DOMRect;
}

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form data payload." },
      { status: 400 },
    );
  }

  const file = formData.get("pdf");
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "No PDF file found. Append the file as the 'pdf' field." },
      { status: 400 },
    );
  }

  if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
    return NextResponse.json(
      { error: "Uploaded file must be a PDF." },
      { status: 400 },
    );
  }

  const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "PDF file exceeds the 10 MB size limit." },
      { status: 413 },
    );
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Dynamic import ensures the DOMMatrix polyfill above is applied before
    // pdfjs-dist initialises. Static top-level imports run before module-scope
    // side-effects in some bundler configurations.
    const { PDFParse } = await import("pdf-parse");

    // In serverless Node.js (Vercel) the default relative workerSrc
    // ("./pdf.worker.mjs") cannot be resolved from the function's CWD.
    // import.meta.resolve() returns an absolute file:// URL that works
    // regardless of the working directory.
    const workerUrl = import.meta.resolve(
      "pdfjs-dist/legacy/build/pdf.worker.mjs",
    );
    PDFParse.setWorker(workerUrl);

    // pdf-parse v2: class-based API — pass buffer via { data } option
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();

    return NextResponse.json({ text: result.text });
  } catch (err) {
    console.error("[parse-pdf API Error]:", err);
    const message = err instanceof Error ? err.message : "Failed to parse PDF.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
