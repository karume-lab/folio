import { type NextRequest, NextResponse } from "next/server";

// Strictly enforce Node runtime — Edge runtime lacks Buffer and fs APIs.
export const runtime = "nodejs";
// Prevent Vercel timeouts for larger PDFs.
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("pdf");

  if (!file || typeof file === "string") {
    return NextResponse.json(
      { error: "No PDF file provided." },
      { status: 400 },
    );
  }

  const typedFile = file as File;

  if (
    typedFile.type !== "application/pdf" &&
    !typedFile.name.endsWith(".pdf")
  ) {
    return NextResponse.json(
      { error: "Uploaded file must be a PDF." },
      { status: 400 },
    );
  }

  const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
  if (typedFile.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "PDF file exceeds the 10 MB size limit." },
      { status: 413 },
    );
  }

  const buffer = Buffer.from(await typedFile.arrayBuffer());

  // Dynamic import prevents Next.js from bundling pdf-parse at build time.
  // pdf-parse v2 uses a class-based API — no default export, no version option.
  const { PDFParse } = await import("pdf-parse");

  // Suppress noisy pdfjs-dist warnings that are harmless in a server context:
  //   - "Setting up fake worker" — expected when running without a Web Worker
  //   - "Unsupported: field.type of Link" / "NOT valid form element"
  const originalWarn = console.warn;
  console.warn = () => {};

  let text = "";
  try {
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    text = data.text;
  } catch (error) {
    console.error("[parse-pdf] Parsing error:", error);
    return NextResponse.json(
      { error: "Failed to parse PDF document." },
      { status: 500 },
    );
  } finally {
    // Always restore console.warn, even if parsing throws.
    console.warn = originalWarn;
  }

  if (!text?.trim()) {
    return NextResponse.json(
      { error: "Could not extract text from PDF." },
      { status: 422 },
    );
  }

  return NextResponse.json({ text });
}
