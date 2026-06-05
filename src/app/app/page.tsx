import { FolioAppOrchestrator } from "@/features/core/components/folio-app-orchestrator";

export const metadata = {
  title: "Folio - Build Your Portfolio",
  description:
    "AI-powered custom portfolio generator. Create a professional personal website from your CV / Résumé or using our guided setup wizard.",
};

export default function AppPage() {
  return <FolioAppOrchestrator />;
}
