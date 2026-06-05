"use client";

import { useState } from "react";
import { useSessionRecovery } from "@/folio-app/hooks/use-session-recovery";
import type { ChatMessage, ViewState, WizardData } from "@/folio-app/types";
import { triggerHtmlDownload as downloadHtml } from "@/folio-app/utils/download";

// MOCK_DEVOPS removed — real PDF text is now extracted via /api/parse-pdf

const GENERATION_PHASES = [
  { max: 20, text: "Analyze input constraints" },
  { max: 45, text: "Extract credentials and keywords" },
  { max: 70, text: "Compile layout aesthetics" },
  { max: 90, text: "Write Tailwind styling classes" },
  { max: 100, text: "Publish responsive sandbox DOM" },
];

/** Build the user message content sent to the generation API. */
function buildUserPrompt(opts: {
  pdfFileName: string | null;
  // [CHANGED] pdfText replaces MOCK_DEVOPS — real extracted resume text
  pdfText: string | null;
  profilePic: string | null;
  personalizationPrompt: string;
  wizardData: WizardData;
}): string {
  const {
    pdfFileName,
    pdfText,
    profilePic,
    personalizationPrompt,
    wizardData,
  } = opts;

  const picLine = profilePic
    ? `Profile picture URL: ${profilePic}`
    : "No profile picture provided.";

  // [CHANGED] Use real extracted PDF text instead of MOCK_DEVOPS
  if (pdfFileName && pdfText) {
    return `Generate a professional portfolio website based on the following details.
${picLine}
Design preferences / personalization: ${personalizationPrompt || "Modern dark theme, clean layout."}

Here is the raw text extracted from the user's resume PDF. Parse this to understand their Name, Headline, Skills, and Achievements.

Raw Resume Text:

${pdfText}`;
  }

  return `Generate a professional portfolio website based on the following details.
${picLine}
- Name: ${wizardData.name || "Developer"}
- Headline: ${wizardData.headline || "Software Engineer"}
- Key Achievements: ${wizardData.achievements || "Experienced developer with multiple shipped products."}
- Skills: ${wizardData.skills || "JavaScript, TypeScript, React, Node.js"}
- Design vibe / style preference: ${wizardData.vibe || "Modern dark theme, clean layout."}`;
}

/**
 * ASSISTANT MESSAGE SENTINEL
 * We never store raw HTML in apiMessages — it would instantly blow LLM token
 * limits on revisions (especially on Groq). Instead we store a lightweight
 * pointer that tells the model the layout is already rendered client-side.
 */
const ASSISTANT_SENTINEL =
  "[Layout generated and stored in client preview. Awaiting your visual refinement commands. Reply with a single instruction like 'make the hero background midnight blue' or 'add a testimonials section'.]";

