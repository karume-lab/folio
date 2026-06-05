"use client";

import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PdfUploadPicZone } from "@/features/builder/components/pdf-upload-pic-zone";
import type { usePortfolioState } from "@/features/core/hooks/use-portfolio-state";

interface PdfUploadViewProps {
  state: ReturnType<typeof usePortfolioState>;
}

export function PdfUploadView({ state }: PdfUploadViewProps) {
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // [CHANGED] Call handleExtractPdfText instead of just setting the filename
  const handlePdfFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPdf(false);
    const file = e.dataTransfer.files?.[0];
    if (
      file &&
      (file.type === "application/pdf" || file.name.endsWith(".pdf"))
    ) {
      state.handleExtractPdfText(file);
    }
  };

  // [CHANGED] Same — trigger real extraction on file input change
  const handlePdfSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      state.handleExtractPdfText(file);
    }
  };

  return (
    <MotionWrapper>
      <div className="max-w-2xl mx-auto w-full flex flex-col max-h-full">
        <div className="flex-none mb-6">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => state.setView("selection")}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/90 hover:text-foreground transition-colors cursor-pointer px-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to choices
          </Button>
        </div>

        <Card className="bg-card/45 border-border/40 shadow-xl backdrop-blur-xl p-6 md:p-8 rounded-2xl space-y-6 overflow-y-auto shrink">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Upload Resume PDF
            </h1>
            <p className="text-xs text-muted-foreground">
              Drop your document and specify details to customize layouts.
            </p>
          </div>

          {/* PDF Drop Area */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: dropzone triggers input click */}
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: dropzone interactive via input */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingPdf(true);
            }}
            onDragLeave={() => setIsDraggingPdf(false)}
            onDrop={handlePdfFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
              isDraggingPdf
                ? "border-brand-purple bg-brand-purple/5"
                : "border-border bg-background/25 hover:border-brand-purple/40"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handlePdfSelection}
            />

            {/* [CHANGED] Three states: parsing / file+text ready / idle */}
            {state.isParsingPdf ? (
              // Loading state while pdf-parse runs on the server
              <>
                <RefreshCw className="h-9 w-9 text-brand-purple animate-spin mb-3" />
                <p className="text-sm font-semibold text-foreground">
                  Extract resume text
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  This only takes a moment.
                </p>
              </>
            ) : state.pdfFileName && state.pdfText ? (
              // Extraction succeeded — show filename + clear button
              <>
                <Upload className="h-10 w-10 text-brand-purple/70 mb-3" />
                <div className="text-sm font-semibold text-foreground mb-1 flex items-center justify-center gap-2">
                  <span>{state.pdfFileName}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      state.setPdfFileName(null);
                    }}
                    className="hover:bg-muted/80 text-muted-foreground hover:text-brand-pink transition-colors cursor-pointer shrink-0"
                    title="Remove file"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-brand-purple/80 font-medium">
                  ✓ Resume text extracted — ready to generate
                </p>
              </>
            ) : (
              // Idle / no file selected
              <>
                <Upload className="h-10 w-10 text-muted-foreground/60 mb-3" />
                <div className="text-sm font-semibold text-foreground mb-1">
                  <span>Drag and drop your PDF CV / Résumé</span>
                </div>
                <p className="text-xs text-muted-foreground/75">
                  Supports PDF documents up to 10MB
                </p>
              </>
            )}
          </div>

          {/* Profile Pic Upload */}
          <PdfUploadPicZone
            profilePic={state.profilePic}
            setProfilePic={state.setProfilePic}
          />

          {/* Theme / Personalization Prompt */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90">
              Personalization Prompt
            </Label>
            <Textarea
              placeholder="e.g., Highlight my frontend credentials, use a minimal slate dark theme with a very professional tone."
              value={state.personalizationPrompt}
              onChange={(e) => state.setPersonalizationPrompt(e.target.value)}
              className="bg-background/30 border-border text-foreground rounded-xl text-xs py-3 h-24 placeholder:text-muted-foreground/50 resize-none focus-visible:ring-brand-purple"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-secondary rounded-xl py-5 font-semibold text-xs"
              onClick={state.handleStartFresh}
            >
              Clear and Restart
            </Button>
            <Button
              type="button"
              className="flex-1 bg-brand-purple hover:bg-brand-purple/90 text-foreground font-semibold py-5 rounded-xl text-xs gap-2 shadow-lg shadow-brand-purple/15 disabled:opacity-50"
              isLoading={state.isParsingPdf}
              disabled={!state.pdfText}
              onClick={state.startPortfolioGeneration}
            >
              <RefreshCw className="h-4 w-4" /> Generate Portfolio
            </Button>
          </div>
        </Card>
      </div>
    </MotionWrapper>
  );
}

// Wrapper to co-locate transition animations
function MotionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full h-full flex items-center justify-center overflow-hidden p-4 md:p-8"
    >
      {children}
    </motion.main>
  );
}
