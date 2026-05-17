/**
 * Horizontal hover-pause marquee.
 *
 * The track contains the items duplicated once. When the CSS animation
 * reaches translateX(-50%) the loop seamlessly repeats. Hovering anywhere
 * inside the wrapper pauses the animation via the `marquee-pause` class
 * (defined in globals.css).
 */
import { Brain, Zap, Mic, Globe2, ShieldCheck, Sparkles, Trophy, Heart } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface MarqueeItem {
  Icon: LucideIcon
  title: string
  desc: string
  tone: "primary" | "accent" | "muted"
}

const ITEMS: MarqueeItem[] = [
  {
    Icon: Brain,
    title: "ARIA AI Coach",
    desc: "Learns your patterns. Not generic advice — yours.",
    tone: "primary",
  },
  {
    Icon: Zap,
    title: "XP & Levels",
    desc: "Every healthy choice earns XP. Health is the game.",
    tone: "primary",
  },
  {
    Icon: Mic,
    title: "Voice-First",
    desc: "Hindi, Tamil, Kannada, Telugu, English.",
    tone: "accent",
  },
  {
    Icon: Globe2,
    title: "Community Missions",
    desc: "When your city wins, healthcare costs drop.",
    tone: "accent",
  },
  {
    Icon: ShieldCheck,
    title: "Anti-Addiction",
    desc: "Daily XP caps. Rest-day bonuses. No dark patterns.",
    tone: "muted",
  },
  {
    Icon: Sparkles,
    title: "Behavioral RAG",
    desc: "Real-time signals + history → grounded answers.",
    tone: "primary",
  },
  {
    Icon: Trophy,
    title: "Tiny Habits",
    desc: "Fogg-grounded loops. Small wins, lasting change.",
    tone: "accent",
  },
  {
    Icon: Heart,
    title: "Built for India",
    desc: "500M+ vernacular speakers, served first.",
    tone: "muted",
  },
]

function Card({ item }: { item: MarqueeItem }) {
  const toneClasses =
    item.tone === "primary"
      ? "text-primary ring-primary/30 bg-primary/10"
      : item.tone === "accent"
        ? "text-accent ring-accent/40 bg-accent/15"
        : "text-foreground ring-border bg-secondary"

  return (
    <article
      className="group relative flex w-72 shrink-0 flex-col gap-3 rounded-xl border border-border/60 glass p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40"
      aria-label={item.title}
    >
      <span
        className={`flex size-9 items-center justify-center rounded-lg ring-1 ${toneClasses}`}
        aria-hidden="true"
      >
        <item.Icon className="size-5" />
      </span>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold leading-tight text-foreground">{item.title}</h3>
        <p className="text-[13px] leading-relaxed text-muted-foreground">{item.desc}</p>
      </div>
    </article>
  )
}

export function FeatureMarquee() {
  // Duplicate the list so a -50% translate loops seamlessly.
  const loop = [...ITEMS, ...ITEMS]

  return (
    <section
      aria-label="Platform capabilities"
      className="marquee-pause relative w-full overflow-hidden py-4"
    >
      {/* Edge fades */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent"
      />

      <div
        className="animate-marquee-x flex w-max gap-4"
        style={{ ["--marquee-duration" as string]: "55s" }}
      >
        {loop.map((item, i) => (
          <Card key={`${item.title}-${i}`} item={item} />
        ))}
      </div>

      <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        Hover to pause · auto-scrolls
      </p>
    </section>
  )
}
