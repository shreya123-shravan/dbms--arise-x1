"use client"

import { useEffect } from "react"
import { ArrowUp, Coins, Sparkles, Trophy, X } from "lucide-react"
import { useUserStats } from "@/lib/user-stats-context"
import { cn } from "@/lib/utils"

/**
 * Floating reward + rank-change toast that listens to context.lastReward.
 * Auto-dismisses after 4.5s. Rank-up gets a primary glow; same/down rank
 * shows a neutral chip.
 */
export function RewardToast() {
  const { lastReward, clearReward } = useUserStats()

  useEffect(() => {
    if (!lastReward) return
    const t = setTimeout(() => clearReward(), 4500)
    return () => clearTimeout(t)
  }, [lastReward, clearReward])

  if (!lastReward) return null

  const rankUp = lastReward.rankDelta > 0

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-20 z-[80] flex justify-center px-4 md:top-24"
    >
      <div
        className={cn(
          "pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl",
          "border-primary/40 bg-card/85",
          rankUp && "glow-primary",
        )}
        key={lastReward.id}
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl ring-1",
            rankUp
              ? "bg-primary/20 text-primary ring-primary/40"
              : "bg-secondary text-foreground ring-border",
          )}
        >
          {rankUp ? (
            <Trophy className="size-5" />
          ) : (
            <Sparkles className="size-5 text-primary" />
          )}
        </span>

        <div className="flex flex-1 flex-col leading-tight">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {lastReward.label}
          </span>
          <span className="text-sm font-semibold">
            +{lastReward.xp} XP
            {lastReward.coins > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                <Coins className="size-3" aria-hidden="true" />+{lastReward.coins}
              </span>
            )}
          </span>
        </div>

        <div
          className={cn(
            "flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[11px] font-bold",
            rankUp
              ? "bg-primary/15 text-primary ring-1 ring-primary/30"
              : "bg-secondary text-muted-foreground ring-1 ring-border",
          )}
        >
          {rankUp && <ArrowUp className="size-3" aria-hidden="true" />}
          Rank #{lastReward.rankAfter}
        </div>

        <button
          type="button"
          onClick={clearReward}
          aria-label="Dismiss"
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
