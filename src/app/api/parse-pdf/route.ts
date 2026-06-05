import { NextResponse } from "next/server";
import PDFParser from "pdf2json";

// Strictly enforce Node runtime — Edge runtime lacks Buffer and fs APIs.
export const runtime = "nodejs";
// Prevent Vercel timeouts for larger PDFs.
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No PDF uploaded." }, { status: 400 });
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

    const buffer = Buffer.from(await file.arrayBuffer());

    return new Promise<NextResponse>((resolve) => {
      // The second argument (1) tells pdf2json to extract raw text only,
      // bypassing the heavier layout/graphics parsing.
      const pdfParser = new PDFParser(null, true);

      pdfParser.on("pdfParser_dataError", (errData) => {
        const cause = "parserError" in errData ? errData.parserError : errData;
        console.error("[parse-pdf] Parsing error:", cause);
        resolve(
          NextResponse.json(
            { error: "Failed to parse PDF document." },
            { status: 500 },
          ),
        );
      });

      pdfParser.on("pdfParser_dataReady", () => {
        // pdf2json URI-encodes spaces and special characters in raw text.
        const text = decodeURIComponent(pdfParser.getRawTextContent());
        resolve(NextResponse.json({ text }));
      });

      pdfParser.parseBuffer(buffer);
    });
  } catch (error) {
    console.error("[parse-pdf] Route error:", error);
    return NextResponse.json(
      { error: "Internal server error during upload." },
      { status: 500 },
    );
  }
}
