import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { RestaurantDetailClient } from "@/components/restaurant-detail-client"
import type { Restaurant, MenuItem } from "@/lib/types"

interface RestaurantPageProps {
  params: Promise<{ id: string }>
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch restaurant
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .single()

  if (!restaurant) {
    notFound()
  }

  // Fetch menu items
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", id)
    .eq("is_available", true)
    .order("category")

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <RestaurantDetailClient
      restaurant={restaurant as Restaurant}
      menuItems={(menuItems as MenuItem[]) ?? []}
      user={user}
    />
  )
}
