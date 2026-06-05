# Synapse Sync Codebase Documentation

This document contains the entire system architecture, directory path map, and all core source code files of the **Synapse Sync** web application. You can copy, download, or integrate this document directly into your local development environment.

---

## 📂 Project Structure & Modules

Here is the layout of all project files in the workspace tree:

```text
/
├── .env.example                     # Environment variable template (Stripe & URLs)
├── .gitignore                       # Ignored directories for Git (node_modules, dist)
├── index.html                       # Primary HTML entry point
├── metadata.json                    # Application metadata for AI Studio & Frame permissions
├── package.json                     # Node.js dependencies and build/dev scripts
├── server.ts                        # Production-ready Express API & Vite dev middleware backend
├── tsconfig.json                    # TypeScript compiler configuration
├── vite.config.ts                   # Vite configuration including CSS processing
└── src/
    ├── App.tsx                      # Main React entry point with routing & URL search parameter handlers
    ├── index.css                    # Global CSS importing Tailwind CSS and Google Fonts
    ├── main.tsx                     # React DOM mount entry point
    ├── templates.ts                 # Preset optimization templates used for AI components
    ├── types.ts                     # TypeScript shared interfaces and types
    └── context/
        └── AuthContext.tsx          # Authentication, Profile, and Workspace persistence state (LocalStorage)
    └── components/
        ├── AssetLibraryAndRepurposer.tsx  # Campaign & brand asset workshop
        ├── AuthModal.tsx             # Sign-up and Login dialog windows
        ├── DashboardWorkspace.tsx    # Central dashboard hub & analytics metrics
        ├── FAQ.tsx                   # FAQ accordions
        ├── Features.tsx              # Interactive feature description cards
        ├── Footer.tsx                # Page footer elements
        ├── Hero.tsx                  # Landing page header & Calls To Action
        ├── InteractiveSandbox.tsx    # Client-side sandbox demo (playground without auth)
        ├── LegalModal.tsx            # Terms of Service & Privacy Policy terms
        ├── Navigation.tsx            # Sticky header navigation bar with Auth state indicators
        ├── OnboardingFlow.tsx        # Guided first-time setup checklist
        ├── Pricing.tsx               # Pricing tiers linking to Stripe Checkout session creation
        └── TrialModal.tsx            # Multi-step onboarding and secure Stripe Trial setup modal
```

---

## 🌐 1. Backend Server (`/server.ts`)

This Node.js backend serves as a secure proxy to the **Stripe** payment API. It reads environment credentials safely server-side, protecting your secret API keys from client-side exposure. If Stripe credentials are not yet configured in your deployment settings, the server automatically degrades into an interactive, beautifully simulated test sandbox environment.

```typescript
import express from "express";
import path from "path";
import dotenv from "dotenv";
import Stripe from "stripe";
import { createServer as createViteServer } from "vite";

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

    // Map plan metrics: Starter ($10/mo) vs Pro ($100/mo)
    const amount = normalizedPlan.toLowerCase().includes("starter") ? 1000 : 10000;
    const displayName = normalizedPlan.toLowerCase().includes("starter") ? "Synapse Sync Starter Plan" : "Synapse Sync Pro Plan";
    const description = normalizedPlan.toLowerCase().includes("starter") 
      ? "Automated brand co-pilot for solo creators (14-day zero-risk trial)"
      : "Complete AI content engine for brand agencies (14-day zero-risk trial)";

    if (!stripe) {
      // If Stripe keys are not provided yet, handle elegant mock parameters
      console.log(`[Billing Sandbox] Generating fully simulated checkout callback URL for ${displayName} to ${targetEmail}`);
      
      // Simulate low connection parameters safely prior to response sending
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

// Bootstrap development / production pipeline
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
```

---

## 📦 2. Manifest & Configuration (`/package.json`)

Registers all dependencies and automates compilation, bundling the Express TypeScript backend into an optimized CommonJS bundle (`/dist/server.cjs`) to achieve lightweight size limits and fast response times in production.

```json
{
  "name": "react-example",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs",
    "clean": "rm -rf dist server.js",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "stripe": "^22.2.0",
    "vite": "^6.2.3"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    "autoprefixer": "^10.4.21",
    "esbuild": "^0.25.0",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.3"
  }
}
```

---

## 🔒 3. Environment Variables (`/.env.example`)

Defines parameters for production billing integration. These values can be safely set in the AI Studio Settings panel:

```env
# Full deployment domain (Configured automatically by Cloud Run hosts)
APP_URL="MY_APP_URL"

# Stripe Secret Key (Enables production-grade live checkouts; do not reveal to browser)
STRIPE_SECRET_KEY=

# Stripe Publishable Key (Optional, for client-side transaction verifications)
VITE_STRIPE_PUBLISHABLE_KEY=
```

---

## 🚂 4. Client-side Router & Stripe Success Actions (`/src/App.tsx`)

This module listens for checkout redirection state callbacks. After a customer successfully finishes their Stripe Checkout payment, the system captures parameter payloads, unlocks user profiles, and updates workspace variables instantly.

```typescript
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const paymentStatus = params.get('payment');
  
  if (paymentStatus === 'success' && user) {
    const brand = params.get('brand');
    const tone = params.get('tone');
    const channelsStr = params.get('channels');
    
    if (brand) {
      updateWorkspaceName(decodeURIComponent(brand));
    }
    if (tone) {
      updateBrandTone(decodeURIComponent(tone));
    }
    if (channelsStr) {
      try {
        const decodedChannels = decodeURIComponent(channelsStr);
        const channels = JSON.parse(decodedChannels);
        if (Array.isArray(channels)) {
          channels.forEach(ch => {
            if (ch) connectPlatform(ch);
          });
        }
      } catch (e) {
        console.error("Failed to parse redirected channels params:", e);
      }
    }
    
    // Mark onboarding as complete to safely unlock the dashboard
    completeOnboarding();
    
    // Purge query strings to provide a clean and professional browser URL
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }
}, [user]);
```

---

## 🛠️ 5. Deployment Instructions

Follow these clear steps to run or deploy your applete locally or in production:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Setup your environment:**
   Copy `.env.example` to `.env` and fill in your actual Stripe credentials.

3. **Boot the Developer Workspace:**
   This starts the dynamic fullstack environment with hot assets streaming proxy:
   ```bash
   npm run dev
   ```

4. **Compile Production Artifacts:**
   This builds static assets and bundles the Express API server:
   ```bash
   npm run build
   ```

5. **Start the Live Web App:**
   Runs the compiled applet cleanly:
   ```bash
   npm run start
   ```
