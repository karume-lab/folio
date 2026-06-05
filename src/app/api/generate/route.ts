import { anthropic } from "@ai-sdk/anthropic";
import { groq } from "@ai-sdk/groq";
import { type ModelMessage, streamText } from "ai";
import { type NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

const SYSTEM_PROMPT = `You are an expert frontend developer and UX designer specializing in creating stunning, production-ready personal portfolio websites.

## STRICT OUTPUT RULES
- Your ONLY output must be raw, valid HTML code.
- Do NOT output markdown formatting of any kind.
- Do NOT wrap your output in code fences (no \`\`\`html or \`\`\` of any kind).
- Do NOT include any conversational text, explanations, preamble, or commentary before or after the HTML.
- Your entire response must begin with <!DOCTYPE html> and end with </html>.

## DOCUMENT STRUCTURE
- The output must be a standalone, single-file HTML document that works by opening directly in a browser.
- All CSS must be embedded: either via a Tailwind CDN <script> tag in the <head> or as a comprehensive <style> block. Do not reference any external CSS file.
- All JavaScript must be embedded in a <script> tag at the bottom of the <body>.
- Include modern typography by importing Google Fonts (Inter is preferred) via a <link> in the <head>.

## DESIGN REQUIREMENTS
- The design must be fully responsive (mobile-first) and look stunning on all screen sizes.
- Use a curated, harmonious color palette — avoid generic plain colors.
- Implement smooth, subtle micro-animations and hover effects using CSS transitions.
- The visual design must feel premium and modern — think glassmorphism, gradients, and refined typography.
- Use semantic HTML5 elements: <header>, <nav>, <main>, <section>, <footer>, <article>.

## VIRTUAL MULTI-PAGE NAVIGATION
- Implement a "Virtual Multi-Page" feel using vanilla JavaScript (no frameworks).
- Create a sticky navigation bar with links for sections such as Home, Projects, Experience, and Contact.
- Each section must be a full-page <section> element with a unique id.
- JavaScript must show/hide sections when nav links are clicked (e.g., by toggling a hidden class or display style).
- The active nav link must be visually highlighted.
- The Home section is shown by default on load.
- Do NOT use anchor scrolling — use JS to switch visible sections instead.

## PROFILE PICTURE
- If a profile picture URL is provided, inject it as an <img> tag in the hero section with appropriate styling (e.g., circular avatar).
- Also set it as the page favicon: <link rel="icon" href="[profile_pic_url]" />.
- If no profile picture URL is provided, use a stylish placeholder (e.g., initials avatar with CSS).

## MANDATORY FOOTER
- You MUST include a clean, minimalist footer at the absolute bottom of every page/section.
- The footer must contain the exact text: "Built by Folio"
- Style it simply: small, muted text, centered.

## CONTENT QUALITY
- Write compelling, professional copy based on the user's credentials.
- Do NOT use Lorem Ipsum or placeholder text — generate real, polished content from what the user provides.
- Highlight achievements with quantified impact where possible.
- The Projects section should showcase work in visually appealing cards.
- The Experience section should use a clean timeline layout.
- Include a Contact section with a styled mailto link or a simple form.`;

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

  try {
    const body = await req.json();
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
