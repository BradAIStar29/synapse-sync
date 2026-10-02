/**
 * BMAI Asset Consultant — a stateful AI agent built on the Cloudflare Agents SDK.
 * Each visitor session gets its own Durable Object instance with persistent
 * conversation memory. Routed at /agents/bmai-consultant-agent/:sessionId
 */

import { Agent } from "agents";
import type { Env } from "./index";

// Workers AI models — tried in order; if one is retired/unavailable the next runs
export const AI_MODELS = [
  "@cf/meta/llama-3.1-8b-instruct-fp8", // fast, cheap, good at short-form marketing copy
  "@cf/meta/llama-3.3-70b-instruct-fp8-fast", // higher quality fallback
  "@cf/meta/llama-3.2-3b-instruct", // lightweight last resort
];

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ConsultantState {
  messages: ChatMessage[];
  emailCaptured?: boolean;
}

const MAX_HISTORY = 24; // keep the conversation bounded
const MAX_REPLY_TOKENS = 500;

const SYSTEM_PROMPT = `You are the BMAI Asset Consultant — the AI assistant for BMAIProductions, a digital asset lab.

Your job: help visitors turn their ideas, skills, or niche into digital assets (ebooks, audiobooks, courses, guides, newsletters, articles, YouTube content, AI agents, chatbots, and templates).

Guidelines:
- Be warm, sharp, and encouraging — like a knowledgeable business partner.
- Keep replies concise: under 120 words unless the user asks for detail.
- Ask one clarifying question at most, then give concrete, actionable suggestions.
- Recommend specific asset formats for their idea and how to monetize them.
- When relevant, mention the free AI Asset Blueprint Generator on the site.
- If the user wants to stay updated or seems ready to start, invite them to share their email so they can get the free Digital Asset Starter Pack. Ask naturally, never push.
- Never invent facts about BMAIProductions beyond: it is a digital asset lab; it has a sister site NOVA (AI avatar/content persona); there is a free starter pack for email subscribers.
- Never mention or claim to be affiliated with any company other than BMAIProductions.`;

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

export class BmaiConsultantAgent extends Agent<Env, ConsultantState> {
  initialState: ConsultantState = { messages: [] };

  /** GET → agent info / liveness */
  async onRequest(request: Request): Promise<Response> {
    if (request.method === "GET") {
      return Response.json({
        status: "ok",
        agent: "bmai-asset-consultant",
        aiEnabled: !!this.env.AI,
        turns: this.state.messages.length,
      });
    }

    if (request.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const message = (body?.message || "").toString().trim().slice(0, 4000);
    if (!message) return Response.json({ error: "A message is required" }, { status: 400 });

    if (!this.env.AI) {
      return Response.json({ error: "AI is not enabled on this worker", isFallback: true }, { status: 503 });
    }

    // 1. Append the user's message to persistent state
    const history = [...this.state.messages, { role: "user", content: message } as ChatMessage];

    // 2. Generate a reply with the model chain
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-MAX_HISTORY).map((m) => ({ role: m.role, content: m.content })),
    ];

    let reply = "";
    for (const model of AI_MODELS) {
      try {
        const result: any = await this.env.AI.run(model, {
          messages,
          max_tokens: MAX_REPLY_TOKENS,
        });
        reply = (result?.response || result?.text || "").toString().trim();
        if (reply) break;
      } catch (err: any) {
        console.error(`Consultant AI error (${model}):`, err?.message || err);
      }
    }

    if (!reply) {
      return Response.json({ error: "AI generation failed", isFallback: true }, { status: 502 });
    }

    // 3. Persist the exchange (bounded history)
    const updated = [...history, { role: "assistant", content: reply } as ChatMessage]
      .slice(-(MAX_HISTORY + 2));
    this.setState({ messages: updated });

    // 4. Opportunistic lead capture: if the user shared an email, push it to the CRM
    let emailCaptured = false;
    if (!this.state.emailCaptured && this.env.CAPTIVATION_HUB_API_KEY) {
      const emails = message.match(EMAIL_RE);
      if (emails && emails.length) {
        const email = emails[0].toLowerCase();
        try {
          const ghlRes = await fetch("https://rest.gohighlevel.com/v1/contacts/", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.env.CAPTIVATION_HUB_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              source: "BMAI AI Consultant Chat",
              tags: ["synapse-sync", "website-lead", "ai-chat-lead"],
            }),
          });
          if (ghlRes.ok) {
            emailCaptured = true;
            this.setState({ ...this.state, emailCaptured: true });
          }
          console.log(`Consultant lead capture (${email}):`, ghlRes.status);
        } catch (err: any) {
          console.error("Consultant lead capture failed:", err?.message || err);
        }
      }
    }

    return Response.json({
      reply,
      emailCaptured,
      generatedBy: "cloudflare-workers-ai",
    });
  }
}
