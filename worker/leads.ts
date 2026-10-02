/**
 * Lead Vault — a self-hosted Durable Object replacing the Captivation Hub CRM.
 * Stores all captured emails in one persistent DO. Read them back via
 * GET /api/leads with the X-Admin-Key header (LEAD_ADMIN_KEY in wrangler vars).
 */

import { Agent } from "agents";
import type { Env } from "./index";

export interface Lead {
  email: string;
  source: string;
  tags: string[];
  firstName?: string;
  lastName?: string;
  phone?: string;
  capturedAt: string;
}

export interface LeadVaultState {
  leads: Lead[];
}

const MAX_LEADS = 5000;

export class LeadVault extends Agent<Env, LeadVaultState> {
  initialState: LeadVaultState = { leads: [] };

  async onRequest(request: Request): Promise<Response> {
    // POST — append a lead
    if (request.method === "POST") {
      let body: any;
      try {
        body = await request.json();
      } catch {
        return Response.json({ error: "Invalid JSON body" }, { status: 400 });
      }

      const email = (body?.email || "").toString().trim().toLowerCase();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return Response.json({ error: "Please provide a valid email address" }, { status: 400 });
      }

      // Dedupe: update the existing lead if this email is already stored
      const leads = [...this.state.leads];
      const existing = leads.findIndex((l) => l.email === email);
      const lead: Lead = {
        email,
        source: (body?.source || "Website").toString().slice(0, 200),
        tags: Array.isArray(body?.tags) ? body.tags.map((t: any) => t.toString().slice(0, 60)) : [],
        capturedAt: new Date().toISOString(),
      };
      if (body?.firstName) lead.firstName = body.firstName.toString().trim().slice(0, 100);
      if (body?.lastName) lead.lastName = body.lastName.toString().trim().slice(0, 100);
      if (body?.phone) lead.phone = body.phone.toString().trim().slice(0, 30);

      if (existing >= 0) leads[existing] = { ...leads[existing], ...lead };
      else leads.push(lead);

      this.setState({ leads: leads.slice(-MAX_LEADS) });

      return Response.json({
        success: true,
        message: "Email collected successfully",
        totalLeads: leads.length,
      });
    }

    // GET — read leads (admin key required)
    if (request.method === "GET") {
      const adminKey = this.env.LEAD_ADMIN_KEY;
      const provided = request.headers.get("X-Admin-Key") ||
        new URL(request.url).searchParams.get("key");
      if (!adminKey || provided !== adminKey) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      const leads = [...this.state.leads].reverse(); // newest first
      return Response.json({
        count: leads.length,
        leads,
      });
    }

    // DELETE — clear all leads (admin key required)
    if (request.method === "DELETE") {
      const adminKey = this.env.LEAD_ADMIN_KEY;
      const provided = request.headers.get("X-Admin-Key") ||
        new URL(request.url).searchParams.get("key");
      if (!adminKey || provided !== adminKey) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      this.setState({ leads: [] });
      return Response.json({ success: true, cleared: true });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }
}
