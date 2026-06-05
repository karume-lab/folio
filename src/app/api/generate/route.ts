import { anthropic } from "@ai-sdk/anthropic";
import { groq } from "@ai-sdk/groq";
import { type ModelMessage, streamText } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { getGenerationRatelimiter, resolveIdentifier } from "@/lib/ratelimit";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";

export const maxDuration = 60;

function getModel() {
  const useClaude = process.env.USE_CLAUDE === "true";

  if (useClaude) {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) {
      throw new Error("ANTHROPIC_API_KEY is not set in environment variables.");
    }
    return anthropic("claude-3-5-sonnet-20240620");
  }

  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error("GROQ_API_KEY is not set in environment variables.");
  }
  return groq("llama-3.1-8b-instant");
}

export async function POST(req: NextRequest) {
  let messages: ModelMessage[];

  // Hoist body so it is accessible outside the try block (e.g. for rate limiting).
  let body: Awaited<ReturnType<typeof req.json>>;
  try {
    body = await req.json();
    if (!Array.isArray(body?.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: 'messages' must be a non-empty array." },
        { status: 400 },
      );
    }
    messages = body.messages as ModelMessage[];
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  // ── Rate Limiting ────────────────────────────────────────────────────────
  // Identify the client, then check the sliding-window budget (3 / 24h).
  // If Upstash env vars are absent (local dev without Redis), we skip and warn.
  const identifier = resolveIdentifier(req, body?.userId);
  try {
    const limiter = getGenerationRatelimiter();
    const { success, limit, reset } = await limiter.limit(identifier);

    if (!success) {
      const resetInMinutes = Math.ceil((reset - Date.now()) / 1000 / 60);
      return NextResponse.json(
        {
          error:
            "Daily limit reached. You can only generate 3 portfolios per 24 hours.",
          limit,
          remaining: 0,
          resetsInMinutes: resetInMinutes,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(reset),
            "Retry-After": String(resetInMinutes * 60),
          },
        },
      );
    }
  } catch (err) {
    // Missing Upstash credentials → skip rate limiting in local dev.
    // In production this should never be caught — treat as a fatal config error.
    if (
      err instanceof Error &&
      err.message.includes("Missing Upstash credentials")
    ) {
      console.warn(
        "[ratelimit] Upstash not configured — skipping rate limit check.",
      );
    } else {
      // Unexpected Redis error — fail open to avoid blocking all users.
      console.error("[ratelimit] Unexpected error:", err);
    }
  }
  // ── End Rate Limiting ────────────────────────────────────────────────────

  let model: ReturnType<typeof getModel>;
  try {
    model = getModel();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown provider error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  try {
    const result = streamText({
      model,
      system: SYSTEM_PROMPT,
      messages,
      temperature: 0.7,
      maxOutputTokens: 8192,
    });

    return result.toTextStreamResponse();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
