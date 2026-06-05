"use client";

import { useCallback, useEffect, useState } from "react";
import type { ViewState, WizardData } from "@/folio-app/types";

interface SessionRecoveryProps {
  view: ViewState;
  setView: (v: ViewState) => void;
  pdfFileName: string | null;
  setPdfFileName: (n: string | null) => void;
  setProfilePic: (p: string | null) => void;
  personalizationPrompt: string;
  setPersonalizationPrompt: (p: string) => void;
  wizardStep: number;
  setWizardStep: (s: number | ((prev: number) => number)) => void;
  wizardData: WizardData;
  setWizardData: (d: WizardData | ((prev: WizardData) => WizardData)) => void;
}

export function useSessionRecovery({
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
}: SessionRecoveryProps) {
  const [toast, setToast] = useState<{ message: string } | null>(null);

  // Serializes state to localStorage
  const saveSessionToStorage = useCallback(
    (
      currentView: ViewState,
      pdfName: string | null,
      promptVal: string,
      wStep: number,
      wData: WizardData,
    ) => {
      localStorage.setItem(
        "folio_draft_session",
        JSON.stringify({
          view: currentView,
          pdfFileName: pdfName,
          personalizationPrompt: promptVal,
          wizardStep: wStep,
          wizardData: wData,
        }),
      );
    },
    [],
  );

  // Save session state changes automatically
  useEffect(() => {
    if (view !== "selection" && view !== "generating") {
      saveSessionToStorage(
        view,
        pdfFileName,
        personalizationPrompt,
        wizardStep,
        wizardData,
      );
    }
  }, [
    view,
    pdfFileName,
    personalizationPrompt,
    wizardStep,
    wizardData,
    saveSessionToStorage,
  ]);

  const handleResumeSession = () => {
    const saved = localStorage.getItem("folio_draft_session");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.view) setView(parsed.view);
        if (parsed.pdfFileName) setPdfFileName(parsed.pdfFileName);
        if (parsed.personalizationPrompt !== undefined) {
          setPersonalizationPrompt(parsed.personalizationPrompt);
        }
        if (parsed.wizardStep) setWizardStep(parsed.wizardStep);
        if (parsed.wizardData) setWizardData(parsed.wizardData);
      } catch (e) {
        console.error("Error applying recovered session", e);
      }
    }
    setToast(null);
  };

  const handleStartFresh = () => {
    localStorage.removeItem("folio_draft_session");
    setPdfFileName(null);
    setProfilePic(null);
    setPersonalizationPrompt("");
    setWizardStep(1);
    setWizardData({
      name: "",
      headline: "",
      achievements: "",
      skills: "",
      vibe: "",
    });
    setView("selection");
    setToast(null);
  };

  // Check on mount if a draft session is available to recover
  useEffect(() => {
    const saved = localStorage.getItem("folio_draft_session");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Show recovery toast if there is any custom state stored
        if (
          parsed.view &&
          parsed.view !== "selection" &&
          (parsed.pdfFileName ||
            parsed.personalizationPrompt ||
            parsed.wizardData?.name ||
            parsed.wizardData?.headline)
        ) {
          setToast({ message: "Resume your previous session?" });
        }
      } catch {
        // ignore JSON parse errors
      }
    }
  }, []);

  return {
    toast,
    setToast,
    handleResumeSession,
    handleStartFresh,
  };
}
