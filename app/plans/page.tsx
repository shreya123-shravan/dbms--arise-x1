import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChefHat,
  HeartPulse,
  Leaf,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteNav } from "@/components/site-nav"
import { BottomNav } from "@/components/bottom-nav"

type Tier = {
  id: string
  name: string
  price: string
  unit: string
  perks: string[]
  body: string
  cta: string
  href: string
  popular?: boolean
  badge?: string
  image: string
  bonus: string
}

const TIERS: Tier[] = [
  {
    id: "month-1",
    name: "One Month Plan",
    price: "₹300",
    unit: "/ meal",
    body: "A month of fresh, ready-to-eat chef meals (52 dishes). Delivered to your door. Pause or cancel anytime.",
    perks: [
      "52 chef-prepped meals",
      "Doorstep delivery",
      "Pause / cancel any time",
      "Daily ARIA recommendations",
    ],
    cta: "Start one month",
    href: "/dashboard",
    image: "/day-burger.jpg",
    bonus: "+ 200 XP welcome bonus",
  },
  {
    id: "month-3",
    name: "Three Month Plan",
    price: "₹250",
    unit: "/ meal",
    body: "A 3-month healthy routine made easy, with lunch & dinner covered. Best price per meal. Delivery charges apply.",
    perks: [
      "Lunch & dinner included",
      "Best price per meal",
      "Priority chef rotation",
      "1-on-1 nutritionist support",
      "Weekly habit reviews",
    ],
    cta: "Get the 3-month plan",
    href: "/dashboard",
    popular: true,
    badge: "Most popular",
    image: "/day-thali.jpg",
    bonus: "+ 1000 XP boost · 2x streak shields",
  },
  {
    id: "month-2",
    name: "Two Month Plan",
    price: "₹275",
    unit: "/ meal",
    body: "Commit for two months and save more. Lunch & dinner delivered fresh, every day. Delivery charges apply.",
    perks: [
      "Lunch & dinner included",
      "Free flavour swaps",
      "Doorstep delivery",
      "Weekly nutritionist check-in",
    ],
    cta: "Try two months",
    href: "/dashboard",
    image: "/day-mediterranean.jpg",
    bonus: "+ 500 XP boost",
  },
]

const FAQS = [
  {
    q: "How long do the meals last?",
    a: "Each meal is freshly prepared and delivered the same day. Refrigerated, they stay good for up to 36 hours, but most people eat them the day they arrive.",
  },
  {
    q: "Can I pause or cancel my plan?",
    a: "Yes — pause, skip a day, or cancel from your dashboard with one tap. No phone calls, no retention scripts.",
  },
  {
    q: "How does ARIA personalize my meals?",
    a: "ARIA reads your meal history, mood, time-of-day patterns and goals — and adjusts your weekly menu so it feels effortless to stick with.",
  },
  {
    q: "Are there vegan and high-protein tracks?",
    a: "Yes. Choose any track when you take the 2-minute questionnaire and ARIA will tune your weekly plan around it.",
  },
]

