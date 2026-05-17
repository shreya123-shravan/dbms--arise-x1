import { createClient } from "@/lib/supabase/server"
import { HomePageClient } from "@/components/home-page-client"
import type { Restaurant } from "@/lib/types"

export default async function HomePage() {
  const supabase = await createClient()
  
  // Fetch featured restaurants
  const { data: featuredRestaurants } = await supabase
    .from("restaurants")
    .select("*")
    .eq("is_featured", true)
    .eq("is_active", true)
    .order("rating", { ascending: false })
    .limit(6)

  // Fetch all restaurants
  const { data: allRestaurants } = await supabase
    .from("restaurants")
    .select("*")
    .eq("is_active", true)
    .order("rating", { ascending: false })

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <HomePageClient 
      featuredRestaurants={(featuredRestaurants as Restaurant[]) ?? []}
      allRestaurants={(allRestaurants as Restaurant[]) ?? []}
      user={user}
    />
  )
}
