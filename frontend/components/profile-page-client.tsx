"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import {
  ArrowLeft,
  ChevronRight,
  CreditCard,
  Heart,
  HelpCircle,
  LogOut,
  MapPin,
  Package,
  Settings,
  Sparkles,
  UtensilsCrossed,
  User as UserIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"
import { createClient } from "@/lib/supabase/client"
import type { Profile, Order } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ProfilePageClientProps {
  user: User
  profile: Profile | null
  recentOrders: Order[]
  stats: {
    totalOrders: number
    totalSpent: number
  }
}

export function ProfilePageClient({
  user,
  profile,
  recentOrders,
  stats,
}: ProfilePageClientProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const displayName = profile?.full_name || user.email?.split("@")[0] || "User"
  const avatarUrl = profile?.avatar_url

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/40 glass-strong">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex size-10 items-center justify-center rounded-full bg-secondary/80 transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-lg font-bold">Profile</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card/60 p-4">
          <div className="relative size-16 overflow-hidden rounded-full bg-primary/20">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={displayName} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <UserIcon className="size-8 text-primary" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold">{displayName}</span>
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-border/60 bg-card/60 p-4 text-center">
            <span className="text-2xl font-bold text-primary">{stats.totalOrders}</span>
            <p className="text-xs text-muted-foreground">Orders Placed</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/60 p-4 text-center">
            <span className="text-2xl font-bold text-primary">
              ${stats.totalSpent.toFixed(0)}
            </span>
            <p className="text-xs text-muted-foreground">Total Spent</p>
          </div>
        </div>

        {/* AI Concierge Promo */}
        <Link
          href="/concierge"
          className="mt-6 flex items-center gap-4 rounded-2xl border border-primary/40 bg-primary/10 p-4 transition-colors hover:bg-primary/15"
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/20">
            <Sparkles className="size-6 text-primary" />
          </div>
          <div className="flex flex-1 flex-col">
            <span className="font-semibold">AI Food Concierge</span>
            <span className="text-xs text-muted-foreground">
              Get personalized meal recommendations
            </span>
          </div>
          <ChevronRight className="size-5 text-primary" />
        </Link>

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <section className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">Recent Orders</h2>
              <Link
                href="/orders"
                className="text-xs font-medium text-primary hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {recentOrders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 p-3"
                >
                  <div className="relative size-10 overflow-hidden rounded-lg">
                    {order.restaurant?.image_url ? (
                      <Image
                        src={order.restaurant.image_url}
                        alt={order.restaurant?.name ?? ""}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <UtensilsCrossed className="size-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium">
                      {order.restaurant?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-sm font-bold">${order.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Menu Items */}
        <section className="mt-6">
          <h2 className="mb-3 font-semibold">Account</h2>
          <div className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60">
            <MenuItem href="/orders" icon={Package} label="My Orders" />
            <MenuItem href="/favorites" icon={Heart} label="Favorites" />
            <MenuItem href="/addresses" icon={MapPin} label="Saved Addresses" />
            <MenuItem href="/payment" icon={CreditCard} label="Payment Methods" />
            <MenuItem href="/settings" icon={Settings} label="Settings" />
            <MenuItem href="/help" icon={HelpCircle} label="Help & Support" />
          </div>
        </section>

        {/* Logout */}
        <Button
          variant="outline"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="mt-6 w-full border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="mr-2 size-4" />
          {isLoggingOut ? "Logging out..." : "Log Out"}
        </Button>
      </main>

      <BottomNav />
    </div>
  )
}

function MenuItem({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: typeof Package
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 border-b border-border/40 px-4 py-3 transition-colors last:border-b-0 hover:bg-secondary/30"
    >
      <Icon className="size-5 text-muted-foreground" />
      <span className="flex-1 text-sm">{label}</span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </Link>
  )
}
