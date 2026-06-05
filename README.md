# Folio

Folio is a Next.js application that converts user credentials (either via a guided wizard form or resume PDF text extraction) into a single-file, bespoke, and deployable HTML portfolio.

---

## Key Features

- **Dynamic Design Paradigms**: Generates portfolios adhering strictly to high-end design paradigms (Neo-Brutalism, Editorial/Magazine, Bento Box, or Spatial/Atmospheric) rather than cookie-cutter layouts.
- **Resume PDF Parsing**: Server-side text extraction from resume PDF files using a class-based parser.
- **AI-Powered Refinements**: Built-in chat interface that allows users to iterate and refine their portfolio styling in real-time.
- **Firestore Deployment**: Direct single-click deployment to Firestore hosting, making generated portfolios shareable via dynamic site URLs.
- **Sliding-Window Rate Limiting**: Security-hardened endpoint restricting client generations to 3 requests per 24 hours per user or IP address using Upstash Redis.
- **Mandatory Watermark**: Enforced brand footer rendering a subtle "Built by Folio" link back to the parent landing page.

---

## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Runtime & Package Manager**: Bun
- **AI Streaming**: Vercel AI SDK (with Anthropic Claude-3.5-Sonnet or Groq Llama-3.1-8b)
- **Database**: Firestore (Firebase Admin SDK)
- **Rate Limiting**: Upstash Redis (@upstash/ratelimit, @upstash/redis)
- **PDF Text Extraction**: pdf-parse v2
- **Styling**: Tailwind CSS, Framer Motion, Lenis Smooth Scroll

---

## Folder Layout

The project uses a modular design to keep components and state logic isolated from the routing directory:

- `src/app/`
  - `api/`
    - `deploy/route.ts` - Firestore deployment handler
    - `generate/route.ts` - Generation engine with rate limit interception and system prompt configuration
    - `parse-pdf/route.ts` - Resume PDF extraction handler
  - `site/[id]/page.tsx` - Sandboxed iframe dynamic portfolio renderer
  - `page.tsx` - Root landing page with scroll-reveal animations
- `src/folio-app/`
  - `components/` - Atomic wizard steps, drop zones, progress views, and revision panel controls
  - `hooks/` - Centralized portfolio state machine and draft localStorage sync hooks
  - `types/` - Shared TypeScript interfaces
  - `utils/` - Sandbox compiler utilities and mock data fallbacks
- `src/lib/`
  - `firebase-admin.ts` - Firebase Admin SDK initialization singleton
  - `ratelimit.ts` - Upstash sliding-window rate limit utility

---

## Configuration & Setup

Copy `.env.example` to `.env.local` and configure the following credentials:

```bash
# Provider Switch (Set to true to use Anthropic Claude, false to use Groq Llama)
USE_CLAUDE=false

# LLM Providers API Keys
ANTHROPIC_API_KEY=your-anthropic-key
GROQ_API_KEY=your-groq-key

# Firebase Admin credentials (found in Firebase Console -> Project Settings -> Service Accounts)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-email@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Upstash Redis credentials (found in Upstash Console -> REST API section)
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-database-token
```

---

## Development

Install dependencies and start the development server locally:

```bash
bun install
bun dev
```

The application will be served at `http://localhost:3000`.

---

## Rate Limiting and Security

The generation engine at `/api/generate` is rate-limited to prevent abuse:
- **Daily Allowance**: Maximum of 3 portfolio generations per 24 hours.
- **Client Resolution**: Clients are resolved by their logged-in User ID (if provided) or their remote IP address parsed from the `X-Forwarded-For` header.
- **Exceeded Limit (HTTP 429)**: Responds with a standard JSON payload detailing the rate limit reset window (resetsInMinutes) to let the frontend update the loader gracefully.
- **Dev Mode Support**: If Upstash keys are omitted in a local environment, rate limiting is skipped and logs a console warning.

---

## Git Hooks

Lefthook is configured to automate code formatting and lint checking prior to commits:
- **Hook Type**: pre-commit
- **Automation**: Executes biome formatting and clean checks (`biome check --write`) on modified files and stages them automatically before committing.

