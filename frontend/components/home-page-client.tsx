"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import type { User } from "@supabase/supabase-js"
import { 
  ArrowRight, 
  Clock, 
  MapPin, 
  Search, 
  Star, 
  Sparkles,
  UtensilsCrossed,
  Bike,
  ShoppingBag,
  LogIn,
  IndianRupee,
  Zap,
  Gift,
  Percent,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BottomNav } from "@/components/bottom-nav"
import type { Restaurant } from "@/lib/types"
import { cn } from "@/lib/utils"

const CUISINES = [
  { name: "All", icon: UtensilsCrossed },
  { name: "Japanese", icon: "🍣" },
  { name: "Italian", icon: "🍕" },
  { name: "Indian", icon: "🍛" },
  { name: "Chinese", icon: "🥡" },
  { name: "Mexican", icon: "🌮" },
  { name: "Healthy", icon: "🥗" },
  { name: "Korean", icon: "🍜" },
]

const PROMO_BANNERS = [
  {
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
    title: "50% OFF",
    subtitle: "on your first order",
    code: "WELCOME50",
    color: "from-orange-600 to-red-600"
  },
  {
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    title: "Free Delivery",
    subtitle: "on orders above Rs.299",
    code: "FREEDEL",
    color: "from-green-600 to-emerald-600"
  },
  {
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800",
    title: "Flat Rs.100 OFF",
    subtitle: "on party orders",
    code: "PARTY20",
    color: "from-purple-600 to-pink-600"
  },
]

interface HomePageClientProps {
  featuredRestaurants: Restaurant[]
  allRestaurants: Restaurant[]
  user: User | null
}

