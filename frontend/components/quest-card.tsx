"use client"

import { Coins, Salad, Footprints, Droplets, Brain, Sparkles, Check } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Quest, QuestCategory, QuestDifficulty } from "@/lib/types"

const CATEGORY_META: Record<QuestCategory, { Icon: LucideIcon; label: string }> = {
  nutrition: { Icon: Salad, label: "Nutrition" },
  movement: { Icon: Footprints, label: "Movement" },
  hydration: { Icon: Droplets, label: "Hydration" },
  mindfulness: { Icon: Brain, label: "Mindfulness" },
}

const DIFFICULTY_META: Record<QuestDifficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
}

interface QuestCardProps {
  quest: Quest
  onAction: (id: string) => void
}

export function QuestCard({ quest, onAction }: QuestCardProps) {
  const meta = CATEGORY_META[quest.category]
  const pct = Math.min(100, Math.round((quest.progress / quest.target) * 100))
  const ready = quest.status === "ready"
  const claimed = quest.status === "claimed"

  return (
    <article
      className={cn(
        "relative flex flex-col gap-4 overflow-hidden rounded-2xl border p-5 transition-all",
        claimed
          ? "border-border/40 bg-card/40 opacity-70"
          : ready
            ? "border-primary/40 glass glow-primary"
            : "border-border/60 glass hover:border-primary/30",
      )}
    >
      {/* Decorative shimmer for ready quests */}
      {ready && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-primary/20 blur-3xl"
        />
      )}

      <header className="relative flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl ring-1",
              quest.category === "nutrition" && "bg-primary/15 text-primary ring-primary/30",
              quest.category === "movement" && "bg-accent/15 text-accent ring-accent/40",
              quest.category === "hydration" && "bg-chart-3/15 text-chart-3 ring-chart-3/40",
              quest.category === "mindfulness" && "bg-secondary text-foreground ring-border",
            )}
            aria-hidden="true"
          >
            <meta.Icon className="size-5" />
          </span>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {meta.label} · {DIFFICULTY_META[quest.difficulty]}
              </span>
            </div>
            <h3 className="text-pretty text-base font-bold leading-tight">{quest.title}</h3>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary ring-1 ring-primary/30">
            <Sparkles className="size-3" aria-hidden="true" />+{quest.xpReward} XP
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
            <Coins className="size-3" aria-hidden="true" />
            {quest.coinReward}
          </span>
        </div>
      </header>

      <p className="text-sm leading-relaxed text-muted-foreground">{quest.description}</p>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          <span>Progress</span>
          <span>
            {quest.progress.toLocaleString()} / {quest.target.toLocaleString()}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              ready ? "bg-primary glow-primary" : claimed ? "bg-muted-foreground/40" : "bg-primary",
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <Button
        onClick={() => onAction(quest.id)}
        disabled={claimed}
        variant={ready ? "default" : "outline"}
        className="font-semibold"
      >
        {claimed ? (
          <>
            <Check className="size-4" aria-hidden="true" />
            Claimed
          </>
        ) : (
          quest.actionLabel
        )}
      </Button>
    </article>
  )
}
