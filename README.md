<div align="center">

# ARISE Eats

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**A modern, AI-powered food delivery platform with gamification — built with Next.js 16**

</div>

---

## About the Project

ARISE Eats is a full-stack food delivery application that goes beyond simple ordering. It combines the convenience of browsing and ordering from local restaurants with an intelligent AI concierge (ARIA) that learns your preferences and suggests meals based on your mood, dietary habits, and past orders. On top of that, a gamification layer keeps users engaged through XP rewards, daily quests, streaks, and a community leaderboard — turning everyday meals into a fun, rewarding experience.

The idea behind ARISE Eats is to make food ordering feel personal and engaging rather than transactional. Whether you are discovering a new cuisine, tracking your eating habits, or competing with friends on the leaderboard, the app is designed to add value to every interaction.

---

## Features

- Browse 30+ restaurants across cuisines including Indian, Italian, Japanese, Korean, Thai, and more
- Add items to cart, apply coupon codes, and pay via UPI, card, or net banking
- ARIA — an in-app AI coach that recommends meals based on your mood and eating patterns
- Gamification system with XP, levels, daily quests, streaks, and a community leaderboard
- Voice input support for logging meals hands-free
- Live walking map (Explore tab) showing nearby food spots with XP rewards

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS v4 + Radix UI + shadcn/ui |
| Backend | Supabase (auth, database, realtime) |
| Payments | Stripe |
| AI and Voice | Groq + Sarvam |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in your keys:
- Supabase project URL and anon key (from [supabase.com](https://supabase.com))
- Stripe publishable and secret keys
- Groq API key (optional, for AI features)

### 3. Set up the database

In your Supabase project, open the SQL editor and run these files in order:

1. `supabase/food-delivery-schema.sql` — creates all tables
2. `supabase/seed-restaurants.sql` — adds 30 restaurants with menus

### 4. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Coupon Codes

| Code | Discount |
|------|----------|
| `WELCOME50` | 50% off, up to Rs.150 |
| `SAVE100` | Rs.100 off on orders above Rs.499 |
| `FREEDEL` | Free delivery on orders above Rs.299 |

---

## Project Structure

```
app/              Pages (Next.js App Router)
components/       Reusable UI components
lib/              Types, context, utilities
supabase/         SQL schema and seed files
hooks/            Custom React hooks
```

---

## Notes

- The app requires a Supabase project to function. Without it, restaurant listings and cart will not load.
- Stripe is only needed if you want real payment flows. The checkout page works in test mode with Stripe test keys.
- AI features (ARIA coach, meal recommendations) require a Groq API key. The app degrades gracefully without it.

---

<div align="center">

Built by **Shreya P Shetty**

</div>
