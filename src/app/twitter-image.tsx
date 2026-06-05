import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Folio - AI Personal Portfolio Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const logoBuffer = readFileSync(join(process.cwd(), "public/logo.png"));
  const logoData = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
        backgroundImage: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 80px",
          gap: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 64,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.05em",
            marginBottom: "20px",
          }}
        >
          {/* biome-ignore lint/performance/noImgElement: standard img required for Satori */}
          <img
            src={logoData}
            alt="Folio Logo"
            style={{
              width: 80,
              height: 80,
              marginRight: 24,
              objectFit: "contain",
            }}
          />
          Folio
        </div>
        <h1
          style={{
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            margin: 0,
            color: "#f4f4f5",
          }}
        >
          Turn your CV into a stunning portfolio.
        </h1>
        <p
          style={{
            fontSize: 32,
            color: "#a1a1aa",
            fontWeight: 500,
            margin: 0,
            marginTop: "20px",
          }}
        >
          Generated in a few clicks with AI.
        </p>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
