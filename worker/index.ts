/**
 * Synapse Sync — Cloudflare Worker (API Backend)
 * Handles all /api/* routes. Deployed via GitHub Actions.
 * Frontend (Cloudflare Pages) calls this worker via VITE_API_URL.
 */

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
}

// Workers AI models — tried in order; if one is retired/unavailable the next runs
const AI_MODELS = [
  "@cf/meta/llama-3.1-8b-instruct-fp8", // fast, cheap, good at short-form marketing copy
  "@cf/meta/llama-3.3-70b-instruct-fp8-fast", // higher quality fallback
  "@cf/meta/llama-3.2-3b-instruct", // lightweight last resort
];

const corsHeaders = {
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

function corsFor(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get("Origin") || "";
  const appUrl = env.APP_URL || "";
  // Allow the production app URL and any pages.dev preview deployment
  const allowed =
    origin === appUrl ||
    (origin.endsWith(".pages.dev") && origin.startsWith("https://"));
  return {
    ...corsHeaders,
    "Access-Control-Allow-Origin": allowed ? origin : appUrl,
    "Vary": "Origin",
  };
}

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const cors = corsFor(request, env);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    // ---------- GET /api/health ----------
    if (url.pathname === "/api/health" && request.method === "GET") {
      return json(
        {
          status: "ok",
          timestamp: new Date().toISOString(),
          environment: "cloudflare-worker",
          aiEnabled: !!env.AI,
          stripeEnabled: !!env.STRIPE_SECRET_KEY,
        },
        200,
        cors
      );
    }

    // ---------- GET /api/ai/config ----------
    if (url.pathname === "/api/ai/config" && request.method === "GET") {
      return json({ aiEnabled: !!env.AI }, 200, cors);
    }

    // ---------- POST /api/ai/generate ----------
    // Real AI content generation via Cloudflare Workers AI.
    // Body: { idea, platform, tone }
    if (url.pathname === "/api/ai/generate" && request.method === "POST") {
      let body: any;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Invalid JSON body" }, 400, cors);
      }

      const idea = (body?.idea || "").toString().trim();
      const platform = (body?.platform || "linkedin").toString().trim().toLowerCase();
      const tone = (body?.tone || "growth").toString().trim().toLowerCase();

      if (!idea) return json({ error: "An idea is required" }, 400, cors);
      if (idea.length > 4000) return json({ error: "Idea is too long (max 4000 characters)" }, 400, cors);
      if (!(platform in PLATFORM_RULES)) {
        return json({ error: `Unsupported platform: ${platform}` }, 400, cors);
      }

      // AI not configured — tell the client to use its local fallback
      if (!env.AI) {
        return json({ error: "AI is not enabled on this worker", isFallback: true }, 503, cors);
      }

      const messages = [
        { role: "system", content: "You are a senior social media copywriter. You write clean, high-performing posts. Output only the requested copy." },
        { role: "user", content: buildPrompt(idea, platform, tone) },
      ];

      let content = "";
      let usedModel = "";

      for (const model of AI_MODELS) {
        try {
          const result: any = await env.AI.run(model, {
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
        return json({ error: "AI generation failed", isFallback: true }, 502, cors);
      }

      return json(
        {
          content,
          platform,
          tone,
          generatedBy: "cloudflare-workers-ai",
          model: usedModel,
        },
        200,
        cors
      );
    }

    // ---------- POST /api/collect-email ----------
    if (url.pathname === "/api/collect-email" && request.method === "POST") {
      let body: any;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Invalid JSON body" }, 400, cors);
      }

      const email = (body?.email || "").toString().trim().toLowerCase();
      if (!email) return json({ error: "Email is required" }, 400, cors);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return json({ error: "Please provide a valid email address" }, 400, cors);
      }

      if (!env.CAPTIVATION_HUB_API_KEY) {
        return json({ error: "Email collection not configured" }, 500, cors);
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
            Authorization: `Bearer ${env.CAPTIVATION_HUB_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactPayload),
        });

        const ghlData: any = await ghlResponse.json().catch(() => ({}));

        if (!ghlResponse.ok) {
          console.error("Captivation Hub error:", JSON.stringify(ghlData));
          return json({ error: "Failed to save contact", details: ghlData?.message || "Unknown error" }, 500, cors);
        }

        return json({ success: true, contactId: ghlData?.contact?.id || null, message: "Email collected successfully" }, 200, cors);
      } catch (err: any) {
        console.error("Captivation Hub request failed:", err?.message || err);
        return json({ error: "Failed to save contact" }, 500, cors);
      }
    }

    // ---------- GET /api/billing/config ----------
    if (url.pathname === "/api/billing/config" && request.method === "GET") {
      return json(
        {
          isStripeEnabled: !!env.STRIPE_SECRET_KEY,
          publishableKey: env.VITE_STRIPE_PUBLISHABLE_KEY || "",
          hasPublishableKey: !!env.VITE_STRIPE_PUBLISHABLE_KEY,
          fallbackTrialActive: true,
        },
        200,
        cors
      );
    }

    // ---------- POST /api/billing/create-checkout-session ----------
    if (url.pathname === "/api/billing/create-checkout-session" && request.method === "POST") {
      let body: any;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Invalid JSON body" }, 400, cors);
      }
      const { planName, email, brandName, selectedTone, connectedChannels } = body;

      const appUrl = env.APP_URL || "https://bmai-synapse-sync.pages.dev";
      const normalizedPlan = (planName || "Pro").trim();
      const targetEmail = (email || "user@example.com").trim();
      const targetBrand = (brandName || "My Sync Space").trim();

      // Mock mode if no Stripe key
      if (!env.STRIPE_SECRET_KEY) {
        return json(
          {
            isMock: true,
            redirectUrl: `${appUrl}/?payment=success&plan=${encodeURIComponent(normalizedPlan)}&brand=${encodeURIComponent(targetBrand)}&tone=${encodeURIComponent(selectedTone || "growth")}&channels=${encodeURIComponent(JSON.stringify(connectedChannels || []))}`,
            message: "Stripe key not configured. Running in sandbox mock mode.",
          },
          200,
          cors
        );
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
            Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
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
          return json({ error: session?.error?.message || "Stripe error", isMockFallback: true }, 500, cors);
        }

        return json({ isMock: false, sessionId: session.id, redirectUrl: session.url }, 200, cors);
      } catch (err: any) {
        console.error("Stripe request failed:", err?.message || err);
        return json({ error: "Failed to create checkout session", isMockFallback: true }, 500, cors);
      }
    }

    return json({ error: "Not found" }, 404, cors);
  },
};
