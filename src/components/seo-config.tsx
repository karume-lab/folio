import type { Metadata } from "next";

export const metadataConfig: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://folio.ai"),
  title: {
    default: "Folio - AI Personal Portfolio Builder",
    template: "Folio | %s",
  },
  description:
    "Turn your professional CV / Résumé into a stunning, customized, portable personal portfolio website in 60 seconds with the power of AI. Download as a single HTML file.",
  keywords: [
    "CV / Résumé builder",
    "portfolio builder",
    "AI portfolio",
    "instant portfolio",
    "portable website",
    "HTML download",
    "resume builder",
    "web developer portfolio",
  ],
  authors: [{ name: "Folio Team", url: "https://folio.ai" }],
  creator: "Folio",
  publisher: "Folio",

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://folio.ai",
  },

  category: "technology",
};

const SEOConfig = () => {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Folio",
    headline: "AI Portfolio Builder",
    description:
      "Folio uses AI to turn professional CVs into instant, customized, portable personal portfolio websites that are downloadable as a single HTML file.",
    url: "https://folio.ai",
    image: "https://folio.ai/icon.png",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    keywords: [
      "AI Portfolio",
      "CV / Résumé Builder",
      "Tailwind CSS",
      "shadcn/ui",
    ].join(", "),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Folio",
    alternateName: ["Folio AI", "Folio Portfolio Builder"],
    url: "https://folio.ai",
    description:
      "The AI Portfolio Builder. Create your personal site instantly.",
    inLanguage: "en-US",
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: required to output JSON-LD schemas
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: required to output JSON-LD schemas
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
};

export default SEOConfig;
