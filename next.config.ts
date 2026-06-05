import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Keep pdf-parse, pdfjs-dist, and @napi-rs/canvas out of the Webpack/
  // Turbopack bundle so they are loaded from node_modules at runtime.
  // This avoids DOMMatrix / native-addon bundling errors.
  serverExternalPackages: ["pdf-parse", "pdfjs-dist", "@napi-rs/canvas"],
  // pdfjs-dist loads pdf.worker.mjs via a runtime dynamic import string that
  // the static file tracer (@vercel/nft) cannot follow. Explicitly include the
  // file so Vercel ships it alongside the /api/parse-pdf serverless function.
  outputFileTracingIncludes: {
    "/api/parse-pdf": [
      "./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs",
      "./node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    ],
  },
};

export default nextConfig;