/** Stream from /api/generate and accumulate delta chunks into full HTML. */
async function streamPortfolioGeneration(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  onChunk: (partial: string) => void,
): Promise<string> {
  // Detect HTTP errors BEFORE reading the body as a stream.
  // A non-ok response body is plain JSON, not an SSE/text stream.
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    // The error body from our API route is always JSON { error: string }.
    let message = `Request failed with status ${res.status}.`;
    try {
      const payload = await res.json();
      if (typeof payload?.error === "string") {
        message = payload.error;
        // Example/Instruction: If status is 429 (Rate Limit Exceeded), we can append additional context
        // like resetsInMinutes to guide the user on when they can try generating again.
        if (res.status === 429 && typeof payload.resetsInMinutes === "number") {
          message += ` (Resets in ${payload.resetsInMinutes} minutes)`;
        }
      }
    } catch {
      // ignore — use the default message
    }
    throw new Error(message);
  }

  if (!res.body) {
    throw new Error("Response body is empty.");
  }

  // toTextStreamResponse() emits raw UTF-8 TEXT DELTAS (not full snapshots).
  // We must accumulate them ourselves to build the complete HTML string.
  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let fullHtml = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      // Flush any remaining bytes held by the streaming decoder.
      const tail = decoder.decode();
      if (tail) {
        fullHtml += tail;
        onChunk(fullHtml);
      }
      break;
    }
    // Each value is a Uint8Array delta — decode and append.
    const delta = decoder.decode(value, { stream: true });
    fullHtml += delta;
    onChunk(fullHtml);
  }

  return fullHtml;
}

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
    "Initialize generator context",
  );
  const [generationError, setGenerationError] = useState<string | null>(null);

  // [NEW] PDF extraction state
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [isParsingPdf, setIsParsingPdf] = useState(false);

  // Compiled portfolio outputs
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isRevising, setIsRevising] = useState(false);

  // Deploy state
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);

  // Chat history for iterative revisions (AI SDK message format)
  const [apiMessages, setApiMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);

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

  // [NEW] Extract text from uploaded PDF via /api/parse-pdf
  const handleExtractPdfText = async (file: File) => {
    setIsParsingPdf(true);
    setPdfFileName(file.name);
    setPdfText(null);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error ?? `Parse failed (${res.status})`);
      }

      const data = await res.json();
      setPdfText(data.text ?? null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "PDF extraction failed.";
      // Surface the error in the UI without blocking the user entirely
      console.error("[parse-pdf]", msg);
      setPdfFileName(null);
      setPdfText(null);
    } finally {
      setIsParsingPdf(false);
    }
  };

  /** Animate the progress bar independently during streaming */
  const runProgressAnimation = (): (() => void) => {
    setGenerationProgress(0);
    let current = 0;

    const interval = setInterval(() => {
      // Slow down as we approach 90% — let the real completion trigger 100%
      const increment =
        current < 70
          ? Math.floor(Math.random() * 6) + 3
          : Math.floor(Math.random() * 2) + 1;
      current = Math.min(current + increment, 92);
      setGenerationProgress(current);
      const phase = GENERATION_PHASES.find((p) => current <= p.max);
      if (phase) setGenerationPhase(phase.text);
    }, 220);

    return () => clearInterval(interval);
  };

  /** Launch real AI portfolio generation */
  const startPortfolioGeneration = async () => {
    setView("generating");
    setGenerationError(null);

    const userPrompt = buildUserPrompt({
      pdfFileName,
      pdfText, // [CHANGED] real extracted text replaces MOCK_DEVOPS
      profilePic,
      personalizationPrompt,
      wizardData,
    });

    const initialMessages: Array<{
      role: "user" | "assistant";
      content: string;
    }> = [{ role: "user", content: userPrompt }];
    setApiMessages(initialMessages);

    const stopProgress = runProgressAnimation();

    try {
      const html = await streamPortfolioGeneration(initialMessages, (partial) =>
        setGeneratedHtml(partial),
      );

      stopProgress();
      setGenerationProgress(100);
      setGenerationPhase("Publish responsive sandbox DOM");

      setGeneratedHtml(html);
      // Store a sentinel instead of raw HTML to prevent token-limit blowout
      // on iterative revision calls (especially critical for Groq).
      setApiMessages((prev) => [
        ...prev,
        { role: "assistant", content: ASSISTANT_SENTINEL },
      ]);

      setTimeout(() => {
        setView("preview");
        setChatHistory([
          {
            sender: "system",
            text: "Your portfolio has been generated! You can iterate on details — try 'change the color scheme to midnight blue' or 'add a testimonials section'.",
          },
        ]);
      }, 400);
    } catch (err) {
      stopProgress();
      const msg = err instanceof Error ? err.message : "Generation failed.";
      setGenerationError(msg);
      setGenerationPhase("Generation failed.");
    }
  };

  /** Iterative AI revision — sends conversation history back to the API */
  const applyRevision = async (userText: string) => {
    setChatHistory((prev) => [...prev, { sender: "user", text: userText }]);
    setIsRevising(true);

    const updatedMessages: Array<{
      role: "user" | "assistant";
      content: string;
    }> = [...apiMessages, { role: "user", content: userText }];
    setApiMessages(updatedMessages);

    try {
      const html = await streamPortfolioGeneration(updatedMessages, (partial) =>
        setGeneratedHtml(partial),
      );

      setGeneratedHtml(html);
      // Again — store only the sentinel, never raw HTML.
      setApiMessages((prev) => [
        ...prev,
        { role: "assistant", content: ASSISTANT_SENTINEL },
      ]);

      setChatHistory((prev) => [
        ...prev,
        {
          sender: "system",
          text: `Done! I've updated your portfolio based on: "${userText}". Keep refining as needed.`,
        },
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Revision failed.";
      setChatHistory((prev) => [
        ...prev,
        { sender: "system", text: `❌ ${msg}` },
      ]);
    } finally {
      setIsRevising(false);
    }
  };

  /** Deploy portfolio to Firestore and return a live shareable URL */
  const handleDeploySite = async (htmlContent: string) => {
    setIsDeploying(true);
    setDeployedUrl(null);
    setDeployError(null);

    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ htmlContent, userId: "anonymous" }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error ?? `Deploy failed (${res.status})`);
      }

      const data = await res.json();
      const liveUrl = `${window.location.origin}/site/${data.deploymentId}`;
      setDeployedUrl(liveUrl);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Deployment failed.";
      setDeployError(msg);
    } finally {
      setIsDeploying(false);
    }
  };

  // Triggers download of compiled index.html
  const triggerHtmlDownload = () => {
    downloadHtml(generatedHtml);
  };

  return {
    view,
    setView,
    pdfFileName,
    setPdfFileName,
    // [NEW] PDF extraction state + handler
    pdfText,
    isParsingPdf,
    handleExtractPdfText,
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
    generationError,
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
    // Deploy
    isDeploying,
    deployedUrl,
    setDeployedUrl,
    deployError,
    handleDeploySite,
  };
}
