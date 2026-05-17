import { xpProgressInLevel } from "@/lib/xp"

interface XPBarProps {
  totalXP: number
  level: number
}

export function XPBar({ totalXP, level }: XPBarProps) {
  const { percent, current, needed } = xpProgressInLevel(totalXP)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Level
          </span>
          <span className="text-2xl font-extrabold text-foreground">{level}</span>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {current} / {needed} XP
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Level ${level} progress`}
        className="h-2 w-full overflow-hidden rounded-full bg-secondary"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {needed - current} XP to level <span className="text-foreground">{level + 1}</span>
      </p>
    </div>
  )
}
