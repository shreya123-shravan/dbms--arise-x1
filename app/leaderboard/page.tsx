"use client"

import { ArrowUp, Flame, Lock, Medal, Trophy, Users } from "lucide-react"
import * as Icons from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { SiteNav } from "@/components/site-nav"
import { BottomNav } from "@/components/bottom-nav"
import { badges, challenges } from "@/lib/mock-data"
import { useUserStats } from "@/lib/user-stats-context"
import { cn } from "@/lib/utils"

const RANK_COLORS = ["text-primary", "text-accent", "text-foreground"]

function ChallengeCard({
  title,
  description,
  type,
  progress,
  target,
  xpReward,
  isGroup,
  participants,
}: {
  title: string
  description: string
  type: "daily" | "weekly"
  progress: number
  target: number
  xpReward: number
  isGroup: boolean
  participants?: number
}) {
  const percent = Math.min(100, Math.round((progress / target) * 100))
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border/60 glass p-5">
      <header className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {type} {isGroup ? "· community" : ""}
          </span>
          <h3 className="text-base font-bold leading-tight">{title}</h3>
        </div>
        <span className="rounded-md bg-primary/15 px-2 py-1 text-[11px] font-bold text-primary ring-1 ring-primary/30">
          +{xpReward} XP
        </span>
      </header>
      <p className="text-[13px] leading-relaxed text-muted-foreground">{description}</p>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
          <span>
            {progress.toLocaleString()} / {target.toLocaleString()}
          </span>
          <span>{percent}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-1.5 w-full overflow-hidden rounded-full bg-secondary"
        >
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-500",
              isGroup ? "bg-accent" : "bg-primary",
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      {isGroup && participants !== undefined && (
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
          <Users className="size-3" aria-hidden="true" />
          {participants.toLocaleString()} participants
        </div>
      )}
    </article>
  )
}

export default function LeaderboardPage() {
  const stats = useUserStats()
  const board = stats.leaderboard
  const youRank = stats.rank.rank
  const rankUp = stats.rank.delta > 0
  const ahead = stats.rank.ahead
  const xpToNextRank = ahead ? Math.max(1, ahead.xp - stats.xp + 1) : 0

  return (
    <div className="relative min-h-screen bg-background pb-32 md:pb-12">
      <SiteNav />

      {/* Soft aurora wash for theme cohesion */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-aurora opacity-50"
      />

      <main className="relative mx-auto flex max-w-5xl flex-col gap-10 px-4 py-8 md:px-6 md:py-12">
        {/* Hero rank banner */}
        <header className="flex flex-col gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Gamification hub
          </span>
          <h1 className="text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
            Health is a <span className="text-primary">game you can win.</span>
          </h1>

          <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-primary/30 glass-strong p-5">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/20 text-primary ring-1 ring-primary/40 glow-primary">
              <Trophy className="size-7" aria-hidden="true" />
            </span>
            <div className="flex flex-1 flex-col leading-tight">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                Your live rank
              </span>
              <span className="flex items-baseline gap-2 text-3xl font-extrabold md:text-4xl">
                #{youRank}
                <span className="font-mono text-sm font-medium text-muted-foreground">
                  of {stats.rank.total}
                </span>
                {rankUp && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 font-mono text-xs font-bold text-primary ring-1 ring-primary/30">
                    <ArrowUp className="size-3" aria-hidden="true" />
                    {stats.rank.delta} this session
                  </span>
                )}
              </span>
              <span className="text-sm text-muted-foreground">
                {ahead
                  ? `${xpToNextRank.toLocaleString()} XP to overtake ${ahead.displayName}.`
                  : "You're at the top — defend your spot today."}
              </span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Total XP
              </span>
              <span className="text-2xl font-extrabold text-primary">
                {stats.xp.toLocaleString()}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Level {stats.level} · {stats.streak}d streak
              </span>
            </div>
          </div>
        </header>

        {/* Challenges */}
        <section aria-label="Active challenges" className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Active challenges
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {challenges.map((c) => (
              <ChallengeCard
                key={c.id}
                title={c.title}
                description={c.description}
                type={c.type}
                progress={c.progress}
                target={c.target}
                xpReward={c.xpReward}
                isGroup={c.isGroupChallenge}
                participants={c.participants}
              />
            ))}
          </div>
        </section>

        {/* Leaderboard */}
        <section aria-label="Top players" className="flex flex-col gap-4">
          <header className="flex items-end justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Weekly leaderboard
            </h2>
            <span className="font-mono text-[11px] text-muted-foreground">
              You&apos;re ranked #{youRank}
            </span>
          </header>

          <ol className="flex flex-col gap-2">
            {board.map((entry) => {
              const isPodium = entry.rank <= 3
              return (
                <li
                  key={entry.userId}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border px-4 py-3 transition-colors",
                    entry.isYou
                      ? "border-primary/50 glass-strong glow-primary"
                      : "border-border/60 glass",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-md font-mono text-sm font-bold ring-1",
                      isPodium
                        ? "bg-secondary ring-border"
                        : "bg-secondary text-muted-foreground ring-border",
                    )}
                  >
                    {isPodium ? (
                      <Medal
                        className={cn("size-4", RANK_COLORS[entry.rank - 1])}
                        aria-hidden="true"
                      />
                    ) : (
                      <span>{entry.rank}</span>
                    )}
                  </span>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{entry.displayName}</span>
                      {entry.isYou && (
                        <span className="rounded-sm bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                          You
                        </span>
                      )}
                      {entry.isYou && rankUp && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/20 px-1.5 py-0.5 font-mono text-[10px] text-primary">
                          <ArrowUp className="size-3" aria-hidden="true" />
                          {stats.rank.delta}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Level {entry.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="hidden items-center gap-1 font-mono text-xs text-muted-foreground sm:inline-flex">
                      <Flame className="size-3 text-accent" aria-hidden="true" />
                      {entry.streak}d
                    </span>
                    <span className="font-mono text-sm font-bold text-primary">
                      {entry.xp.toLocaleString()} XP
                    </span>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        {/* Badges */}
        <section aria-label="Badges" className="flex flex-col gap-4">
          <header className="flex items-end justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Badges
            </h2>
            <span className="font-mono text-[11px] text-muted-foreground">
              {badges.filter((b) => b.unlocked).length} / {badges.length} unlocked
            </span>
          </header>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {badges.map((b) => {
              const IconComponent =
                ((Icons as unknown) as Record<string, LucideIcon>)[b.icon] ?? Trophy
              return (
                <article
                  key={b.id}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border glass p-4 text-center",
                    b.unlocked ? "border-primary/30" : "border-border/60",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full ring-1",
                      b.unlocked
                        ? "bg-primary/15 text-primary ring-primary/30"
                        : "bg-secondary text-muted-foreground ring-border",
                    )}
                    aria-hidden="true"
                  >
                    {b.unlocked ? (
                      <IconComponent className="size-5" />
                    ) : (
                      <Lock className="size-5" />
                    )}
                  </span>
                  <h3
                    className={cn(
                      "text-xs font-semibold leading-tight",
                      b.unlocked ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {b.name}
                  </h3>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    {b.description}
                  </p>
                </article>
              )
            })}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
