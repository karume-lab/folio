"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StepFields } from "@/features/builder/components/wizard-view/step-fields";
import { WizardNav } from "@/features/builder/components/wizard-view/wizard-nav";
import type { usePortfolioState } from "@/features/core/hooks/use-portfolio-state";

interface WizardViewProps {
  state: ReturnType<typeof usePortfolioState>;
}

export function WizardView({ state }: WizardViewProps) {
  return (
    <motion.main
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-xl mx-auto px-6 py-12 w-full"
    >
      {/* Wizard Nav Info */}
      <div className="flex justify-between items-center mb-8">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => state.setView("selection")}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/90 hover:text-foreground transition-colors cursor-pointer px-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Quit Wizard
        </Button>
        <span className="text-xs text-muted-foreground font-medium bg-secondary/80 border border-border/30 px-3 py-1 rounded-full">
          Step {state.wizardStep} of 5
        </span>
      </div>

      {/* Progress Line indicator */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step <= state.wizardStep ? "bg-brand-pink" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <Card className="bg-card/45 border-border/40 shadow-xl backdrop-blur-xl p-6 md:p-8 rounded-2xl min-h-80 flex flex-col justify-between">
        <div>
          {/* Step Title Container */}
          <div className="mb-6 space-y-1">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-brand-pink">
              {state.wizardStep === 1 && "The Headline"}
              {state.wizardStep === 2 && "The Proof"}
              {state.wizardStep === 3 && "The Toolkit"}
              {state.wizardStep === 4 && "The Design Vibe"}
              {state.wizardStep === 5 && "Profile Image"}
            </h2>
            <h3 className="text-lg font-bold text-foreground">
              {state.wizardStep === 1 &&
                "What is your name and professional title?"}
              {state.wizardStep === 2 &&
                "What are 2-3 major achievements you've landed?"}
              {state.wizardStep === 3 && "List your technical toolkit / stack"}
              {state.wizardStep === 4 &&
                "What is the design vibe you'd like to project?"}
              {state.wizardStep === 5 &&
                "Do you want to upload a profile avatar?"}
            </h3>
          </div>

          <StepFields
            wizardStep={state.wizardStep}
            wizardData={state.wizardData}
            setWizardData={state.setWizardData}
            profilePic={state.profilePic}
            setProfilePic={state.setProfilePic}
          />
        </div>

        <WizardNav
          wizardStep={state.wizardStep}
          setWizardStep={state.setWizardStep}
          wizardData={state.wizardData}
          setView={state.setView}
          startPortfolioGeneration={state.startPortfolioGeneration}
        />
      </Card>
    </motion.main>
  );
}
