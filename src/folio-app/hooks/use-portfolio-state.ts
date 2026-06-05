"use client";

import { useState } from "react";
import { useSessionRecovery } from "@/folio-app/hooks/use-session-recovery";
import type { ChatMessage, ViewState, WizardData } from "@/folio-app/types";
import { compilePortfolioHTML } from "@/folio-app/utils/compile-html";
import { triggerHtmlDownload as downloadHtml } from "@/folio-app/utils/download";
import { MOCK_DEVOPS } from "@/folio-app/utils/mock-data";

const GENERATION_PHASES = [
  { max: 20, text: "Analyzing input constraints..." },
  { max: 45, text: "Extracting credentials and keywords..." },
  { max: 70, text: "Compiling layout aesthetics..." },
  { max: 90, text: "Writing Tailwind styling classes..." },
  { max: 100, text: "Publishing responsive sandbox DOM..." },
];

export function usePortfolioState() {
  const [view, setView] = useState<ViewState>("selection");
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [personalizationPrompt, setPersonalizationPrompt] = useState("");

  // Guided Wizard States
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    name: "",
    headline: "",
    achievements: "",
    skills: "",
    vibe: "",
  });

  // Drag & drop highlight state
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);
  const [isDraggingPic, setIsDraggingPic] = useState(false);

  // Generating Screen progress
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationPhase, setGenerationPhase] = useState(
    "Initializing generator context...",
  );

  // Compiled portfolio outputs
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isRevising, setIsRevising] = useState(false);

  // Session draft recovery & auto-persistence
  const { toast, setToast, handleResumeSession, handleStartFresh } =
    useSessionRecovery({
      view,
      setView,
      pdfFileName,
      setPdfFileName,
      setProfilePic,
      personalizationPrompt,
      setPersonalizationPrompt,
      wizardStep,
      setWizardStep,
      wizardData,
      setWizardData,
    });

  // Launch Simulated Generation State
  const startPortfolioGeneration = () => {
    setView("generating");
    setGenerationProgress(0);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 4;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          // Build preview based on active choice path
          let html = "";
          if (pdfFileName) {
            html = compilePortfolioHTML(
              MOCK_DEVOPS.name,
              MOCK_DEVOPS.headline,
              MOCK_DEVOPS.achievements,
              MOCK_DEVOPS.skills,
              personalizationPrompt,
            );
          } else {
            html = compilePortfolioHTML(
              wizardData.name,
              wizardData.headline,
              wizardData.achievements,
              wizardData.skills,
              wizardData.vibe,
            );
          }

          setGeneratedHtml(html);
          setView("preview");
          setChatHistory([
            {
              sender: "system",
              text: "Hello! I have generated your customized portfolio preview. You can iterate on details (e.g., 'make the background neon', 'tweak the headlines') using the refinement box below.",
            },
          ]);
        }, 500);
      }

      setGenerationProgress(currentProgress);
      const phase = GENERATION_PHASES.find((p) => currentProgress <= p.max);
      if (phase) setGenerationPhase(phase.text);
    }, 180);
  };

  // Iterative Revision Submission
  const applyRevision = (userText: string) => {
    setChatHistory((prev) => [...prev, { sender: "user", text: userText }]);
    setIsRevising(true);

    setTimeout(() => {
      setIsRevising(false);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "system",
          text: `Understood. Re-compiling styles and modifying layout structures to reflect your suggestion: "${userText}".`,
        },
      ]);

      // Regenerate with adjusted vibes
      let name = wizardData.name;
      let headline = wizardData.headline;
      let achievements = wizardData.achievements;
      let skills = wizardData.skills;
      let promptVal = personalizationPrompt;

      if (pdfFileName) {
        name = MOCK_DEVOPS.name;
        headline = MOCK_DEVOPS.headline;
        achievements = MOCK_DEVOPS.achievements;
        skills = MOCK_DEVOPS.skills;
        promptVal = `${promptVal} ${userText}`;
        setPersonalizationPrompt(promptVal);
      } else {
        const updatedVibe = `${wizardData.vibe} ${userText}`;
        setWizardData((prev) => ({ ...prev, vibe: updatedVibe }));
        promptVal = updatedVibe;
      }

      setGeneratedHtml(
        compilePortfolioHTML(name, headline, achievements, skills, promptVal),
      );
    }, 1500);
  };

  // Triggers mock download of compiled index.html
  const triggerHtmlDownload = () => {
    downloadHtml(generatedHtml);
  };

  return {
    view,
    setView,
    pdfFileName,
    setPdfFileName,
    profilePic,
    setProfilePic,
    personalizationPrompt,
    setPersonalizationPrompt,
    wizardStep,
    setWizardStep,
    wizardData,
    setWizardData,
    isDraggingPdf,
    setIsDraggingPdf,
    isDraggingPic,
    setIsDraggingPic,
    generationProgress,
    generationPhase,
    generatedHtml,
    chatInput,
    setChatInput,
    chatHistory,
    isRevising,
    toast,
    setToast,
    handleResumeSession,
    handleStartFresh,
    startPortfolioGeneration,
    applyRevision,
    triggerHtmlDownload,
  };
}
