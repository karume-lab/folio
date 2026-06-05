"use client";

import { ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ViewState, WizardData } from "@/folio-app/types";

interface WizardNavProps {
  wizardStep: number;
  setWizardStep: React.Dispatch<React.SetStateAction<number>>;
  wizardData: WizardData;
  setView: (view: ViewState) => void;
  startPortfolioGeneration: () => void;
}

export function WizardNav({
  wizardStep,
  setWizardStep,
  wizardData,
  setView,
  startPortfolioGeneration,
}: WizardNavProps) {
  const isCurrentStepInvalid =
    (wizardStep === 1 &&
      (!wizardData.name.trim() || !wizardData.headline.trim())) ||
    (wizardStep === 2 && !wizardData.achievements.trim()) ||
    (wizardStep === 3 && !wizardData.skills.trim()) ||
    (wizardStep === 4 && !wizardData.vibe.trim());

  return (
    <div className="flex gap-4 pt-8">
      {wizardStep > 1 ? (
        <Button
          type="button"
          variant="outline"
          className="border-border text-foreground hover:bg-secondary rounded-xl py-5 px-6 font-semibold text-xs cursor-pointer"
          onClick={() => setWizardStep((prev) => prev - 1)}
        >
          Back
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="border-border text-foreground hover:bg-secondary rounded-xl py-5 px-6 font-semibold text-xs cursor-pointer"
          onClick={() => setView("selection")}
        >
          Cancel
        </Button>
      )}

      {wizardStep < 5 ? (
        <Button
          type="button"
          className="flex-1 bg-brand-pink hover:bg-brand-pink/90 text-foreground font-semibold py-5 rounded-xl text-xs gap-1.5 shadow-lg shadow-brand-pink/15 disabled:opacity-50 cursor-pointer"
          disabled={isCurrentStepInvalid}
          onClick={() => setWizardStep((prev) => prev + 1)}
        >
          Next Step <ArrowRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          className="flex-1 bg-brand-purple hover:bg-brand-purple/90 text-foreground font-semibold py-5 rounded-xl text-xs gap-1.5 shadow-lg shadow-brand-purple/15 disabled:opacity-50 cursor-pointer"
          disabled={isCurrentStepInvalid}
          onClick={startPortfolioGeneration}
        >
          <RefreshCw className="h-4 w-4" /> Generate Portfolio
        </Button>
      )}
    </div>
  );
}
