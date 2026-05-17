import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { OrdersPageClient } from "@/components/orders-page-client"
import type { Order } from "@/lib/types"

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user's orders with restaurant and items
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      restaurant:restaurants (*),
      order_items (
        *,
        menu_item:menu_items (*)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return <OrdersPageClient orders={(orders as Order[]) ?? []} />
}
