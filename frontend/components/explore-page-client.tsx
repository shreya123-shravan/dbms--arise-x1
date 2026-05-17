"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Clock,
  Filter,
  Search,
  Star,
  Bike,
  UtensilsCrossed,
  SlidersHorizontal,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BottomNav } from "@/components/bottom-nav"
import type { Restaurant } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ExplorePageClientProps {
  restaurants: Restaurant[]
  cuisines: string[]
}

type SortOption = "rating" | "delivery_time" | "delivery_fee"

export function ExplorePageClient({ restaurants, cuisines }: ExplorePageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("rating")
  const [showFilters, setShowFilters] = useState(false)

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    )
  }

  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (restaurant.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      const matchesCuisine =
        selectedCuisines.length === 0 ||
        selectedCuisines.includes(restaurant.cuisine_type)
      return matchesSearch && matchesCuisine
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "delivery_time":
          return a.delivery_time_min - b.delivery_time_min
        case "delivery_fee":
          return a.delivery_fee - b.delivery_fee
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/40 glass-strong">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary/80 transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-full border-border/60 bg-secondary/50 pl-10 pr-4 text-sm"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "shrink-0 rounded-full",
              showFilters && "border-primary bg-primary/10 text-primary"
            )}
          >
            <SlidersHorizontal className="size-4" />
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="border-t border-border/40 px-4 py-4">
            <div className="mx-auto max-w-6xl space-y-4">
              {/* Sort Options */}
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Sort by
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "rating" as SortOption, label: "Top Rated" },
                    { value: "delivery_time" as SortOption, label: "Fastest Delivery" },
                    { value: "delivery_fee" as SortOption, label: "Lowest Fee" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                        sortBy === option.value
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border/60 bg-card/60 text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cuisine Filter */}
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Cuisines
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cuisines.map((cuisine) => (
                    <button
                      key={cuisine}
                      onClick={() => toggleCuisine(cuisine)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                        selectedCuisines.includes(cuisine)
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border/60 bg-card/60 text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Filters */}
              {selectedCuisines.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Active filters:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCuisines([])}
                    className="h-6 gap-1 px-2 text-xs text-destructive hover:text-destructive"
                  >
                    <X className="size-3" />
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Results */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-bold">
            {filteredRestaurants.length} Restaurant{filteredRestaurants.length !== 1 && "s"}
          </h1>
        </div>

        {filteredRestaurants.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/40 py-16">
            <UtensilsCrossed className="size-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">No restaurants found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            {selectedCuisines.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCuisines([])}
                className="mt-4"
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
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
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />

          {/* Rating Badge */}
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-xs font-bold backdrop-blur">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {restaurant.rating.toFixed(1)}
          </div>

          {restaurant.is_featured && (
            <div className="absolute left-3 top-3 rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground">
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold leading-tight group-hover:text-primary">
              {restaurant.name}
            </h3>
            <span className="shrink-0 rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              {restaurant.cuisine_type}
            </span>
          </div>

          {restaurant.description && (
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {restaurant.description}
            </p>
          )}

          <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {restaurant.delivery_time_min}-{restaurant.delivery_time_max} min
            </span>
            <span className="flex items-center gap-1">
              <Bike className="size-3" />
              ${restaurant.delivery_fee.toFixed(2)}
            </span>
            <span className="text-muted-foreground/60">
              Min ${restaurant.min_order.toFixed(0)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
