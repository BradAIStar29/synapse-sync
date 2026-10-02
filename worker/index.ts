/**
 * Synapse Sync — Cloudflare Worker (API Backend)
 * Built with Hono (https://hono.dev) — routing, CORS, and error handling.
 * Deployed via GitHub Actions. Frontend (Cloudflare Pages) calls this worker via VITE_API_URL.
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { agentsMiddleware } from "hono-agents";
import { AI_MODELS, BmaiConsultantAgent } from "./consultant";

// The agent class must be exported from the worker entry for the DO migration
export { BmaiConsultantAgent };

// Minimal type for the Cloudflare Workers AI binding
interface Ai {
  run(model: string, inputs: Record<string, unknown>): Promise<Record<string, unknown> | string>;
}

export interface Env {
  STRIPE_SECRET_KEY: string;
  VITE_STRIPE_PUBLISHABLE_KEY: string;
  APP_URL: string;
  CAPTIVATION_HUB_API_KEY: string;
  AI: Ai; // Cloudflare Workers AI binding
  BmaiConsultantAgent: DurableObjectNamespace; // Cloudflare Agents SDK binding
}

const app = new Hono<{ Bindings: Env }>();

// ---------- CORS: production app URL + any pages.dev deployment ----------
app.use(
  "/api/*",
  cors({
    origin: (origin, c) => {
      const appUrl = c.env?.APP_URL || "";
      if (origin && (origin === appUrl || (origin.endsWith(".pages.dev") && origin.startsWith("https://")))) {
        return origin;
      }
      return appUrl || null;
    },
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    maxAge: 86400,
  })
);

// ---------- Centralized error handling ----------
app.onError((err, c) => {
  console.error("Unhandled error:", err?.message || err);
  return c.json({ error: "Internal server error" }, 500);
});

// ---------- AI prompt engineering per platform ----------

const PLATFORM_RULES: Record<string, string> = {
  linkedin:
    "Write a LinkedIn post: professional storytelling tone, short paragraphs with line breaks for readability, start with a strong 1-2 line hook, end with a question or insight to drive comments. 120-200 words. No hashtags in the body; suggest up to 3 relevant hashtags separately.",
  x: "Write an X (Twitter) post: punchy and high-impact, under 280 characters, one core idea, strong hook in the first 7 words, no hashtag spam; suggest up to 2 hashtags separately.",
  newsletter:
    "Write an email newsletter section: conversational and value-dense, direct address ('you'), a subject line first (prefix it with 'SUBJECT:'), 100-180 words, one clear takeaway.",
  video:
    "Write a YouTube video description: compelling first 2 lines (visible before 'show more'), 80-150 words, include a natural call to action, then suggest 3-5 tags separately.",
  medium:
    "Write a blog intro: engaging narrative opening, 100-180 words, sets up the problem and promises a payoff, readable short paragraphs.",
};

const TONE_HINTS: Record<string, string> = {
  growth: "Tone: conversational, educational, encouraging.",
  operator: "Tone: professional, polished, authoritative.",
  scientific: "Tone: analytical, fact-forward, minimal adjectives.",
  bold: "Tone: provocative, contrarian, confident.",
  "thought-leader": "Tone: consultative, authoritative, industry-expert.",
  "viral-growth": "Tone: punchy, scroll-stopping, high-energy.",
  educator: "Tone: clear, structured, tutorial-like.",
  conversational: "Tone: warm, relatable, personal.",
};

function buildPrompt(idea: string, platform: string, tone: string): string {
  const platformRule = PLATFORM_RULES[platform] || PLATFORM_RULES.linkedin;
  const toneHint = TONE_HINTS[tone] || TONE_HINTS.growth;
  return [
    `You are an expert social media copywriter. Transform the raw content idea below into an optimized post for a specific platform.`,
    "",
    platformRule,
    toneHint,
    "Return ONLY the post text (plus subject line/tags where specified). No preamble, no explanations, no quotes around the result.",
    "",
    `PLATFORM: ${platform}`,
    `RAW IDEA: ${idea}`,
  ].join("\n");
}

// ---------- Routes ----------

// GET /api/health
app.get("/api/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: "cloudflare-worker",
    aiEnabled: !!c.env.AI,
    stripeEnabled: !!c.env.STRIPE_SECRET_KEY,
  });
});

// GET /api/ai/config
app.get("/api/ai/config", (c) => {
  return c.json({ aiEnabled: !!c.env.AI });
});

// POST /api/ai/generate
// Real AI content generation via Cloudflare Workers AI.
// Body: { idea, platform, tone }
app.post("/api/ai/generate", async (c) => {
  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const idea = (body?.idea || "").toString().trim();
  const platform = (body?.platform || "linkedin").toString().trim().toLowerCase();
  const tone = (body?.tone || "growth").toString().trim().toLowerCase();

  if (!idea) return c.json({ error: "An idea is required" }, 400);
  if (idea.length > 4000) return c.json({ error: "Idea is too long (max 4000 characters)" }, 400);
  if (!(platform in PLATFORM_RULES)) {
    return c.json({ error: `Unsupported platform: ${platform}` }, 400);
  }

  // AI not configured — tell the client to use its local fallback
  if (!c.env.AI) {
    return c.json({ error: "AI is not enabled on this worker", isFallback: true }, 503);
  }

  const messages = [
    { role: "system", content: "You are a senior social media copywriter. You write clean, high-performing posts. Output only the requested copy." },
    { role: "user", content: buildPrompt(idea, platform, tone) },
  ];

  let content = "";
  let usedModel = "";

  for (const model of AI_MODELS) {
    try {
      const result: any = await c.env.AI.run(model, {
        messages,
        max_tokens: 600,
      });
      content = (result?.response || result?.text || "").toString().trim();
      // LLMs sometimes wrap short posts in stray quotes — strip them
      content = content.replace(/^["\']+/, "").replace(/["\']+$/, "").trim();
      if (content) {
        usedModel = model;
        break;
      }
    } catch (err: any) {
      console.error(`Workers AI error (${model}):`, err?.message || err);
      // try the next model in the chain
    }
  }

  if (!content) {
    return c.json({ error: "AI generation failed", isFallback: true }, 502);
  }

  return c.json({
    content,
    platform,
    tone,
    generatedBy: "cloudflare-workers-ai",
    model: usedModel,
  });
});

// POST /api/ai/blueprint
// Digital asset blueprint generator (BMAIProductions site).
// Body: { idea } -> { ebook, course, newsletter, video, agent, monetization, plan }
app.post("/api/ai/blueprint", async (c) => {
  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const idea = (body?.idea || "").toString().trim();
  if (!idea) return c.json({ error: "An idea is required" }, 400);
  if (idea.length > 2000) return c.json({ error: "Idea is too long (max 2000 characters)" }, 400);

  if (!c.env.AI) {
    return c.json({ error: "AI is not enabled on this worker", isFallback: true }, 503);
  }

  const bpPrompt = [
    "You are a digital product strategist. The user gives a topic, niche, or audience idea.",
    "Return ONLY a valid JSON object (no markdown, no code fences) with exactly these keys:",
    '"ebook", "course", "newsletter", "video", "agent", "monetization", "plan".',
    "Each value is a short actionable paragraph (2-4 sentences) describing a concrete digital asset to build for that idea.",
    '"plan" is a day-by-day 7-day build plan, one line per day, separated by newlines.',
    "Be specific and practical: titles, module names, issue topics, video ideas.",
    "",
    `IDEA: ${idea}`,
  ].join("\n");

  const bpMessages = [
    { role: "system", content: "You are a senior digital product strategist. You always respond with valid JSON only." },
    { role: "user", content: bpPrompt },
  ];

  // Ask the model for JSON; one retry with a stricter reminder if malformed
  let out: Record<string, string> | null = null;
  let debugRaw = "";
  for (let attempt = 0; attempt < 2 && !out; attempt++) {
    const msgs = attempt === 0
      ? bpMessages
      : [
          ...bpMessages,
          { role: "assistant", content: "Sure, here is the JSON:" },
          { role: "user", content: "That was not valid JSON. Respond with ONLY a JSON object, no other text, no markdown, starting with { and ending with }." },
        ];

    let rawContent = "";
    for (const model of AI_MODELS) {
      try {
        const result: any = await c.env.AI.run(model, { messages: msgs, max_tokens: 2000 });
        rawContent = (result?.response || result?.text || "").toString().trim();
        if (rawContent) break;
      } catch (err: any) {
        console.error(`Workers AI blueprint error (${model}):`, err?.message || err);
      }
    }

    if (!rawContent) continue;
    debugRaw = rawContent;

    // Robust extraction: strip code fences, then grab outermost {...}
    let cleaned = rawContent.replace(/```(json)?/gi, "").trim();
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }

    const keys = ["ebook", "course", "newsletter", "video", "agent", "monetization", "plan"];
    const candidate: Record<string, string> = {};

    // Fast path: full JSON parse
    try {
      const parsed = JSON.parse(cleaned);
      for (const k of keys) {
        candidate[k] = typeof parsed[k] === "string" ? parsed[k].trim() : "";
      }
    } catch {
      // Salvage path: output was truncated mid-JSON. Recover each
      // complete key/value pair individually with a regex that only
      // matches properly closed JSON strings.
      for (const k of keys) {
        const m = cleaned.match(new RegExp(`"${k}"\s*:\s*("(?:[^"\\]|\\.)*")`));
        if (m) {
          try {
            const val = JSON.parse(m[1]);
            if (typeof val === "string" && val.trim()) candidate[k] = val.trim();
          } catch { /* skip this key */ }
        }
      }
    }

    // Accept if we recovered at least the core asset sections
    const required = ["ebook", "course", "newsletter"];
    if (required.every((k) => candidate[k])) {
      out = candidate;
    }
  }

  if (!out) {
    return c.json({ error: "AI returned malformed JSON", isFallback: true, debugRaw: debugRaw.slice(0, 500) }, 502);
  }
  return c.json({ ...out, generatedBy: "cloudflare-workers-ai" });
});

