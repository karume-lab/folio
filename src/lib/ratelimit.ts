/**
 * Upstash Redis + Sliding Window Rate Limiter
 *
 * Limit: 10 portfolio generations per 24 hours per user/IP.
 *
 * Required environment variables (add to .env.local):
 *   UPSTASH_REDIS_REST_URL    — from Upstash console → Redis → REST API
 *   UPSTASH_REDIS_REST_TOKEN  — same location
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Lazily initialised — only created on first use (avoids build-time env checks).
let _ratelimit: Ratelimit | null = null;

export function getGenerationRatelimiter(): Ratelimit {
  if (_ratelimit) return _ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Missing Upstash credentials. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.local.",
    );
  }

  const redis = new Redis({ url, token });

  _ratelimit = new Ratelimit({
    redis,
    // Sliding window: smoothly distributes the 10-request budget over 24 h.
    // A fixed window would allow bursting 10 requests at 23:59 and 10 more at 00:01.
    limiter: Ratelimit.slidingWindow(10, "24 h"),
    analytics: true, // store per-identifier metrics in Upstash for observability
    prefix: "folio:gen",
  });

  return _ratelimit;
}

/**
 * Resolve the best identifier for rate-limiting a request.
 * Priority: userId body field → X-Forwarded-For → "anonymous"
 */
export function resolveIdentifier(
  req: Request,
  userId?: string | null,
): string {
  if (userId && typeof userId === "string" && userId.trim()) {
    return `user:${userId.trim()}`;
  }

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list; take the first (client) IP.
    return `ip:${forwarded.split(",")[0].trim()}`;
  }

  // Final fallback — should rarely happen in production behind a proxy.
  return "ip:anonymous";
}
