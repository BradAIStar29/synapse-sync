/**
 * Synapse Sync — shared API client
 * All frontend calls to the Cloudflare Worker backend go through here,
 * with graceful fallbacks so the site never breaks if the API is down.
 */

const API_BASE = import.meta.env.VITE_API_URL ?? "";

async function post<T>(path: string, body: unknown): Promise<{ ok: boolean; status: number; data: T }> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as T;
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: {} as T };
  }
}

async function get<T>(path: string): Promise<{ ok: boolean; status: number; data: T }> {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    const data = (await res.json().catch(() => ({}))) as T;
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: {} as T };
  }
}

/** Health check — also tells the frontend whether server AI is live */
export function checkHealth() {
  return get<{ status: string; aiEnabled?: boolean; stripeEnabled?: boolean }>("/api/health");
}

/**
 * AI content generation.
 * Returns { content, generatedBy } on success.
 * On failure returns { error, isFallback: true } — callers should
 * fall back to their local template generation.
 */
export function generateWithAI(idea: string, platform: string, tone: string) {
  return post<{ content: string; generatedBy?: string; isFallback?: boolean; error?: string }>(
    "/api/ai/generate",
    { idea, platform, tone }
  );
}

/** Email collection → Captivation Hub CRM */
export function collectEmail(email: string, options?: { firstName?: string; lastName?: string; source?: string }) {
  return post<{ success: boolean; contactId?: string; message?: string; error?: string }>("/api/collect-email", {
    email,
    ...options,
  });
}

/** Billing config (Stripe availability) */
export function getBillingConfig() {
  return get<{ isStripeEnabled: boolean; publishableKey: string; hasPublishableKey: boolean; fallbackTrialActive: boolean }>(
    "/api/billing/config"
  );
}

/** Create a Stripe checkout session */
export function createCheckoutSession(payload: {
  planName: string;
  email: string;
  brandName: string;
  selectedTone: string;
  connectedChannels: string[];
}) {
  return post<{ isMock: boolean; sessionId?: string; redirectUrl?: string; error?: string }>(
    "/api/billing/create-checkout-session",
    payload
  );
}

export { API_BASE };
