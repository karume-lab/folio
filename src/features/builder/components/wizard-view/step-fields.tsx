"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AvatarStep } from "@/features/builder/components/wizard-view/avatar-step";
import type { WizardData } from "@/features/core/types";

interface StepFieldsProps {
  wizardStep: number;
  wizardData: WizardData;
  setWizardData: React.Dispatch<React.SetStateAction<WizardData>>;
  profilePic: string | null;
  setProfilePic: (pic: string | null) => void;
}

export function StepFields({
  wizardStep,
  wizardData,
  setWizardData,
  profilePic,
  setProfilePic,
}: StepFieldsProps) {
  const [localData, setLocalData] = useState<WizardData>(wizardData);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync when parent changes (e.g. initial load or external update)
  useEffect(() => {
    setLocalData(wizardData);
  }, [wizardData]);

  // Update local immediately, debounce update to parent
  const updateField = useCallback(
    (field: keyof WizardData, value: string) => {
      setLocalData((prev) => {
        const next = { ...prev, [field]: value } as WizardData;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setWizardData(next);
        }, 300);
        return next;
      });
    },
    [setWizardData],
  );

  return (
    <AnimatePresence mode="wait">
      {wizardStep === 1 && (
        <motion.div
          key="step-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-4"
        >
          <div className="space-y-1">
            <Label
              htmlFor="name-input"
              className="text-xs text-muted-foreground/80 font-semibold"
            >
              Your Name
            </Label>
            <Input
              id="name-input"
              placeholder="e.g. John Doe"
              value={localData.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="bg-background/20 border-border text-foreground rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="headline-input"
              className="text-xs text-muted-foreground/80 font-semibold"
            >
              Professional Title / Headline
            </Label>
            <Input
              id="headline-input"
              placeholder="e.g. Lead Software Engineer specializing in Next.js"
              value={localData.headline}
              onChange={(e) => updateField("headline", e.target.value)}
              className="bg-background/20 border-border text-foreground rounded-xl"
            />
          </div>
        </motion.div>
      )}

      {wizardStep === 2 && (
        <motion.div
          key="step-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-2"
        >
          <Label
            htmlFor="achievements-input"
            className="text-xs text-muted-foreground/80 font-semibold"
          >
            Major Achievements (one per line)
          </Label>
          <Textarea
            id="achievements-input"
            placeholder="Shipped an open-source deployments engine reaching 2k stars.&#10;Decreased React client bundle weights by 45%.&#10;Mentored 10+ software engineers on Next.js architectures."
            value={localData.achievements}
            onChange={(e) => updateField("achievements", e.target.value)}
            className="bg-background/20 border-border text-foreground rounded-xl text-xs py-3 h-32 placeholder:text-muted-foreground/40"
          />
        </motion.div>
      )}

      {wizardStep === 3 && (
        <motion.div
          key="step-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-2"
        >
          <Label
            htmlFor="skills-input"
            className="text-xs text-muted-foreground/80 font-semibold"
          >
            Skills (comma-separated)
          </Label>
          <Input
            id="skills-input"
            placeholder="e.g. Next.js, React, TypeScript, Tailwind CSS, AWS"
            value={localData.skills}
            onChange={(e) => updateField("skills", e.target.value)}
            className="bg-background/20 border-border text-foreground rounded-xl"
          />
        </motion.div>
      )}

      {wizardStep === 4 && (
        <motion.div
          key="step-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-2"
        >
          <Label
            htmlFor="vibe-input"
            className="text-xs text-muted-foreground/80 font-semibold"
          >
            Design theme instructions
          </Label>
          <Textarea
            id="vibe-input"
            placeholder="e.g. Minimalist slate dark layout, high contrast white text, clean grids."
            value={localData.vibe}
            onChange={(e) => updateField("vibe", e.target.value)}
            className="bg-background/20 border-border text-foreground rounded-xl text-xs py-3 h-28 placeholder:text-muted-foreground/40"
          />
        </motion.div>
      )}

      {wizardStep === 5 && (
        <AvatarStep profilePic={profilePic} setProfilePic={setProfilePic} />
      )}
    </AnimatePresence>
  );
}
