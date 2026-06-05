"use client";

import {
  Download,
  ExternalLink,
  Eye,
  FileText,
  RefreshCw,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock themes for the interactive browser mockup preview
const PREVIEW_THEMES = {
  minimal: {
    name: "Minimalist Slate",
    bg: "bg-minimal-bg text-minimal-fg border-minimal-border",
    accent: "bg-minimal-accent text-minimal-accent-fg",
    cardBg: "bg-minimal-card border-minimal-border",
    textMuted: "text-minimal-muted",
    badge: "bg-minimal-badge text-minimal-badge-fg border-minimal-badge-border",
  },
  neon: {
    name: "Developer Dark",
    bg: "bg-neon-bg text-neon-fg border-neon-border",
    accent: "bg-neon-accent text-neon-accent-fg hover:bg-neon-accent-hover",
    cardBg: "bg-neon-card border-neon-card-border",
    textMuted: "text-neon-muted",
    badge: "bg-neon-badge text-neon-badge-fg border-neon-badge-border",
  },
  creative: {
    name: "Creative Gradient",
    bg: "bg-linear-to-br from-brand-purple/40 via-brand-pink/20 to-brand-gold/10 text-foreground border-brand-purple/30",
    accent:
      "bg-linear-to-r from-brand-pink to-brand-gold text-background font-bold hover:opacity-90",
    cardBg: "bg-card/5 backdrop-blur-md border-border/15",
    textMuted: "text-muted-foreground",
    badge: "bg-brand-purple/20 text-brand-pink border-brand-pink/30",
  },
};

export function InteractiveMockup() {
  const [activeTheme, setActiveTheme] =
    useState<keyof typeof PREVIEW_THEMES>("creative");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(100);
  const [selectedFile, setSelectedFile] = useState<string | null>(
    "cv_john_doe_lead_engineer.pdf",
  );

  const handleSimulateGeneration = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const themeConfig = PREVIEW_THEMES[activeTheme];

  return (
    <div
      id="interactive-mockup"
      className="relative max-w-5xl mx-auto rounded-2xl border border-border bg-card/80 p-1.5 md:p-3 shadow-brand-pink/10 backdrop-blur-xl"
    >
      {/* Outer Chrome header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 text-xs text-muted-foreground/80">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-destructive/40" />
          <span className="w-3 h-3 rounded-full bg-brand-gold/40" />
          <span className="w-3 h-3 rounded-full bg-success/40" />
        </div>
        <div className="bg-muted/50 px-6 py-1 rounded-md text-muted-foreground border border-border/30 flex items-center gap-1.5 max-w-70 sm:max-w-xs overflow-hidden truncate">
          <span className="text-muted-foreground/60">https://</span>
          <span>folio.ai/johndoe</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] py-0 px-2 h-5">
            Live Portfolio
          </Badge>
        </div>
      </div>

      {/* Interactive Mockup Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 p-2 md:p-4 min-h-125">
        {/* Left Column: CV Input & Wizard controls */}
        <div className="lg:col-span-5 flex flex-col gap-4 bg-secondary/50 border border-border/30 rounded-xl p-4 md:p-5">
          <div className="flex items-center justify-between pb-2 border-b border-border/30">
            <span className="font-semibold text-foreground flex items-center gap-1.5 text-sm">
              <FileText className="h-4 w-4 text-brand-purple" />
              Source CV Context
            </span>
            <span className="text-xs text-muted-foreground/80">Input</span>
          </div>

          {/* PDF Drop Area */}
          <div className="border border-dashed border-border rounded-lg p-5 text-center flex flex-col items-center justify-center bg-background/20 hover:border-brand-purple/40 transition-colors">
            <Upload className="h-8 w-8 text-muted-foreground/60 mb-2" />
            <p className="text-xs text-muted-foreground font-medium mb-1">
              {selectedFile ? selectedFile : "Upload your resume PDF"}
            </p>
            <p className="text-[10px] text-muted-foreground/60">
              Supports PDF, DOCX, or Wizard builder
            </p>
            {selectedFile && (
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="mt-3 text-[10px] text-brand-purple hover:text-brand-purple/80 underline"
              >
                Clear and upload different CV
              </button>
            )}
          </div>

          {/* AI Personalization Controls */}
          <div className="space-y-4 pt-2">
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                Folio Theme Mode
              </span>
              <Tabs
                value={activeTheme}
                onValueChange={(val) =>
                  setActiveTheme(val as keyof typeof PREVIEW_THEMES)
                }
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 w-full bg-secondary border border-border/30 p-0.75 h-9">
                  {(
                    Object.keys(PREVIEW_THEMES) as Array<
                      keyof typeof PREVIEW_THEMES
                    >
                  ).map((key) => (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="text-xs px-2.5 font-medium transition-all cursor-pointer"
                    >
                      {PREVIEW_THEMES[key].name.split(" ")[0]}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Folio Prompts / Adjustments
              </span>
              <div className="bg-background/30 border border-border/30 rounded-lg p-2.5 text-xs text-muted-foreground/90 italic font-mono leading-relaxed">
                &ldquo;Make the design feel highly modern with clear cards,
                highlight my TypeScript experience, and use a professional but
                friendly tone.&rdquo;
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                className="w-full bg-brand-purple hover:bg-brand-purple/90 text-foreground font-medium gap-2 py-5 shadow-lg shadow-brand-purple/15"
                isLoading={isGenerating}
                onClick={handleSimulateGeneration}
              >
                Generate with Folio
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Instant Portfolio Live Preview */}
        <div className="lg:col-span-7 flex flex-col bg-secondary/20 border border-border/30 rounded-xl overflow-hidden min-h-100">
          <div className="flex items-center justify-between p-3 border-b border-border/30 bg-card/40">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
              Generated Portfolio Live Preview
            </span>

            {/* Download Button simulation */}
            <Button
              type="button"
              size="xs"
              className="font-semibold text-[10px] gap-1 px-2.5 h-6"
              onClick={() =>
                alert(
                  "Simulated Download: A single portable index.html containing all assets, styling, and navigation is compiled and downloaded!",
                )
              }
            >
              <Download className="h-3 w-3" />
              Download HTML
            </Button>
          </div>

          {/* Live Preview Dynamic Body */}
          <div className="flex-1 p-5 overflow-y-auto flex flex-col justify-between transition-all duration-500">
            {isGenerating ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="h-8 w-8 text-brand-purple animate-spin" />
                <p className="text-sm font-medium text-foreground">
                  Folio is customizing layouts and code...
                </p>
                <div className="w-48 bg-muted h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-pink h-full transition-all duration-150"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div
                className={`flex-1 flex flex-col justify-between rounded-lg p-5 border shadow-xl transition-all duration-300 ${themeConfig.bg}`}
              >
                <div>
                  {/* Nav Mock */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold tracking-tight text-sm">
                      JD.
                    </span>
                    <div className="flex gap-3 text-[10px] font-medium opacity-80">
                      <span>About</span>
                      <span>Projects</span>
                      <span>Contact</span>
                    </div>
                  </div>

                  {/* Bio Mock */}
                  <div className="mb-6 space-y-2">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold border ${themeConfig.badge}`}
                    >
                      Available for Roles
                    </span>
                    <h2 className="text-xl font-bold tracking-tight leading-tight">
                      John Doe
                    </h2>
                    <p
                      className={`text-xs leading-relaxed max-w-sm ${themeConfig.textMuted}`}
                    >
                      Lead Software Engineer specializing in scalable Next.js
                      applications and cloud architecture. Over 8 years of
                      building developer tools.
                    </p>
                  </div>

                  {/* Selected Experience Card Mock */}
                  <div className="space-y-2">
                    <h3 className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                      Featured Project
                    </h3>
                    <div
                      className={`p-3 rounded-lg border text-xs ${themeConfig.cardBg}`}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="font-semibold text-xs">
                          Vercel Deployments CLI
                        </span>
                        <span
                          className={`text-[9px] px-1.5 rounded font-mono ${themeConfig.badge}`}
                        >
                          React
                        </span>
                      </div>
                      <p
                        className={`text-[10px] leading-relaxed mb-2 ${themeConfig.textMuted}`}
                      >
                        Open-source command line tool to deploy serverless
                        clusters with a single command. Reached 2k+ GitHub
                        Stars.
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-md font-medium cursor-pointer transition-all ${themeConfig.accent}`}
                      >
                        View Github <ExternalLink className="h-2.5 w-2.5" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-current/10 flex justify-between items-center text-[9px] opacity-60">
                  <span>&copy; 2026 John Doe.</span>
                  <span>
                    Built by{" "}
                    <Link
                      href={
                        process.env.NEXT_PUBLIC_APP_URL ||
                        "https://folio.vercel.app"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold hover:opacity-100 transition-opacity inline-flex items-center gap-0.5"
                    >
                      Folio <ExternalLink className="h-2.5 w-2.5" />
                    </Link>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
