import express from "express";
import path from "path";
import dotenv from "dotenv";
import Stripe from "stripe";
import { createServer as createViteServer } from "vite";

// Ensure variables are parsed representing current sandbox settings
dotenv.config();

const app = express();
const PORT = 3000;

// Lazy initialize Stripe to prevent server start crashes if credentials are not yet set
let stripeClient: Stripe | null = null;
function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: "2025-01-27.acme" as any,
    });
  }
  return stripeClient;
}

// Global Middlewares
app.use(express.json());

// API: Health probe
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API: Check stripe configurations
app.get("/api/billing/config", (req, res) => {
  const hasSecret = !!process.env.STRIPE_SECRET_KEY;
  const publishableKey = process.env.VITE_STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLISHABLE_KEY || "";
  
  res.json({
    isStripeEnabled: hasSecret,
    publishableKey: publishableKey,
    hasPublishableKey: !!publishableKey,
    fallbackTrialActive: true,
  });
});

// API: Begin Secure checkout session
app.post("/api/billing/create-checkout-session", async (req, res) => {
  try {
    const { planName, email, brandName, selectedTone, connectedChannels } = req.body;
    
    const stripe = getStripe();
    const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;

    // Elegant fallbacks in case input is trimmed or empty
    const normalizedPlan = (planName || "Pro").trim();
    const targetEmail = (email || "user@example.com").trim();
    const targetBrand = (brandName || "My Sync Space").trim();

    // Map plan metrics
    const amount = normalizedPlan.toLowerCase().includes("starter") ? 1000 : 10000; // $10 vs $100 in cents
    const displayName = normalizedPlan.toLowerCase().includes("starter") ? "Synapse Sync Starter Plan" : "Synapse Sync Pro Plan";
    const description = normalizedPlan.toLowerCase().includes("starter") 
      ? "Automated brand co-pilot for solo creators (14-day zero-risk trial)"
      : "Complete AI content engine for brand agencies (14-day zero-risk trial)";

    if (!stripe) {
      // If Stripe keys are not provided yet, handle elegant mock parameters
      // This is highly informative, fully operational, and compliant with development regulations
      console.log(`[Billing Sandbox] Generating fully simulated checkout callback URL for ${displayName} to ${targetEmail}`);
      
      // Simulate slow connection parameters safely prior to response sending
      await new Promise((resolve) => setTimeout(resolve, 600));

      return res.json({
        isMock: true,
        redirectUrl: `${appUrl}/?payment=success&plan=${encodeURIComponent(normalizedPlan)}&brand=${encodeURIComponent(targetBrand)}&tone=${encodeURIComponent(selectedTone || "growth")}&channels=${encodeURIComponent(JSON.stringify(connectedChannels || []))}`,
        message: "Stripe key not found in server environments. Proceeding with fully simulated test sandbox payment.",
      });
    }

    // Process actual Stripe Checkout Session
    console.log(`[Stripe Billing] Initializing subscription checkout session for: ${targetEmail}`);
    
    // Set trial period parameter (14 days)
    const trialEndTimestamp = Math.floor(Date.now() / 1000) + (14 * 24 * 60 * 60);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: displayName,
              description: description,
              metadata: {
                brandName: targetBrand,
                tone: selectedTone || "growth",
              },
            },
            unit_amount: amount,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_end: trialEndTimestamp,
      },
      customer_email: targetEmail,
      // Metadata mapping back in webhooks
      metadata: {
        planName: normalizedPlan,
        brandName: targetBrand,
        tone: selectedTone || "growth",
      },
      success_url: `${appUrl}/?payment=success&plan=${encodeURIComponent(normalizedPlan)}&brand=${encodeURIComponent(targetBrand)}&tone=${encodeURIComponent(selectedTone || "growth")}&channels=${encodeURIComponent(JSON.stringify(connectedChannels || []))}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/?payment=cancelled&plan=${encodeURIComponent(normalizedPlan)}`,
    });

    return res.json({
      isMock: false,
      sessionId: session.id,
      redirectUrl: session.url,
    });

  } catch (error: any) {
    console.error("[Stripe Creation Error]", error);
    return res.status(500).json({
      error: error?.message || "Internal server error occurred when provisioning checkout workflow.",
      isMockFallback: true,
    });
  }
});

// Mount Vite middleware OR static assets serving depending on target deployment
async function bootstrapServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Middleware Integration
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Assets Pipeline Routing
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    // Standard SPA match fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Fullstack Server] Synapse Sync system actively listening on: http://localhost:${PORT}`);
    console.log(`[Stripe Configuration] ${process.env.STRIPE_SECRET_KEY ? "CONNECTED" : "FALLBACK_MOCK_ACTIVE"}`);
  });
}

bootstrapServer().catch((err) => {
  console.error("Critical failure bootstrapping Synapse Sync server pipeline:", err);
});
