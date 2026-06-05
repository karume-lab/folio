import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Keep pdf-parse out of the Webpack/Turbopack bundle so it is loaded from
  // node_modules at runtime in the Node.js serverless environment. This is
  // required for pdf-parse's internal pdfjs version resolution to work correctly.
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
