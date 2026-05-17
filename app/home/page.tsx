'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { LoadingScreen } from '@/components/loading-screen'
import { ArrowRight, Search, Clock, Star, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SiteNav } from '@/components/site-nav'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import type { Restaurant } from '@/lib/types'

export default function HomePage() {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [popularRestaurants, setPopularRestaurants] = useState<Restaurant[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRestaurants() {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('restaurants')
          .select('*')
          .eq('is_open', true)
          .order('rating', { ascending: false })
          .limit(6)
        // Deduplicate by name in case of duplicate DB entries
        const seen = new Set<string>()
        const unique = ((data as Restaurant[]) ?? []).filter((r) => {
          if (seen.has(r.name)) return false
          seen.add(r.name)
          return true
        })
        setPopularRestaurants(unique)
      } catch (error) {
        console.error('Failed to load restaurants:', error)
      } finally {
        setLoading(false)
      }
    }
    loadRestaurants()
  }, [])

  if (!loaded) {
    return <LoadingScreen onReady={() => setLoaded(true)} />
  }

  return (
    <div className="relative min-h-screen bg-background">
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="flex flex-col items-center gap-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              <Sparkles className="size-3" aria-hidden="true" />
              AI-Powered Food Delivery
            </span>

            <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Crave it.{' '}
              <span className="text-primary">We deliver it.</span>{' '}
              <span className="text-accent">Earn XP.</span>
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Discover amazing restaurants, order your favorite meals, and get rewarded for every order.
            </p>

            <div className="w-full max-w-md">
              <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-3">
                <Search className="size-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  type="search"
                  placeholder="Search restaurants or dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery) {
                      router.push(`/restaurants?q=${encodeURIComponent(searchQuery)}`)
                    }
                  }}
                  className="border-0 bg-transparent p-0 focus-visible:ring-0"
                  aria-label="Search restaurants"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <Button asChild size="lg" className="font-bold">
                <Link href="/restaurants">
                  Browse Restaurants
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-semibold">
                <Link href="/leaderboard">
                  <Star className="size-4" aria-hidden="true" />
                  View Leaderboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden border-y border-border/60 bg-border/60 md:grid-cols-4">
        {[
          { value: '500+', label: 'Restaurants' },
          { value: '50K+', label: 'Dishes' },
          { value: '15min', label: 'Avg Delivery' },
          { value: '4.8★', label: 'Rated' },
        ].map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center justify-center gap-1 bg-background px-4 py-6">
            <div className="text-3xl font-extrabold text-primary md:text-4xl">{value}</div>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
          </div>
        ))}
      </section>

      {/* Popular Restaurants */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Popular Restaurants</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/restaurants">
              View all <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-secondary/50" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {popularRestaurants.map((restaurant) => (
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
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-border/30">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center md:py-24">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Ready to order?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of users earning XP with every meal
          </p>
          <Button asChild size="lg" className="font-bold">
            <Link href="/restaurants">
              Start Ordering
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
