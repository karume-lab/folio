"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Download, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IframeContainer } from "@/folio-app/components/preview-view/iframe-container";
import { IterationBar } from "@/folio-app/components/preview-view/iteration-bar";
import type { usePortfolioState } from "@/folio-app/hooks/use-portfolio-state";

interface PreviewViewProps {
  state: ReturnType<typeof usePortfolioState>;
}

export function PreviewView({ state }: PreviewViewProps) {
  return (
    <motion.main
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      className="h-screen w-screen flex flex-col justify-between bg-zinc-950/20 backdrop-blur-md relative"
    >
      {/* Preview Header Navbar */}
      <div className="h-14 border-b border-border/30 bg-card/65 px-4 flex items-center justify-between shrink-0 z-20">
        <button
          type="button"
          onClick={() => state.setView("selection")}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/90 hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Editor
        </button>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="xs"
            className="border-border text-foreground hover:bg-secondary font-semibold text-[10px] gap-1 px-3 h-7.5 rounded-xl cursor-pointer"
            onClick={state.triggerHtmlDownload}
          >
            <Download className="h-3 w-3" /> Download HTML
          </Button>
          <Button
            type="button"
            size="xs"
            className="bg-brand-pink hover:bg-brand-pink/90 text-foreground font-bold text-[10px] gap-1 px-3 h-7.5 rounded-xl shadow-md shadow-brand-pink/15 cursor-pointer"
            onClick={() =>
              alert(
                "Simulated Deploy: Compiled code uploaded to Edge Serverless clusters!",
              )
            }
          >
            <Globe className="h-3 w-3" /> Deploy to Web
          </Button>
        </div>
      </div>

      {/* Main Content Preview Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden relative">
        {/* Visual Sandbox Iframe (7 cols) */}
        <IframeContainer generatedHtml={state.generatedHtml} />

        {/* Iterative Prompt Revision Panel (4 cols) */}
        <IterationBar
          chatHistory={state.chatHistory}
          isRevising={state.isRevising}
          chatInput={state.chatInput}
          setChatInput={state.setChatInput}
          applyRevision={state.applyRevision}
        />
      </div>
    </motion.main>
  );
}
