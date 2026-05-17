"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"
import {
  ArrowLeft,
  Clock,
  Flame,
  Leaf,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Bike,
  UtensilsCrossed,
  IndianRupee,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"
import { useCart } from "@/lib/cart-context"
import type { Restaurant, MenuItem } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RestaurantDetailClientProps {
  restaurant: Restaurant
  menuItems: MenuItem[]
  user: User | null
}

export function RestaurantDetailClient({ restaurant, menuItems, user }: RestaurantDetailClientProps) {
  const { addToCart, items, isLoading } = useCart()
  const [addingItemId, setAddingItemId] = useState<string | null>(null)

  // Group menu items by category
  const categories = useMemo(() => {
    const grouped: Record<string, MenuItem[]> = {}
    menuItems.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = []
      }
      grouped[item.category].push(item)
    })
    return Object.entries(grouped)
  }, [menuItems])

  const handleAddToCart = async (item: MenuItem) => {
    setAddingItemId(item.id)
    await addToCart(item, restaurant)
    setAddingItemId(null)
  }

  // Get cart item count for this restaurant
  const getItemQuantityInCart = (itemId: string) => {
    const cartItem = items.find((item) => item.menu_item_id === itemId)
    return cartItem?.quantity ?? 0
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header Image */}
      <div className="relative h-48 md:h-64">
        {restaurant.image_url ? (
          <Image
            src={restaurant.image_url}
            alt={restaurant.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <UtensilsCrossed className="size-16 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Back Button */}
        <Link
          href="/"
          className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-colors hover:bg-background"
        >
          <ArrowLeft className="size-5" />
        </Link>

        {/* Cart Button */}
        <Link
          href="/cart"
          className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-colors hover:bg-background"
        >
          <ShoppingBag className="size-5" />
        </Link>
      </div>

      {/* Restaurant Info */}
      <div className="relative -mt-16 mx-auto max-w-4xl px-4">
        <div className="rounded-2xl border border-border/60 bg-card/90 p-5 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold md:text-3xl">{restaurant.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {restaurant.cuisine_type}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  {restaurant.rating.toFixed(1)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-4" />
                  {restaurant.delivery_time_min}-{restaurant.delivery_time_max} min
                </span>
                <span className="flex items-center gap-0.5">
                  <Bike className="size-4" />
                  <IndianRupee className="size-3" />
                  {restaurant.delivery_fee.toFixed(0)} delivery
                </span>
              </div>
            </div>
          </div>
          {restaurant.description && (
            <p className="mt-3 text-sm text-muted-foreground">{restaurant.description}</p>
          )}
          <p className="mt-2 flex items-center gap-0.5 text-xs text-muted-foreground">
            Minimum order: <IndianRupee className="size-3" />{restaurant.min_order.toFixed(0)}
          </p>
        </div>
      </div>

      {/* Menu */}
      <div className="mx-auto max-w-4xl px-4 py-6">
        {categories.length > 0 ? (
          <div className="flex flex-col gap-8">
            {categories.map(([category, items]) => (
              <section key={category}>
                <h2 className="mb-4 text-lg font-bold">{category}</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {items.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      quantityInCart={getItemQuantityInCart(item.id)}
                      onAddToCart={() => handleAddToCart(item)}
                      isAdding={addingItemId === item.id}
                      isLoading={isLoading}
                      isLoggedIn={!!user}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/40 py-16">
            <UtensilsCrossed className="size-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">Menu coming soon</p>
            <p className="text-sm text-muted-foreground">Check back later for delicious options</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

interface MenuItemCardProps {
  item: MenuItem
  quantityInCart: number
  onAddToCart: () => void
  isAdding: boolean
  isLoading: boolean
  isLoggedIn: boolean
}

function MenuItemCard({ item, quantityInCart, onAddToCart, isAdding, isLoading, isLoggedIn }: MenuItemCardProps) {
  return (
    <article className="flex gap-4 rounded-xl border border-border/60 bg-card/60 p-3 backdrop-blur transition-all hover:border-primary/30">
      {/* Image */}
      <div className="relative size-24 shrink-0 overflow-hidden rounded-lg md:size-28">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            sizes="112px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <UtensilsCrossed className="size-8 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">{item.name}</h3>
          <span className="shrink-0 flex items-center font-bold text-primary">
            <IndianRupee className="size-3.5" />{item.price.toFixed(0)}
          </span>
        </div>
        
        {item.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
        )}

        {/* Tags */}
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          {item.is_vegetarian && (
            <span className="flex items-center gap-0.5 rounded-md bg-green-500/15 px-1.5 py-0.5 text-[10px] font-medium text-green-500">
              <Leaf className="size-3" /> Veg
            </span>
          )}
          {item.is_vegan && (
            <span className="flex items-center gap-0.5 rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-500">
              <Leaf className="size-3" /> Vegan
            </span>
          )}
          {item.is_spicy && (
            <span className="flex items-center gap-0.5 rounded-md bg-red-500/15 px-1.5 py-0.5 text-[10px] font-medium text-red-500">
              <Flame className="size-3" /> Spicy
            </span>
          )}
          {item.calories && (
            <span className="text-[10px] text-muted-foreground">
              {item.calories} cal
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <div className="mt-auto flex items-center justify-end pt-2">
          {quantityInCart > 0 ? (
            <div className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-2 py-1">
              <span className="text-sm font-bold text-primary">{quantityInCart} in cart</span>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={onAddToCart}
              disabled={isAdding || isLoading}
              className="h-8 rounded-full font-semibold"
            >
              {isAdding ? (
                <span className="flex items-center gap-1">
                  <span className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Adding
                </span>
              ) : (
                <>
                  <Plus className="mr-1 size-4" />
                  {isLoggedIn ? "Add" : "Sign in to add"}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