export function HomePageClient({ featuredRestaurants, allRestaurants, user }: HomePageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState("All")

  const filteredRestaurants = allRestaurants.filter((restaurant) => {
    const matchesSearch = 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine_type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCuisine = 
      selectedCuisine === "All" || 
      restaurant.cuisine_type.toLowerCase() === selectedCuisine.toLowerCase()
    return matchesSearch && matchesCuisine
  })

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/40 glass-strong">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30">
              <UtensilsCrossed className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold">ARISE Eats</span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <MapPin className="size-3" />
                Deliver to current location
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="size-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="gap-2">
                  <LogIn className="size-4" />
                  Sign In
                </Button>
              </Link>
            )}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="size-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 bg-aurora" />
        <div className="relative mx-auto max-w-6xl px-4 py-8 md:py-12">
          <div className="flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-2"
            >
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                <Sparkles className="size-3" aria-hidden="true" />
                AI-Powered Food Delivery
              </span>
              <h1 className="text-balance text-3xl font-extrabold leading-tight md:text-5xl">
                Delicious food,{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">delivered fast</span>
              </h1>
              <p className="max-w-lg text-sm text-muted-foreground md:text-base">
                Get personalized meal recommendations from ARIA, our AI food concierge. 
                Order from the best restaurants in your area.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative max-w-xl"
            >
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search restaurants or cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 rounded-full border-border/60 bg-card/80 pl-12 pr-4 text-sm backdrop-blur focus:border-primary/50"
              />
            </motion.div>

            {/* Cuisine Filter */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
            >
              {CUISINES.map((cuisine) => (
                <button
                  key={cuisine.name}
                  onClick={() => setSelectedCuisine(cuisine.name)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                    selectedCuisine === cuisine.name
                      ? "border-purple-500 bg-purple-500/15 text-purple-400"
                      : "border-border/60 bg-card/60 text-muted-foreground hover:border-purple-500/40 hover:text-foreground"
                  )}
                >
                  {typeof cuisine.icon === "string" ? (
                    <span>{cuisine.icon}</span>
                  ) : (
                    <cuisine.icon className="size-4" />
                  )}
                  {cuisine.name}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Promo Banners */}
      {selectedCuisine === "All" && !searchQuery && (
        <section className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {PROMO_BANNERS.map((banner, index) => (
              <motion.div
                key={banner.code}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={cn(
                  "relative min-w-[280px] flex-1 overflow-hidden rounded-2xl p-4",
                  "bg-gradient-to-br",
                  banner.color
                )}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-white/80 text-xs">
                    <Gift className="size-3" />
                    <span>Use code: {banner.code}</span>
                  </div>
                  <h3 className="mt-1 text-2xl font-bold text-white">{banner.title}</h3>
                  <p className="text-white/80 text-sm">{banner.subtitle}</p>
                </div>
                <div className="absolute -right-8 -bottom-8 size-32 rounded-full bg-white/10" />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Stats */}
      {selectedCuisine === "All" && !searchQuery && (
        <section className="mx-auto max-w-6xl px-4 py-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Zap, value: "30 min", label: "Avg. Delivery" },
              { icon: Star, value: "4.8", label: "Rating" },
              { icon: Percent, value: "50%", label: "Max Discount" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex flex-col items-center gap-1 rounded-xl border border-border/60 bg-card/60 p-3"
              >
                <stat.icon className="size-5 text-purple-400" />
                <span className="text-lg font-bold">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Restaurants */}
      {featuredRestaurants.length > 0 && selectedCuisine === "All" && !searchQuery && (
        <section className="mx-auto max-w-6xl px-4 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold md:text-xl">
              <Sparkles className="size-5 text-purple-400" />
              Featured Restaurants
            </h2>
            <Link href="/explore" className="flex items-center gap-1 text-sm text-purple-400 hover:underline">
              View all <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <RestaurantCard restaurant={restaurant} featured />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* All Restaurants */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold md:text-xl">
            {searchQuery || selectedCuisine !== "All" 
              ? `${filteredRestaurants.length} Results` 
              : "All Restaurants"}
          </h2>
        </div>
        {filteredRestaurants.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <RestaurantCard restaurant={restaurant} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/40 py-16">
            <UtensilsCrossed className="size-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">No restaurants found</p>
            <p className="text-sm text-muted-foreground">Try a different search or cuisine</p>
          </div>
        )}
      </section>

      {/* AI Concierge Banner */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/20 via-card to-pink-500/10 p-6 md:p-8"
        >
          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-400">
                <Sparkles className="size-3" />
                AI Food Concierge
              </span>
              <h3 className="text-xl font-bold md:text-2xl">Not sure what to order?</h3>
              <p className="text-sm text-muted-foreground">Let ARIA recommend dishes based on your mood and preferences</p>
            </div>
            <Button asChild size="lg" className="w-fit bg-gradient-to-r from-purple-600 to-pink-600 font-bold shadow-lg shadow-purple-500/25">
              <Link href="/concierge">
                Ask ARIA
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
          <div className="absolute -right-10 -bottom-10 size-40 rounded-full bg-purple-500/20 blur-3xl" aria-hidden="true" />
        </motion.div>
      </section>

      <BottomNav />
    </div>
  )
}

function RestaurantCard({ restaurant, featured = false }: { restaurant: Restaurant; featured?: boolean }) {
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <article
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10",
          featured && "ring-1 ring-purple-500/20"
        )}
      >
        {/* Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          {restaurant.image_url ? (
            <Image
              src={restaurant.image_url}
              alt={restaurant.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <UtensilsCrossed className="size-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          
          {/* Rating Badge */}
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-xs font-bold backdrop-blur">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {restaurant.rating.toFixed(1)}
          </div>

          {featured && (
            <div className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-1 text-[10px] font-bold text-white">
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold leading-tight group-hover:text-purple-400 transition-colors">{restaurant.name}</h3>
            <span className="shrink-0 rounded-md border border-purple-500/40 bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-400">
              {restaurant.cuisine_type}
            </span>
          </div>
          
          {restaurant.description && (
            <p className="line-clamp-2 text-xs text-muted-foreground">{restaurant.description}</p>
          )}

          <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {restaurant.delivery_time_min}-{restaurant.delivery_time_max} min
            </span>
            <span className="flex items-center gap-0.5">
              <Bike className="size-3" />
              <IndianRupee className="size-2.5" />
              {restaurant.delivery_fee.toFixed(0)}
            </span>
            <span className="flex items-center gap-0.5 text-muted-foreground/60">
              Min <IndianRupee className="size-2.5" />
              {restaurant.min_order.toFixed(0)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