export default function PlansPage() {
  return (
    <div className="relative min-h-screen bg-background pb-20 md:pb-0">
      <SiteNav />

      {/* ---------- HEADER ---------- */}
      <section className="relative mx-auto max-w-6xl px-4 pt-12 pb-8 md:px-6 md:pt-20">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-0 h-[420px] bg-aurora" />
        <header className="relative flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-amber">
            <Sparkles className="size-3" aria-hidden="true" />
            Plans &amp; pricing
          </span>
          <h1 className="text-balance text-4xl font-extrabold md:text-6xl">
            Pick your{" "}
            <span className="rounded-md bg-amber-block px-2 py-0.5">eating rhythm</span>
          </h1>
          <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            All plans include doorstep delivery, ARIA-personalised menus and pause-anytime
            flexibility. Pick the cadence that fits your life — we&apos;ll handle the cooking.
          </p>
        </header>
      </section>

      {/* ---------- TIER CARDS ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <div className="grid items-stretch gap-5 md:grid-cols-3">
          {TIERS.map((tier) => (
            <article
              key={tier.id}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border ${
                tier.popular
                  ? "border-primary/60 glass-strong glow-primary"
                  : "border-border/60 glass"
              } transition-transform duration-300 hover:-translate-y-1`}
            >
              {tier.popular && (
                <span className="absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-full bg-amber-block px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em]">
                  {tier.badge}
                </span>
              )}

              <div className="relative aspect-[5/3] w-full overflow-hidden border-b border-border/60">
                <Image
                  src={tier.image || "/placeholder.svg"}
                  alt={tier.name}
                  fill
                  sizes="(min-width: 768px) 360px, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent"
                />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-forest-block px-3 py-1.5 text-xs font-bold">
                  <Calendar className="size-3" aria-hidden="true" />
                  {tier.name}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{tier.price}</span>
                  <span className="text-sm text-muted-foreground">{tier.unit}</span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{tier.body}</p>

                <ul className="mt-1 flex flex-col gap-2 text-sm">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2">
                      <CheckCircle2
                        className="size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      {perk}
                    </li>
                  ))}
                </ul>

                {/* XP bonus badge */}
                <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-amber/40 bg-amber/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber">
                  <Zap className="size-3" aria-hidden="true" />
                  {tier.bonus}
                </span>

                <Button
                  asChild
                  className={`mt-auto font-bold ${tier.popular ? "glow-primary" : ""}`}
                  variant={tier.popular ? "default" : "outline"}
                >
                  <Link href={tier.href}>
                    {tier.cta}
                    <ArrowRight className="ml-1 size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- WHY ARISE BAR ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-3 md:grid-cols-4">
          {[
            { Icon: Leaf, title: "Whole food", body: "Real ingredients, never powdered shortcuts." },
            { Icon: ChefHat, title: "Chef-prepped", body: "Made fresh every day, never reheated." },
            { Icon: Truck, title: "Doorstep", body: "Delivered to home or office, on schedule." },
            { Icon: HeartPulse, title: "Adaptive", body: "ARIA tunes meals to your goals & mood." },
          ].map(({ Icon, title, body }) => (
            <div
              key={title}
              className="flex items-start gap-3 rounded-2xl border border-border/60 glass p-4"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-block">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{title}</span>
                <span className="text-xs text-muted-foreground">{body}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <header className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Frequently asked
          </span>
          <h2 className="text-balance text-3xl font-bold md:text-4xl">
            Everything you wanted to know
          </h2>
        </header>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-border/60 glass open:glass-strong"
              {...(i === 0 ? { open: true } : {})}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold marker:hidden">
                <span>{faq.q}</span>
                <span
                  aria-hidden="true"
                  className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-block text-xs font-bold transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- FINAL CTA ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
        <div className="relative overflow-hidden rounded-[36px] bg-amber-block px-6 py-12 text-center md:px-12 md:py-16">
          <div
            aria-hidden="true"
            className="absolute -left-10 -top-10 size-48 rounded-full bg-cream/30 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -right-10 -bottom-10 size-56 rounded-full bg-forest/30 blur-3xl"
          />
          <h2 className="relative mx-auto max-w-2xl text-balance text-3xl font-extrabold leading-tight md:text-5xl">
            Your plan starts with your story.
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-pretty text-sm leading-relaxed opacity-80 md:text-base">
            Take the 2-minute questionnaire and ARIA will draft a meal plan you can actually
            stick to.
          </p>
          <Button
            asChild
            size="lg"
            className="relative mt-6 bg-forest text-forest-foreground hover:bg-forest/90 font-bold"
          >
            <Link href="/recommend">
              Take the 2-minute questionnaire
              <ArrowRight className="ml-1 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      <BottomNav />
    </div>
  )
}
