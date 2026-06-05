import { type NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

export const maxDuration = 30;

// pdf-parse uses a test file path at require-time unless suppressed.
// Importing it inside the route (dynamic) is enough for Next.js App Router.

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

    // pdf-parse v2: class-based API — pass buffer via { data } option
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();

    return NextResponse.json({ text: result.text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to parse PDF.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
