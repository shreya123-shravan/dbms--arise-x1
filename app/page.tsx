import { createClient } from "@/utils/supabase/server"
import { HomePageClient } from "@/components/home-page-client"
import type { Restaurant } from "@/lib/types"

export default async function HomePage() {
  const supabase = await createClient()
  
  // Fetch featured restaurants (top rated)
  const { data: featuredRestaurants } = await supabase
    .from("restaurants")
    .select("*")
    .eq("is_open", true)
    .not("image_url", "is", null)
    .order("rating", { ascending: false })
    .limit(6)

  // Fetch all restaurants
  const { data: allRestaurants } = await supabase
    .from("restaurants")
    .select("*")
    .eq("is_open", true)
    .not("image_url", "is", null)
    .order("rating", { ascending: false })

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  // Add default UI fields
  const getCuisineType = (r: any): string => {
    const text = `${r.name} ${r.description}`.toLowerCase()
    if (text.includes('sushi') || text.includes('ramen') || text.includes('japanese') || text.includes('tokyo')) return 'Japanese'
    if (text.includes('pizza') || text.includes('pasta') || text.includes('italian')) return 'Italian'
    if (text.includes('indian') || text.includes('biryani') || text.includes('curry') || text.includes('dosa') || text.includes('punjabi') || text.includes('chettinad')) return 'Indian'
    if (text.includes('chinese') || text.includes('noodle') || text.includes('wok') || text.includes('dim sum')) return 'Chinese'
    if (text.includes('mexican') || text.includes('taco') || text.includes('burrito')) return 'Mexican'
    if (text.includes('korean') || text.includes('bbq') || text.includes('seoul') || text.includes('k-pop')) return 'Korean'
    if (text.includes('salad') || text.includes('healthy') || text.includes('green') || text.includes('protein') || text.includes('fit')) return 'Healthy'
    if (text.includes('burger') || text.includes('smash') || text.includes('bun')) return 'Burgers'
    if (text.includes('thai') || text.includes('pad thai')) return 'Thai'
    if (text.includes('mediterranean') || text.includes('shawarma') || text.includes('falafel') || text.includes('lebanese') || text.includes('beirut')) return 'Mediterranean'
    if (text.includes('chaat') || text.includes('street') || text.includes('puri') || text.includes('roll')) return 'Street Food'
    if (text.includes('fish') || text.includes('seafood') || text.includes('prawn')) return 'Seafood'
    if (text.includes('dessert') || text.includes('waffle') || text.includes('sweet') || text.includes('cafe') || text.includes('coffee') || text.includes('brew')) return 'Cafe'
    if (text.includes('breakfast') || text.includes('pancake') || text.includes('eggs')) return 'Breakfast'
    if (text.includes('smoke') || text.includes('grill') || text.includes('bbq') || text.includes('rib')) return 'BBQ'
    return 'Food'
  }

  const addDefaults = (restaurants: any[]) => restaurants
    .filter(r => r.image_url && r.image_url.trim() !== "")
    .map(r => ({
      ...r,
      cuisine_type: getCuisineType(r),
      delivery_time_min: 25,
      delivery_time_max: 35,
      delivery_fee: 40,
      min_order: 99,
    }))

  return (
    <HomePageClient 
      featuredRestaurants={addDefaults(featuredRestaurants || [])}
      allRestaurants={addDefaults(allRestaurants || [])}
      user={user}
    />
  )
}
