<div align="center">

# ARISE Eats

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**A modern, AI-powered food delivery platform with gamification — built with Next.js 16**

https://kmp-plagiarism-detector.vercel.app/

</div>

---

## About the Project

ARISE Eats is not just another food delivery app. It is a full-stack web application that reimagines how people discover, order, and enjoy food online. At its core, it lets users browse restaurants, build a cart, and pay seamlessly. But what sets it apart is the layer of intelligence and engagement built on top of that foundation.

The app includes an AI concierge called ARIA that acts like a personal food coach. It learns from your past orders, understands your dietary preferences, and can suggest meals based on how you are feeling on a given day. If you tell ARIA you are tired and want something light, it will recommend accordingly. If you have been eating heavy meals all week, it might nudge you toward something balanced.

On top of that, there is a full gamification system. Every order you place, every quest you complete, and every streak you maintain earns you XP. You level up, unlock achievements, and compete on a community leaderboard. The goal is to make food ordering feel less like a chore and more like something you look forward to.

This project was built as a demonstration of how modern web technologies can come together to create a polished, production-quality application that feels personal and alive.

---

## What Makes This Different

Most food delivery apps are transactional. You open them, order, close them, and forget about them until the next meal. ARISE Eats is designed to be different in a few key ways:

- **It learns from you.** ARIA, the AI concierge, does not just list popular items. It builds a picture of your eating habits over time and makes suggestions that actually make sense for you.

- **It rewards consistency.** The gamification system is not a gimmick. Daily quests, streaks, and XP create a feedback loop that encourages healthier eating patterns and regular engagement.

- **It feels complete.** This is not a half-built prototype. It has authentication, real payment processing, a proper database layer, voice input, real-time updates, and a responsive UI that works on mobile and desktop.

- **It is built with modern tools.** Next.js 16 with the App Router, React 19, Tailwind CSS v4, Supabase for the backend, and Stripe for payments. Everything is TypeScript, everything is typed, and the codebase is structured for maintainability.

---

## Features

### Restaurant Discovery and Ordering
- Browse over 30 restaurants spanning Indian, Italian, Japanese, Korean, Thai, Mediterranean, and more
- View detailed menus with item descriptions, prices, and dietary tags
- Add items to a persistent cart that syncs across sessions
- Apply coupon codes at checkout for discounts and free delivery

### Payment Processing
- Full Stripe integration with support for cards, UPI, and net banking
- Secure checkout flow with order confirmation
- QR code generation for UPI payments
- Works in Stripe test mode for development

### AI Concierge (ARIA)
- Chat-based interface powered by Groq for fast inference
- Recommends meals based on mood, dietary preferences, and order history
- Learns your patterns over time and adapts suggestions
- Voice input support via Sarvam for hands-free interaction

### Gamification System
- XP earned for placing orders, completing quests, and maintaining streaks
- Level progression system with unlockable tiers
- Daily and weekly quests that refresh automatically
- Streak tracking that rewards consistent engagement
- Community leaderboard to compete with other users

### Additional Features
- Supabase authentication with email/password and OAuth
- Real-time order status updates
- Explore tab with a walking map showing nearby food spots
- Hydration tracking and behavioral insights
- Responsive design that works on all screen sizes
- Dark mode support via next-themes

---

## Tech Stack

This project uses a modern, production-ready stack. Every technology was chosen for a reason.

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 16 (App Router) | Server components, streaming, and the latest React features |
| Language | TypeScript 5.7 | Type safety across the entire codebase |
| Styling | Tailwind CSS v4 + Radix UI + shadcn/ui | Utility-first CSS with accessible, unstyled primitives |
| Backend | Supabase | Postgres database, authentication, real-time subscriptions, and row-level security |
| Payments | Stripe | Industry-standard payment processing with test mode support |
| AI | Groq | Fast LLM inference for the ARIA concierge |
| Voice | Sarvam | Speech-to-text for voice-based meal logging |
| Animations | Framer Motion | Smooth, performant UI transitions |
| Charts | Recharts | Data visualization for user stats and insights |
| Deployment | Vercel | Zero-config deployment optimized for Next.js |

---

## How the Code is Organized

The project follows a clean separation of concerns. Here is what each directory does:

