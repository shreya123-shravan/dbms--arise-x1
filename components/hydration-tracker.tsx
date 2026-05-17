"use client"

import { useState } from "react"
import { Droplets } from "lucide-react"
import { cn } from "@/lib/utils"

interface HydrationTrackerProps {
  initial: number
  target: number
}

export function HydrationTracker({ initial, target }: HydrationTrackerProps) {
  const [glasses, setGlasses] = useState(initial)

  return (
    <section
      aria-label="Hydration tracker"
      className="flex flex-col gap-4 rounded-xl border border-border/60 glass p-5"
    >
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Droplets className="size-4 text-accent" aria-hidden="true" />
          <h3 className="text-sm font-semibold">Hydration</h3>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {glasses} / {target}
        </span>
      </header>

      <div
        role="group"
        aria-label="Glasses of water"
        className="grid grid-cols-8 gap-1.5"
      >
        {Array.from({ length: target }).map((_, i) => {
          const filled = i < glasses
          return (
            <button
              key={i}
              type="button"
              onClick={() => setGlasses(i + 1 === glasses ? i : i + 1)}
              aria-label={`Glass ${i + 1}${filled ? ", filled" : ", empty"}`}
              aria-pressed={filled}
              className={cn(
                "h-10 rounded-md ring-1 transition-colors",
                filled
                  ? "bg-accent/30 ring-accent/50 hover:bg-accent/40"
                  : "bg-secondary ring-border hover:bg-secondary/80",
              )}
            />
          )
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Tap a glass to log it. Resets at midnight local time.
      </p>
    </section>
  )
}
