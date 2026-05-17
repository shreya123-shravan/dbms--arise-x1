"use client"

import { useMemo, useState } from "react"
import { ArrowUp, Coins, Sparkles, Target, Trophy } from "lucide-react"
import { SiteNav } from "@/components/site-nav"
import { BottomNav } from "@/components/bottom-nav"
import { QuestCard } from "@/components/quest-card"
import { quests as initialQuests, currentUser } from "@/lib/mock-data"
import { useUserStats } from "@/lib/user-stats-context"
import type { Quest } from "@/lib/types"

const FILTERS: { id: "all" | "active" | "ready" | "claimed"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "In progress" },
  { id: "ready", label: "Ready to claim" },
  { id: "claimed", label: "Claimed" },
]

export default function QuestsPage() {
  const stats = useUserStats()
  const [quests, setQuests] = useState<Quest[]>(initialQuests)
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all")

  // Reflect any cross-page completions (e.g. claimed via dashboard previews).
  const visibleQuests = useMemo(
    () =>
      quests.map((q) =>
        stats.completedQuestIds.has(q.id) ? { ...q, status: "claimed" as const } : q,
      ),
    [quests, stats.completedQuestIds],
  )

  const filtered = useMemo(() => {
    if (filter === "all") return visibleQuests
    return visibleQuests.filter((q) => q.status === filter)
  }, [filter, visibleQuests])

  const totals = useMemo(() => {
    const ready = visibleQuests.filter((q) => q.status === "ready").length
    const totalXp = visibleQuests.reduce(
      (sum, q) => (q.status === "active" || q.status === "ready" ? sum + q.xpReward : sum),
      0,
    )
    return { ready, totalXp }
  }, [visibleQuests])

  function handleAction(id: string) {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q
        if (q.status === "ready") {
          // Awards XP + coins through context, which recomputes the
          // leaderboard rank and fires the global reward toast.
          stats.completeQuest(q.id, q.xpReward, q.coinReward, q.title)
          return { ...q, status: "claimed" as const }
        }
        // For "active" quests, simulate making progress.
        const next = Math.min(q.target, q.progress + Math.ceil(q.target / 4))
        const status = next >= q.target ? ("ready" as const) : ("active" as const)
        return { ...q, progress: next, status }
      }),
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-12">
      <SiteNav />

      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
        {/* Hero header */}
        <header className="relative overflow-hidden rounded-3xl border border-border/60 glass-strong p-6 md:p-8">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-24 size-72 rounded-full bg-primary/20 blur-3xl"
          />
          <div className="relative flex flex-col gap-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-2">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                  <Target className="size-3" aria-hidden="true" />
                  Daily quests
                </span>
                <h1 className="text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
                  Today&apos;s missions, {currentUser.displayName}.
                </h1>
                <p className="text-pretty max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  ARIA assigned these based on your last 14 days. Finish a quest, claim XP
                  &amp; coins. Every claim moves you up the leaderboard.
                </p>
              </div>

              {/* Live rank chip */}
              <div className="flex flex-col items-end gap-1 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                  Your rank
                </span>
                <span className="flex items-center gap-1.5 text-2xl font-extrabold text-primary">
                  #{stats.rank.rank}
                  {stats.rank.delta > 0 && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/20 px-1.5 py-0.5 font-mono text-[10px]">
                      <ArrowUp className="size-3" aria-hidden="true" />
                      {stats.rank.delta}
                    </span>
                  )}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  of {stats.rank.total}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat
                Icon={Sparkles}
                label="Ready to claim"
                value={`${totals.ready}`}
                tone="primary"
              />
              <Stat
                Icon={Target}
                label="XP available"
                value={`${totals.totalXp}`}
                tone="accent"
              />
              <Stat
                Icon={Trophy}
                label="Total XP"
                value={stats.xp.toLocaleString()}
                hint={`Level ${stats.level}`}
                tone="primary"
              />
              <Stat
                Icon={Coins}
                label="Earned today"
                value={`+${stats.earnedToday.xp} XP`}
                hint={`+${stats.earnedToday.coins} coins`}
                tone="accent"
              />
            </div>
          </div>
        </header>

        {/* Filters */}
        <div
          role="tablist"
          aria-label="Quest filters"
          className="flex flex-wrap items-center gap-2"
        >
          {FILTERS.map((f) => {
            const active = filter === f.id
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.id)}
                className={
                  active
                    ? "rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground"
                    : "rounded-full border border-border/60 glass px-4 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                }
              >
                {f.label}
              </button>
            )
          })}
        </div>

        {/* Quest grid */}
        <section aria-label="Active quests" className="grid gap-4 md:grid-cols-2">
          {filtered.length === 0 ? (
            <div className="md:col-span-2 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/60 px-6 py-16 text-center">
              <Target className="size-8 text-muted-foreground" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">
                Nothing here yet. Switch filter to see all quests.
              </p>
            </div>
          ) : (
            filtered.map((q) => <QuestCard key={q.id} quest={q} onAction={handleAction} />)
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  )
}

function Stat({
  Icon,
  label,
  value,
  hint,
  tone,
}: {
  Icon: typeof Sparkles
  label: string
  value: string
  hint?: string
  tone: "primary" | "accent"
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 glass p-3">
      <span
        className={
          tone === "primary"
            ? "flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30"
            : "flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent ring-1 ring-accent/40"
        }
        aria-hidden="true"
      >
        <Icon className="size-4" />
      </span>
      <div className="flex flex-col leading-tight">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
        <span className="text-base font-bold">{value}</span>
        {hint && <span className="font-mono text-[10px] text-muted-foreground">{hint}</span>}
      </div>
    </div>
  )
}