```
app/                  Next.js App Router pages and API routes
  auth/               Login, sign-up, callback, and error pages
  cart/               Shopping cart page
  checkout/           Payment flow (Stripe, QR code, return page)
  concierge/          ARIA AI chat interface
  dashboard/          User dashboard
  explore/            Map-based restaurant discovery
  home/               Main landing page after login
  leaderboard/        Community XP rankings
  orders/             Order history and tracking
  plans/              Subscription/meal plan options
  profile/            User profile and settings
  quests/             Daily and weekly quest system
  recommend/          AI-powered meal recommendations
  restaurant/         Individual restaurant detail pages
  restaurants/        Restaurant listing and search
  voice/              Voice input for meal logging
  api/                Backend API routes (chat, food analysis)

components/           Reusable UI components
  ui/                 shadcn/ui primitives (buttons, cards, dialogs, etc.)
  aria-coach.tsx      ARIA AI concierge component
  explore-map.tsx     Interactive map for nearby restaurants
  home-page-client.tsx  Main homepage client component
  quest-card.tsx      Quest display and progress tracking
  xp-bar.tsx          XP progress bar
  streak-counter.tsx  Streak tracking display
  meal-card.tsx       Restaurant menu item card
  ...and more

lib/                  Core application logic
  services/           Business logic layer (cart, orders, gamification, etc.)
  supabase/           Supabase client configuration (server and client)
  types.ts            TypeScript type definitions
  cart-context.tsx    Global cart state management
  user-stats-context.tsx  User XP and level state
  xp.ts              XP calculation utilities

hooks/                Custom React hooks
  use-toast.ts       Toast notification hook
  use-mobile.ts      Mobile detection hook

supabase/             Database layer
  food-delivery-schema.sql   Complete database schema
  seed-restaurants.sql       Restaurant and menu seed data
  migrations/                Schema migration files

backend/              Server-side utilities
  api/                API route handlers
  lib/                Server-only libraries
  actions/            Server actions (Stripe integration)

styles/               Global CSS and Tailwind configuration
public/               Static assets (images, videos, placeholders)
```

---

## Getting Started

### Prerequisites

You need the following installed on your machine:
- **Node.js 18** or higher
- **pnpm** (recommended package manager)

You also need accounts with:
- **Supabase** (free tier works) for the database and authentication
- **Stripe** (test mode) for payment processing
- **Groq** (optional) for AI features

### Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd food-delivery
pnpm install
```

### Step 2: Configure Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the following:

| Variable | Where to Get It |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project settings |
| `STRIPE_SECRET_KEY` | Stripe dashboard (use test key) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe dashboard (use test key) |
| `GROQ_API_KEY` | Groq console (optional) |

### Step 3: Set Up the Database

Go to your Supabase project, open the SQL Editor, and run these files in order:

1. **`supabase/food-delivery-schema.sql`** — Creates all tables, indexes, and row-level security policies
2. **`supabase/seed-restaurants.sql`** — Populates the database with 30 restaurants and their full menus

### Step 4: Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the landing page with restaurant listings.

### Step 5: Build for Production (Optional)

```bash
pnpm build
pnpm start
```

---

## Available Scripts

| Command | What It Does |
|---------|-------------|
| `pnpm dev` | Starts the development server with hot reload |
| `pnpm build` | Creates an optimized production build |
| `pnpm start` | Runs the production build locally |
| `pnpm lint` | Runs ESLint across the codebase |
| `pnpm type-check` | Runs TypeScript compiler without emitting files |

---

## Coupon Codes

These codes work on the cart page during checkout:

| Code | Discount |
|------|----------|
| `WELCOME50` | 50% off your order, up to Rs.150 |
| `SAVE100` | Rs.100 off on orders above Rs.499 |
| `FREEDEL` | Free delivery on orders above Rs.299 |

---

## How Things Work Under the Hood

### Authentication Flow
Users sign up or log in through Supabase Auth. The app uses server-side session management via `@supabase/ssr`, which means sessions are stored in cookies and validated on every request. Protected routes redirect unauthenticated users to the login page.

### Cart and Ordering
The cart is managed through React Context (`cart-context.tsx`) and persists to Supabase. When a user checks out, the app creates a Stripe payment session, redirects to the payment page, and on success, creates an order record in the database.

### AI Recommendations
When a user interacts with ARIA, the app sends their message along with context (past orders, preferences, time of day) to the Groq API. The response is streamed back in real-time using the Vercel AI SDK, so the user sees the reply as it is generated.

### Gamification
Every meaningful action (placing an order, completing a quest, logging a meal) triggers an XP award. The XP system is defined in `lib/xp.ts` and the gamification service (`lib/services/gamification.ts`) handles level calculations, streak tracking, and quest progress updates.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built by **Shreya P Shetty**

</div>
