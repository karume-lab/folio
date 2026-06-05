"use client";

import { motion } from "framer-motion";
import { Cpu } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { usePortfolioState } from "@/folio-app/hooks/use-portfolio-state";

interface GeneratingViewProps {
  state: ReturnType<typeof usePortfolioState>;
}

export function GeneratingView({ state }: GeneratingViewProps) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto px-6 py-20 w-full text-center flex flex-col items-center justify-center gap-6"
    >
      <div className="relative h-20 w-20 flex items-center justify-center bg-card border border-border/40 shadow-xl rounded-2xl mb-2 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-brand-purple/10 to-brand-pink/15 animate-pulse" />
        <Cpu
          className="h-10 w-10 text-brand-purple animate-spin"
          style={{ animationDuration: "3s" }}
        />
      </div>

      <div className="space-y-2">
        <h1 className="text-xl font-bold text-foreground">
          Designing your portfolio...
        </h1>
        <p className="text-xs text-muted-foreground/80 italic font-mono h-4">
          {state.generationPhase}
        </p>
      </div>

      <div className="w-full space-y-1">
        <Progress
          value={state.generationProgress}
          className="h-1.5 w-full bg-muted"
        />
        <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground/60">
          <span>Compilation Status</span>
          <span>{state.generationProgress}%</span>
        </div>
      </div>
    </motion.main>
  );
}
