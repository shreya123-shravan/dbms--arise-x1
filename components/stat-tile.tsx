import type { LucideIcon } from "lucide-react"

interface StatTileProps {
  Icon: LucideIcon
  label: string
  value: string | number
  hint?: string
  tone?: "primary" | "accent" | "neutral"
}

export function StatTile({ Icon, label, value, hint, tone = "neutral" }: StatTileProps) {
  const toneClasses =
    tone === "primary"
      ? "bg-primary/15 text-primary ring-primary/30"
      : tone === "accent"
        ? "bg-accent/15 text-accent ring-accent/40"
        : "bg-secondary text-foreground ring-border"

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4">
      <span
        className={`flex size-10 items-center justify-center rounded-lg ring-1 ${toneClasses}`}
        aria-hidden="true"
      >
        <Icon className="size-5" />
      </span>
      <div className="flex flex-col">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
        <span className="text-xl font-extrabold text-foreground">{value}</span>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
    </div>
  )
}
