import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getAdminFirestore } from "@/lib/firebase-admin";

export const alt = "Folio Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Edge runtime can't use firebase-admin easily, so use standard Node.
// export const runtime = "edge";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Image({ params }: Props) {
  const { id } = await params;
  let userName = "Folio User";

  try {
    const db = getAdminFirestore();
    const doc = await db
      .collection(process.env.FIREBASE_DEPLOYMENTS_COLLECTION || "deployments")
      .doc(id)
      .get();

    if (doc.exists) {
      const htmlContent = doc.data()?.htmlContent as string | undefined;
      if (htmlContent) {
        // Extract title using a simple regex: <title>Name - ...</title>
        const titleMatch = htmlContent.match(/<title>([^<]*)<\/title>/i);
        if (titleMatch?.[1]) {
          const fullTitle = titleMatch[1].trim();
          // Assuming title format "User Name - Professional Portfolio"
          const namePart = fullTitle.split(" -")[0].trim();
          userName = namePart || "Folio User";
        }
      }
    }
  } catch (error) {
    console.error("Error fetching deployment for OG image:", error);
  }

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
        <h1
          style={{
            fontSize: 84,
            fontWeight: 800,
            letterSpacing: "-0.05em",
            lineHeight: 1.1,
            margin: 0,
            color: "#ffffff",
          }}
        >
          {userName}
        </h1>
        <p
          style={{
            fontSize: 32,
            color: "#a1a1aa",
            fontWeight: 500,
            margin: 0,
          }}
        >
          Built with Folio
        </p>
      </div>
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 40,
          display: "flex",
          alignItems: "center",
          fontSize: 28,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: "-0.05em",
        }}
      >
        {/* biome-ignore lint/performance/noImgElement: standard img required for Satori */}
        <img
          src={logoData}
          alt="Folio Logo"
          style={{
            width: 40,
            height: 40,
            marginRight: 16,
            objectFit: "contain",
          }}
        />
        Folio
      </div>
    </div>,
    {
      ...size,
    },
  );
}
