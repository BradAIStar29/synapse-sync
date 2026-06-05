/**
 * Synapse Sync — Cloudflare Worker (Stripe API Backend)
 * Handles all /api/* routes. Deployed separately via wrangler.
 * Frontend (Cloudflare Pages) calls this worker via VITE_API_URL.
 */

export interface Env {
  STRIPE_SECRET_KEY: string;
  VITE_STRIPE_PUBLISHABLE_KEY: string;
  APP_URL: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // GET /api/health
    if (url.pathname === "/api/health" && request.method === "GET") {
      return json({ status: "ok", timestamp: new Date().toISOString(), environment: "cloudflare-worker" });
    }

    // GET /api/billing/config
    if (url.pathname === "/api/billing/config" && request.method === "GET") {
      const hasSecret = !!env.STRIPE_SECRET_KEY;
      return json({
        isStripeEnabled: hasSecret,
        publishableKey: env.VITE_STRIPE_PUBLISHABLE_KEY || "",
        hasPublishableKey: !!env.VITE_STRIPE_PUBLISHABLE_KEY,
        fallbackTrialActive: true,
      });
    }

    // POST /api/billing/create-checkout-session
    if (url.pathname === "/api/billing/create-checkout-session" && request.method === "POST") {
      const body = await request.json() as any;
      const { planName, email, brandName, selectedTone, connectedChannels } = body;

      const appUrl = env.APP_URL || "https://bmai-synapse-sync.pages.dev";
      const normalizedPlan = (planName || "Pro").trim();
      const targetEmail = (email || "user@example.com").trim();
      const targetBrand = (brandName || "My Sync Space").trim();

      // Mock mode if no Stripe key
      if (!env.STRIPE_SECRET_KEY) {
        return json({
          isMock: true,
          redirectUrl: `${appUrl}/?payment=success&plan=${encodeURIComponent(normalizedPlan)}&brand=${encodeURIComponent(targetBrand)}&tone=${encodeURIComponent(selectedTone || "growth")}&channels=${encodeURIComponent(JSON.stringify(connectedChannels || []))}`,
          message: "Stripe key not configured. Running in sandbox mock mode.",
        });
      }

      // Real Stripe checkout
      const amount = normalizedPlan.toLowerCase().includes("starter") ? 1000 : 10000;
      const displayName = normalizedPlan.toLowerCase().includes("starter") ? "Synapse Sync Starter Plan" : "Synapse Sync Pro Plan";
      const description = normalizedPlan.toLowerCase().includes("starter")
        ? "Automated brand co-pilot for solo creators (14-day zero-risk trial)"
        : "Complete AI content engine for brand agencies (14-day zero-risk trial)";

      const trialEndTimestamp = Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60;

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

      const session = await stripeResponse.json() as any;

      if (!stripeResponse.ok) {
        return json({ error: session?.error?.message || "Stripe error", isMockFallback: true }, 500);
      }

      return json({ isMock: false, sessionId: session.id, redirectUrl: session.url });
    }

    return json({ error: "Not found" }, 404);
  },
};
