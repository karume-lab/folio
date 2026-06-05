"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  ExternalLink,
  Globe,
  Loader2,
  X,
} from "lucide-react";
import { useState } from "react";
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
            className="bg-brand-pink hover:bg-brand-pink/90 text-foreground font-bold text-[10px] gap-1 px-3 h-7.5 rounded-xl shadow-md shadow-brand-pink/15 cursor-pointer disabled:opacity-60"
            disabled={state.isDeploying}
            onClick={() => state.handleDeploySite(state.generatedHtml)}
          >
            {state.isDeploying ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" /> Deploying...
              </>
            ) : (
              <>
                <Globe className="h-3 w-3" /> Deploy to Web
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content Preview Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden relative">
        {/* Visual Sandbox Iframe */}
        <IframeContainer generatedHtml={state.generatedHtml} />

        {/* Iterative Prompt Revision Panel */}
        <IterationBar
          chatHistory={state.chatHistory}
          isRevising={state.isRevising}
          chatInput={state.chatInput}
          setChatInput={state.setChatInput}
          applyRevision={state.applyRevision}
        />
      </div>

      {/* Deploy Success Modal */}
      <AnimatePresence>
        {state.deployedUrl && (
          <DeploySuccessModal
            url={state.deployedUrl}
            onClose={() => state.setDeployedUrl(null)}
          />
        )}
      </AnimatePresence>

      {/* Deploy Error Toast */}
      <AnimatePresence>
        {state.deployError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-destructive/10 border border-destructive/30 text-destructive rounded-2xl px-5 py-3 text-xs font-medium shadow-xl backdrop-blur-md flex items-center gap-2"
          >
            <X className="h-4 w-4 shrink-0" />
            {state.deployError}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}

// ─── Deploy Success Modal ────────────────────────────────────────────────────

interface DeploySuccessModalProps {
  url: string;
  onClose: () => void;
}

function DeploySuccessModal({ url, onClose }: DeploySuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 16 }}
        transition={{ type: "spring", damping: 22, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border/50 rounded-3xl shadow-2xl p-8 max-w-md w-full relative"
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon */}
        <div className="h-14 w-14 rounded-2xl bg-brand-pink/10 border border-brand-pink/20 flex items-center justify-center mb-5">
          <Globe className="h-7 w-7 text-brand-pink" />
        </div>

        <h2 className="text-lg font-bold text-foreground mb-1">
          Your portfolio is live! 🎉
        </h2>
        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          Share this link with anyone. It's permanently hosted and doesn't
          require any account.
        </p>

        {/* URL display */}
        <div className="bg-background/60 border border-border/40 rounded-xl px-3 py-2.5 flex items-center gap-2 mb-4 overflow-hidden">
          <span className="text-xs text-foreground font-mono flex-1 truncate">
            {url}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
            title="Copy link"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-brand-purple" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl border-border text-xs font-semibold"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-brand-purple" /> Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copy Link
              </>
            )}
          </Button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              size="sm"
              className="w-full rounded-xl bg-brand-pink hover:bg-brand-pink/90 text-foreground text-xs font-bold gap-1.5 shadow-md shadow-brand-pink/15"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Open Live Site
            </Button>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
