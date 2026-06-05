"use client";

import { AnimatePresence, motion } from "framer-motion";
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
              value={wizardData.name}
              onChange={(e) =>
                setWizardData((prev) => ({ ...prev, name: e.target.value }))
              }
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
              value={wizardData.headline}
              onChange={(e) =>
                setWizardData((prev) => ({ ...prev, headline: e.target.value }))
              }
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
            value={wizardData.achievements}
            onChange={(e) =>
              setWizardData((prev) => ({
                ...prev,
                achievements: e.target.value,
              }))
            }
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
            value={wizardData.skills}
            onChange={(e) =>
              setWizardData((prev) => ({ ...prev, skills: e.target.value }))
            }
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
            value={wizardData.vibe}
            onChange={(e) =>
              setWizardData((prev) => ({ ...prev, vibe: e.target.value }))
            }
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
