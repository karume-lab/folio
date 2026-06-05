export type ViewState =
  | "selection"
  | "pdf-upload"
  | "wizard"
  | "generating"
  | "preview";

export interface WizardData {
  name: string;
  headline: string;
  achievements: string;
  skills: string;
  vibe: string;
}

export interface ChatMessage {
  sender: "user" | "system";
  text: string;
}
