"use client"

import { Suspense } from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Search, Filter, Clock, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import type { Restaurant } from "@/lib/types"

const CUISINES = ["Indian", "Chinese", "Pizza", "Burger", "Sushi", "Desserts", "Street Food", "Continental"]

function RestaurantsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"rating" | "newest">("rating")

  const loadRestaurants = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      if (!supabase) return

      let query = supabase.from("restaurants").select("*").eq("is_open", true)

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      if (sortBy === "rating") {
        query = query.order("rating", { ascending: false })
      } else {
        query = query.order("created_at", { ascending: false })
      }

      const { data } = await query
      // Deduplicate by name in case of duplicate DB entries
      const seen = new Set<string>()
      const unique = ((data as Restaurant[]) ?? []).filter((r) => {
        if (seen.has(r.name)) return false
        seen.add(r.name)
        return true
      })
      setRestaurants(unique)
    } catch (error) {
      console.error("Failed to load restaurants:", error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, sortBy])

  useEffect(() => {
    const id = setTimeout(loadRestaurants, 300)
    return () => clearTimeout(id)
  }, [loadRestaurants])

  const filtered = selectedCuisine
    ? restaurants.filter((r) =>
        r.cuisine_type?.toLowerCase().includes(selectedCuisine.toLowerCase()) ||
        r.description?.toLowerCase().includes(selectedCuisine.toLowerCase())
      )
    : restaurants

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border/30 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="mb-4 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back">
              <ArrowLeft className="size-4" />
            </Button>
            <h1 className="flex-1 text-2xl font-bold">Restaurants</h1>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Search restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                aria-label="Search restaurants"
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open filters">
                  <Filter className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="mb-3 font-semibold">Sort By</h3>
                    <div className="space-y-2">
                      {[
                        { value: "rating", label: "Highest Rated" },
                        { value: "newest", label: "Newly Added" },
                      ].map((option) => (
                        <label key={option.value} className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="sort"
                            value={option.value}
                            checked={sortBy === option.value}
                            onChange={(e) => setSortBy(e.target.value as "rating" | "newest")}
                            className="size-4"
                          />
                          <span className="text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 font-semibold">Cuisine</h3>
                    <div className="flex flex-wrap gap-2">
                      {CUISINES.map((cuisine) => (
                        <Badge
                          key={cuisine}
                          variant={selectedCuisine === cuisine ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSelectedCuisine(selectedCuisine === cuisine ? null : cuisine)}
                        >
                          {cuisine}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Active filters */}
      {(searchQuery || selectedCuisine) && (
        <div className="border-b border-border/30 bg-background/50">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary" onClick={() => setSearchQuery("")} className="cursor-pointer">
                Search: {searchQuery} ✕
              </Badge>
            )}
            {selectedCuisine && (
              <Badge variant="secondary" onClick={() => setSelectedCuisine(null)} className="cursor-pointer">
                {selectedCuisine} ✕
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-xl bg-secondary/50" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/restaurant/${restaurant.id}`}
                className="group overflow-hidden rounded-xl border border-border/40 bg-card transition-all hover:border-primary/40 hover:shadow-lg"
              >
                <div className="relative aspect-video bg-secondary/30">
                  {restaurant.image_url ? (
                    <Image
                      src={restaurant.image_url}
                      alt={restaurant.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-4xl" aria-hidden="true">🍽️</span>
                    </div>
                  )}
                  {!restaurant.is_open && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="font-semibold text-white">Closed</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-1 font-semibold">{restaurant.name}</h3>
                  {restaurant.cuisine_type && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {restaurant.cuisine_type}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Star className="size-3.5 fill-primary text-primary" aria-hidden="true" />
                      <span className="font-semibold">{restaurant.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="size-3.5" aria-hidden="true" />
                      <span>
                        {restaurant.delivery_time_min ?? 25}–{restaurant.delivery_time_max ?? 40} min
                      </span>
                    </div>
                  </div>
                  {(restaurant.delivery_fee ?? 0) > 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      ₹{restaurant.delivery_fee} delivery
                      {restaurant.min_order ? ` · Min: ₹${restaurant.min_order}` : ""}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 text-6xl" aria-hidden="true">🔍</div>
            <h3 className="mb-2 text-lg font-semibold">No restaurants found</h3>
            <p className="mb-6 text-muted-foreground">Try adjusting your search or filters</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCuisine(null)
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function RestaurantsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <RestaurantsContent />
    </Suspense>
  )
}
