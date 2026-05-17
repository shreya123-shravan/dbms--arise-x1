import { createClient } from "@/utils/supabase/server"
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

  // Add default UI fields
  const restaurantWithDefaults = {
    ...restaurant,
    cuisine_type: restaurant.description?.includes('Japanese') ? 'Japanese' :
                  restaurant.description?.includes('Italian') ? 'Italian' :
                  restaurant.description?.includes('Indian') ? 'Indian' :
                  restaurant.description?.includes('Chinese') ? 'Chinese' :
                  restaurant.description?.includes('Mexican') ? 'Mexican' :
                  restaurant.description?.includes('Korean') ? 'Korean' :
                  restaurant.description?.includes('salad') || restaurant.description?.includes('healthy') ? 'Healthy' : 'Food',
    delivery_time_min: 25,
    delivery_time_max: 35,
    delivery_fee: 40,
    min_order: 99
  }

  return (
    <RestaurantDetailClient
      restaurant={restaurantWithDefaults as Restaurant}
      menuItems={(menuItems as MenuItem[]) ?? []}
      user={user}
    />
  )
}
