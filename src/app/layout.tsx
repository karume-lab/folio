import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { BackToTopButton } from "@/components/back-to-top-button";
import { ChangeMetadataTitleOnBlur } from "@/components/change-metadata-title-on-blur";
import SEOConfig, { metadataConfig } from "@/components/seo-config";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = metadataConfig;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <head>
        <SEOConfig />
      </head>
      <body className="min-h-full flex flex-col">
        <SmoothScrollProvider>
          <ChangeMetadataTitleOnBlur />
          <BackToTopButton />
          <main className="flex-1">{children}</main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
