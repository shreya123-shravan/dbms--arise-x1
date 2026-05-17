import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfilePageClient } from "@/components/profile-page-client"
import type { Profile, Order } from "@/lib/types"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Fetch recent orders
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      restaurant:restaurants (name, image_url)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Stats
  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { data: totalSpentData } = await supabase
    .from("orders")
    .select("total")
    .eq("user_id", user.id)
    .eq("status", "delivered")

  const totalSpent = totalSpentData?.reduce((sum, o) => sum + (o.total || 0), 0) ?? 0

  return (
    <ProfilePageClient
      user={user}
      profile={profile as Profile}
      recentOrders={(orders as Order[]) ?? []}
      stats={{
        totalOrders: totalOrders ?? 0,
        totalSpent,
      }}
    />
  )
}
