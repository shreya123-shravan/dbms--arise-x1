import Image from "next/image"
import { Clock, Flame, Wheat, Drumstick, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Meal } from "@/lib/types"

interface MealCardProps {
  meal: Meal
  onAccept?: () => void
  accepted?: boolean
}

function MacroPill({
  Icon,
  label,
  value,
}: {
  Icon: typeof Clock
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col items-start gap-0.5 rounded-md border border-border/60 bg-secondary/60 px-2.5 py-2">
      <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        <Icon className="size-3" aria-hidden="true" />
        {label}
      </span>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  )
}

export function MealCard({ meal, onAccept, accepted }: MealCardProps) {
  return (
    <article className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border/60 glass">
      {meal.image && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={meal.image || "/placeholder.svg"}
            alt={`${meal.meal_name} — moody food photography`}
            fill
            sizes="(min-width: 1024px) 720px, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            priority={false}
          />
          {/* Tone overlay for legibility */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent"
          />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="rounded-full glass-strong px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
              ARIA · {meal.meal_type}
            </span>
          </div>
          <div className="absolute right-4 top-4 flex items-center gap-2">
            <span className="rounded-full glass-strong px-3 py-1 text-xs font-bold text-primary">
              +{meal.xp_reward} XP
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 px-5 pb-5">
        <header className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            {!meal.image && (
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                ARIA recommends · {meal.meal_type}
              </span>
            )}
            <h3 className="text-balance text-lg font-bold leading-tight md:text-xl">
              {meal.meal_name}
            </h3>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">
            Health {meal.health_score}/10
          </span>
        </header>

        <p className="text-sm leading-relaxed text-muted-foreground">{meal.reason}</p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <MacroPill Icon={Flame} label="Calories" value={`${meal.calories}`} />
          <MacroPill Icon={Drumstick} label="Protein" value={`${meal.protein_g}g`} />
          <MacroPill Icon={Wheat} label="Carbs" value={`${meal.carbs_g}g`} />
          <MacroPill Icon={Leaf} label="Fiber" value={`${meal.fiber_g}g`} />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <Clock className="size-3" aria-hidden="true" />
            {meal.preparation_time_min} min
          </span>
          {meal.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-secondary px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {onAccept && (
          <div className="flex items-center gap-2 pt-1">
            <Button onClick={onAccept} disabled={accepted} className="flex-1 font-semibold">
              {accepted ? "Logged · XP awarded" : "Accept meal"}
            </Button>
            <Button variant="outline" className="font-semibold">
              Swap
            </Button>
          </div>
        )}
      </div>
    </article>
  )
}
