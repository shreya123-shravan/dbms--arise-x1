"use client"

import { useMemo } from "react"
import {
  Apple,
  Coffee,
  Droplets,
  Footprints,
  ShoppingBasket,
  Sun,
  Check,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SpotKind, WalkSpot } from "@/lib/types"

const KIND_META: Record<SpotKind, { Icon: LucideIcon; tone: "primary" | "accent" | "chart3" }> = {
  produce: { Icon: Apple, tone: "primary" },
  hydration: { Icon: Droplets, tone: "chart3" },
  jog: { Icon: Footprints, tone: "accent" },
  cafe: { Icon: Coffee, tone: "primary" },
  yoga: { Icon: Sun, tone: "accent" },
  market: { Icon: ShoppingBasket, tone: "primary" },
}

interface ExploreMapProps {
  spots: WalkSpot[]
  /** Currently targeted spot id (user dot animates toward it). */
  activeSpotId: string | null
  /** Position of the user dot in 0–100 percent space. */
  userPos: { x: number; y: number }
  onSelectSpot: (id: string) => void
}

export function ExploreMap({ spots, activeSpotId, userPos, onSelectSpot }: ExploreMapProps) {
  // Decorative connector path from user → active spot
  const activeSpot = useMemo(
    () => spots.find((s) => s.id === activeSpotId) ?? null,
    [spots, activeSpotId],
  )

  return (
    <div
      className="relative aspect-[5/3] w-full overflow-hidden rounded-2xl border border-border/60 glass"
      role="application"
      aria-label="Live walking explore map"
    >
      {/* Layered background: aurora wash + grid */}
      <div aria-hidden="true" className="absolute inset-0 bg-aurora opacity-70" />
      <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-60" />

      {/* Decorative paths (winding "streets") */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
      >
        <defs>
          <linearGradient id="path-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.85 0.18 165)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="oklch(0.62 0.18 285)" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <path
          d="M 0 12 Q 30 4 50 18 T 100 22"
          stroke="url(#path-grad)"
          strokeWidth="0.6"
          fill="none"
          strokeDasharray="0.8 1.2"
        />
        <path
          d="M 0 38 Q 20 50 45 42 T 100 48"
          stroke="url(#path-grad)"
          strokeWidth="0.6"
          fill="none"
          strokeDasharray="0.8 1.2"
        />
        <path
          d="M 30 0 Q 38 20 32 30 T 40 60"
          stroke="url(#path-grad)"
          strokeWidth="0.6"
          fill="none"
          strokeDasharray="0.8 1.2"
        />

        {/* Active route from user → spot */}
        {activeSpot && (
          <line
            x1={userPos.x}
            y1={userPos.y * 0.6}
            x2={activeSpot.x}
            y2={activeSpot.y * 0.6}
            stroke="oklch(0.85 0.18 165)"
            strokeOpacity="0.7"
            strokeWidth="0.5"
            strokeDasharray="1 1"
          />
        )}
      </svg>

      {/* Spots */}
      {spots.map((spot) => {
        const meta = KIND_META[spot.kind]
        const isActive = spot.id === activeSpotId
        return (
          <button
            key={spot.id}
            type="button"
            onClick={() => onSelectSpot(spot.id)}
            aria-label={`${spot.name} — ${spot.distanceM} meters away`}
            className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
          >
            {/* Pulse ring for active or unclaimed */}
            {!spot.claimed && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-10 rounded-full",
                  meta.tone === "primary" && "bg-primary/30",
                  meta.tone === "accent" && "bg-accent/30",
                  meta.tone === "chart3" && "bg-chart-3/30",
                  "animate-pulse-ring",
                )}
              />
            )}
            <span
              className={cn(
                "relative flex size-10 items-center justify-center rounded-full ring-2 transition-transform group-hover:scale-110 group-focus-visible:scale-110",
                spot.claimed
                  ? "bg-secondary text-muted-foreground ring-border"
                  : meta.tone === "primary"
                    ? "bg-primary/20 text-primary ring-primary/50 glow-primary"
                    : meta.tone === "accent"
                      ? "bg-accent/20 text-accent ring-accent/50 glow-accent"
                      : "bg-chart-3/20 text-chart-3 ring-chart-3/50",
                isActive && "ring-4",
              )}
            >
              {spot.claimed ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                <meta.Icon className="size-4" aria-hidden="true" />
              )}
            </span>
          </button>
        )
      })}

      {/* User position dot */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
        style={{ left: `${userPos.x}%`, top: `${userPos.y}%` }}
        aria-label="You are here"
      >
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-8 animate-pulse-ring rounded-full bg-foreground/30"
        />
        <span className="relative flex size-4 items-center justify-center rounded-full bg-foreground ring-4 ring-background">
          <span className="size-1.5 rounded-full bg-primary" />
        </span>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full glass-strong px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Live walking
        </span>
        <span className="rounded-full glass-strong px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
          {spots.filter((s) => !s.claimed).length} pickups nearby
        </span>
      </div>
    </div>
  )
}
