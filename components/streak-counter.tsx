import { Flame } from "lucide-react"

interface StreakCounterProps {
  streak: number
}

export function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 glass p-4">
      <span
        className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30"
        aria-hidden="true"
      >
        <Flame className="size-5" />
      </span>
      <div className="flex flex-col">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Streak
        </span>
        <span className="text-xl font-extrabold text-foreground">
          {streak}
          <span className="ml-1 text-sm font-medium text-muted-foreground">days</span>
        </span>
      </div>
    </div>
  )
}
