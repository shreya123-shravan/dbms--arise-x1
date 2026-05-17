"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/quests", label: "Quests" },
  { href: "/explore", label: "Explore" },
  { href: "/recommend", label: "Recommend" },
  { href: "/plans", label: "Plans" },
  { href: "/leaderboard", label: "Leaderboard" },
]

export function SiteNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 glass-strong">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30 glow-primary">
            <Zap className="size-4" aria-hidden="true" />
          </span>
          <span className="font-mono text-xs font-bold tracking-[0.2em] text-primary">
            ARISE-X1
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <Button asChild size="sm" className="font-semibold">
          <Link href="/dashboard">Sign In</Link>
        </Button>
      </div>
    </header>
  )
}
