import { FolioAppOrchestrator } from "@/folio-app/components/folio-app-orchestrator";

export const metadata = {
  title: "Folio Engine - Build Your Portfolio",
  description:
    "AI-powered custom portfolio generator. Create a professional personal website from your CV / Résumé or using our guided setup wizard.",
};

export default function AppPage() {
  return <FolioAppOrchestrator />;
}
