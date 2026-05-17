import { AlertTriangle, CheckCircle2, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BehaviorInsight } from "@/lib/types"

const ICONS = {
  warn: AlertTriangle,
  good: CheckCircle2,
  info: Info,
}

const TONE = {
  warn: "border-accent/40 bg-accent/10 text-accent",
  good: "border-primary/40 bg-primary/10 text-primary",
  info: "border-border bg-secondary text-foreground",
}

export function BehaviorInsightCard({ insight }: { insight: BehaviorInsight }) {
  const Icon = ICONS[insight.severity]

  return (
    <article
      className={cn(
        "flex items-start gap-3 rounded-xl border bg-card p-4",
        "border-border/60",
      )}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-md ring-1",
          TONE[insight.severity],
        )}
        aria-hidden="true"
      >
        <Icon className="size-4" />
      </span>
      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-semibold text-foreground">{insight.title}</h4>
        <p className="text-[13px] leading-relaxed text-muted-foreground">{insight.body}</p>
      </div>
    </article>
  )
}
