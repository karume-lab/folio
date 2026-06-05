"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Upload } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { usePortfolioState } from "@/folio-app/hooks/use-portfolio-state";

interface SelectionViewProps {
  state: ReturnType<typeof usePortfolioState>;
}

export function SelectionView({ state }: SelectionViewProps) {
  return (
    <motion.main
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-6 py-20 w-full"
    >
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
          How do you want to{" "}
          <span className="bg-clip-text text-transparent bg-linear-to-r from-brand-purple via-brand-pink to-brand-gold">
            start?
          </span>
        </h1>
        <p className="text-base text-muted-foreground max-w-lg mx-auto">
          Select a workflow to design your engineering portfolio. You can build
          from scratch or upload an existing resume.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* Option A: Upload Resume */}
        <Card
          onClick={() => state.setView("pdf-upload")}
          className="bg-card/45 border-border/40 hover:border-brand-purple/55 hover:shadow-brand-purple/5 shadow-lg backdrop-blur-xl p-8 rounded-2xl flex flex-col justify-between group cursor-pointer transition-all duration-300 relative overflow-hidden"
        >
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple mb-6 transition-all duration-300 group-hover:scale-105">
              <Upload className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl text-foreground font-bold group-hover:text-brand-purple transition-colors">
              Upload PDF Resume
            </CardTitle>
            <CardDescription className="text-muted-foreground/80 leading-relaxed text-sm">
              Upload your ready-made CV / Résumé PDF. Our processing engine will
              extract your key credentials, achievements, and tech stack in
              seconds.
            </CardDescription>
          </div>
          <div className="mt-8 flex items-center gap-1.5 text-xs text-brand-purple font-semibold">
            <span>Fastest path</span>{" "}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Card>

        {/* Option B: Guided Wizard */}
        <Card
          onClick={() => state.setView("wizard")}
          className="bg-card/45 border-border/40 hover:border-brand-pink/55 hover:shadow-brand-pink/5 shadow-lg backdrop-blur-xl p-8 rounded-2xl flex flex-col justify-between group cursor-pointer transition-all duration-300 relative overflow-hidden"
        >
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-brand-pink/10 border border-brand-pink/20 flex items-center justify-center text-brand-pink mb-6 transition-all duration-300 group-hover:scale-105">
              <Sparkles className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl text-foreground font-bold group-hover:text-brand-pink transition-colors">
              Build from Scratch
            </CardTitle>
            <CardDescription className="text-muted-foreground/80 leading-relaxed text-sm">
              Walk through our guided wizard questions. Ideal if you want to
              frame your experience specifically for your next ideal tech role.
            </CardDescription>
          </div>
          <div className="mt-8 flex items-center gap-1.5 text-xs text-brand-pink font-semibold">
            <span>Guided builder</span>{" "}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Card>
      </div>
    </motion.main>
  );
}
