import { notFound } from "next/navigation";
import { getAdminFirestore } from "@/lib/firebase-admin";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `Portfolio · ${id}`,
    description: "A portfolio generated and deployed by Folio.",
  };
}

export default async function SitePage({ params }: PageProps) {
  const { id } = await params;

  let htmlContent: string;

  try {
    const db = getAdminFirestore();
    const doc = await db
      .collection(process.env.FIREBASE_DEPLOYMENTS_COLLECTION || "deployments")
      .doc(id)
      .get();

    if (!doc.exists) {
      notFound();
    }

    htmlContent = doc.data()?.htmlContent as string;

    if (!htmlContent) {
      notFound();
    }
  } catch {
    // Treat any Firestore error as not-found to avoid leaking internals
    notFound();
  }

  /**
   * The generated portfolio is a full standalone HTML document.
   * We render it inside a full-viewport iframe so its own <head>, <script>,
   * and <style> blocks execute in an isolated browsing context — keeping
   * the Next.js host document clean and preventing style bleed.
   */
  return (
    <iframe
      srcDoc={htmlContent}
      title="Folio Portfolio"
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      className="w-screen h-screen border-0 block"
      style={{ position: "fixed", inset: 0 }}
    />
  );
}