// POST /api/collect-email
app.post("/api/collect-email", async (c) => {
  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const email = (body?.email || "").toString().trim().toLowerCase();
  if (!email) return c.json({ error: "Email is required" }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return c.json({ error: "Please provide a valid email address" }, 400);
  }

  if (!c.env.CAPTIVATION_HUB_API_KEY) {
    return c.json({ error: "Email collection not configured" }, 500);
  }

  const contactPayload: Record<string, any> = {
    email,
    source: (body?.source || "Synapse Sync Website").toString().slice(0, 200),
    tags: ["synapse-sync", "website-lead"],
  };
  if (body?.firstName) contactPayload.firstName = body.firstName.toString().trim().slice(0, 100);
  if (body?.lastName) contactPayload.lastName = body.lastName.toString().trim().slice(0, 100);
  if (body?.phone) contactPayload.phone = body.phone.toString().trim().slice(0, 30);

  try {
    const ghlResponse = await fetch("https://rest.gohighlevel.com/v1/contacts/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${c.env.CAPTIVATION_HUB_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactPayload),
    });

    const ghlData: any = await ghlResponse.json().catch(() => ({}));

    if (!ghlResponse.ok) {
      console.error("Captivation Hub error:", JSON.stringify(ghlData));
      return c.json({ error: "Failed to save contact", details: ghlData?.message || "Unknown error" }, 500);
    }

    return c.json({ success: true, contactId: ghlData?.contact?.id || null, message: "Email collected successfully" });
  } catch (err: any) {
    console.error("Captivation Hub request failed:", err?.message || err);
    return c.json({ error: "Failed to save contact" }, 500);
  }
});

