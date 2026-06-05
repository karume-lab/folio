import { FieldValue } from "firebase-admin/firestore";
import { type NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  let htmlContent: string;
  let userId: string;

  try {
    const body = await req.json();
    if (typeof body?.htmlContent !== "string" || !body.htmlContent.trim()) {
      return NextResponse.json(
        { error: "htmlContent must be a non-empty string." },
        { status: 400 },
      );
    }
    htmlContent = body.htmlContent as string;
    // userId is optional — fall back to "anonymous"
    userId = typeof body?.userId === "string" ? body.userId : "anonymous";
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  let db: ReturnType<typeof getAdminFirestore>;
  try {
    db = getAdminFirestore();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Firebase initialisation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  try {
    const docRef = await db
      .collection(process.env.FIREBASE_DEPLOYMENTS_COLLECTION || "deployments")
      .add({
        htmlContent,
        userId,
        createdAt: FieldValue.serverTimestamp(),
      });

    return NextResponse.json({ success: true, deploymentId: docRef.id });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Firestore write failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
