"use client"

import { Battery, BatteryLow, Smile, Sun, Wind } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Mood } from "@/lib/types"

const MOODS: { value: Mood; label: string; Icon: LucideIcon }[] = [
  { value: "energized", label: "Energized", Icon: Sun },
  { value: "happy", label: "Happy", Icon: Smile },
  { value: "neutral", label: "Neutral", Icon: Wind },
  { value: "stressed", label: "Stressed", Icon: BatteryLow },
  { value: "tired", label: "Tired", Icon: Battery },
]

interface MoodSelectorProps {
  value: Mood
  onChange: (mood: Mood) => void
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div role="radiogroup" aria-label="Current mood" className="grid grid-cols-5 gap-2">
      {MOODS.map(({ value: m, label, Icon }) => {
        const active = value === m
        return (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(m)}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 rounded-lg border bg-card p-3 transition-colors",
              active
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
            <span className="text-[11px] font-medium">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
