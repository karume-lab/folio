import { type NextRequest, NextResponse } from "next/server";
import PDFParser from "pdf2json";

// Strictly enforce Node runtime — Edge runtime lacks Buffer and fs APIs.
export const runtime = "nodejs";
// Prevent Vercel timeouts for larger PDFs.
export const maxDuration = 60;

/**
 * Parses a PDF buffer using pdf2json (pure-JS, no native canvas dependencies).
 * Wraps the event-emitter API in a Promise for clean async/await usage.
 */
function parsePdfBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    // needRawText=true tells pdf2json to populate getRawTextContent()
    const parser = new PDFParser(null, true);

    parser.on("pdfParser_dataError", (err) => {
      reject(err instanceof Error ? err : new Error(String(err)));
    });

    parser.on("pdfParser_dataReady", () => {
      resolve(parser.getRawTextContent());
    });

    // verbosity=0 silences pdfjs-dist console noise
    parser.parseBuffer(buffer, 0);
  });
}

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

  let text = "";
  try {
    text = await parsePdfBuffer(buffer);
  } catch (error) {
    console.error("[parse-pdf] Parsing error:", error);
    return NextResponse.json(
      { error: "Failed to parse PDF document." },
      { status: 500 },
    );
  }

  if (!text?.trim()) {
    return NextResponse.json(
      { error: "Could not extract text from PDF." },
      { status: 422 },
    );
  }

  return NextResponse.json({ text });
}
