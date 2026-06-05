"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { PdfUploadView } from "@/features/builder/components/pdf-upload-view";
import { WizardView } from "@/features/builder/components/wizard-view";
import { GeneratingView } from "@/features/core/components/generating-view";
import { SelectionView } from "@/features/core/components/selection-view";
import { usePortfolioState } from "@/features/core/hooks/use-portfolio-state";
import { PreviewView } from "@/features/preview/components/preview-view";

export function FolioAppOrchestrator() {
  const state = usePortfolioState();

  return (
    <div className="h-screen bg-background text-muted-foreground font-sans overflow-hidden selection:bg-brand-purple/20 selection:text-foreground relative flex flex-col">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle
          size="sm"
          className="bg-background/60 backdrop-blur-xl border border-border shadow-md"
        />
      </div>
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-150 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[35%] h-[55%] rounded-full bg-brand-purple/10 blur-[130px]" />
        <div className="absolute top-[-5%] right-[20%] w-[35%] h-[50%] rounded-full bg-brand-pink/10 blur-[120px]" />
      </div>

      {/* Persistent Toast Recovery Overlay */}
      <AnimatePresence>
        {state.toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)]"
          >
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card/90 p-4.5 pr-10 shadow-2xl backdrop-blur-xl w-full">
              <div className="absolute top-3 right-3">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => state.setToast(null)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <AlertCircle className="h-5 w-5 text-brand-pink shrink-0" />
                <span className="text-sm font-medium">
                  {state.toast.message}
                </span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end mt-2 sm:mt-0">
                <Button
                  size="xs"
                  className="bg-brand-purple text-foreground hover:bg-brand-purple/90 font-bold px-3.5 py-1 text-xs"
                  onClick={state.handleResumeSession}
                >
                  Resume
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  className="border-border text-foreground hover:bg-secondary font-semibold px-3 py-1 text-xs"
                  onClick={state.handleStartFresh}
                >
                  Start Fresh
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main UI Stage Router */}
      <div className="flex-1 w-full flex flex-col justify-center relative z-10 overflow-hidden">
        <AnimatePresence mode="wait">
          {state.view === "selection" && <SelectionView state={state} />}

          {state.view === "pdf-upload" && <PdfUploadView state={state} />}

          {state.view === "wizard" && <WizardView state={state} />}

          {state.view === "generating" && <GeneratingView state={state} />}

          {state.view === "preview" && <PreviewView state={state} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
