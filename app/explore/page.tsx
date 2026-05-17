import { createClient } from "@/lib/supabase/server"
import { ExplorePageClient } from "@/components/explore-page-client"
import type { Restaurant } from "@/lib/types"

export default async function ExplorePage() {
  const supabase = await createClient()
  
  // Fetch all restaurants
  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("*")
    .eq("is_active", true)
    .order("rating", { ascending: false })

  // Get unique cuisines
  const cuisines = [...new Set((restaurants ?? []).map(r => r.cuisine_type))]

  return (
    <ExplorePageClient 
      restaurants={(restaurants as Restaurant[]) ?? []}
      cuisines={cuisines}
    />
  )
}
