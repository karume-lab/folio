import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Keep pdf2json out of the Webpack/Turbopack bundle so it is loaded from
  // node_modules at runtime in the Node.js serverless environment.
  serverExternalPackages: ["pdf2json"],
};

export default nextConfig;