// GET /api/billing/config
app.get("/api/billing/config", (c) => {
  return c.json({
    isStripeEnabled: !!c.env.STRIPE_SECRET_KEY,
    publishableKey: c.env.VITE_STRIPE_PUBLISHABLE_KEY || "",
    hasPublishableKey: !!c.env.VITE_STRIPE_PUBLISHABLE_KEY,
    fallbackTrialActive: true,
  });
});

// POST /api/billing/create-checkout-session
app.post("/api/billing/create-checkout-session", async (c) => {
  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }
  const { planName, email, brandName, selectedTone, connectedChannels } = body || {};

  const appUrl = c.env.APP_URL || "https://bmai-synapse-sync.pages.dev";
  const normalizedPlan = (planName || "Pro").trim();
  const targetEmail = (email || "user@example.com").trim();
  const targetBrand = (brandName || "My Sync Space").trim();

  // Mock mode if no Stripe key
  if (!c.env.STRIPE_SECRET_KEY) {
    return c.json({
      isMock: true,
      redirectUrl: `${appUrl}/?payment=success&plan=${encodeURIComponent(normalizedPlan)}&brand=${encodeURIComponent(targetBrand)}&tone=${encodeURIComponent(selectedTone || "growth")}&channels=${encodeURIComponent(JSON.stringify(connectedChannels || []))}`,
      message: "Stripe key not configured. Running in sandbox mock mode.",
    });
  }

  const amount = normalizedPlan.toLowerCase().includes("starter") ? 1000 : 10000;
  const displayName = normalizedPlan.toLowerCase().includes("starter") ? "Synapse Sync Starter Plan" : "Synapse Sync Pro Plan";
  const description = normalizedPlan.toLowerCase().includes("starter")
    ? "Automated brand co-pilot for solo creators (14-day zero-risk trial)"
    : "Complete AI content engine for brand agencies (14-day zero-risk trial)";

  const trialEndTimestamp = Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60;

  try {
    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${c.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        mode: "subscription",
        "payment_method_types[0]": "card",
        "line_items[0][price_data][currency]": "usd",
        "line_items[0][price_data][product_data][name]": displayName,
        "line_items[0][price_data][product_data][description]": description,
        "line_items[0][price_data][unit_amount]": String(amount),
        "line_items[0][price_data][recurring][interval]": "month",
        "line_items[0][quantity]": "1",
        "subscription_data[trial_end]": String(trialEndTimestamp),
        customer_email: targetEmail,
        "metadata[planName]": normalizedPlan,
        "metadata[brandName]": targetBrand,
        "metadata[tone]": selectedTone || "growth",
        success_url: `${appUrl}/?payment=success&plan=${encodeURIComponent(normalizedPlan)}&brand=${encodeURIComponent(targetBrand)}&tone=${encodeURIComponent(selectedTone || "growth")}&channels=${encodeURIComponent(JSON.stringify(connectedChannels || []))}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/?payment=cancelled&plan=${encodeURIComponent(normalizedPlan)}`,
      }),
    });

    const session: any = await stripeResponse.json().catch(() => ({}));

    if (!stripeResponse.ok) {
      return c.json({ error: session?.error?.message || "Stripe error", isMockFallback: true }, 500);
    }

    return c.json({ isMock: false, sessionId: session.id, redirectUrl: session.url });
  } catch (err: any) {
    console.error("Stripe request failed:", err?.message || err);
    return c.json({ error: "Failed to create checkout session", isMockFallback: true }, 500);
  }
});

// ---------- Cloudflare Agents (BMAI Asset Consultant) ----------
// Same CORS policy as /api/* — production app URL + any pages.dev deployment
app.use(
  "/agents/*",
  cors({
    origin: (origin, c) => {
      const appUrl = c.env?.APP_URL || "";
      if (origin && (origin === appUrl || (origin.endsWith(".pages.dev") && origin.startsWith("https://")))) {
        return origin;
      }
      return appUrl || null;
    },
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    maxAge: 86400,
  })
);
app.use("*", agentsMiddleware());

// 404 for everything else
app.notFound((c) => c.json({ error: "Not found" }, 404));

export default app;
