"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
  UtensilsCrossed,
  ChefHat,
  XCircle,
  IndianRupee,
  Navigation,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"
import type { Order, OrderStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface OrdersPageClientProps {
  orders: Order[]
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; icon: typeof Clock; color: string; bgColor: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-500",
    bgColor: "bg-amber-500/15",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-500/15",
  },
  preparing: {
    label: "Preparing",
    icon: ChefHat,
    color: "text-orange-500",
    bgColor: "bg-orange-500/15",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    icon: Truck,
    color: "text-purple-500",
    bgColor: "bg-purple-500/15",
  },
  delivered: {
    label: "Delivered",
    icon: Package,
    color: "text-primary",
    bgColor: "bg-primary/15",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/15",
  },
}

export function OrdersPageClient({ orders }: OrdersPageClientProps) {
  const activeOrders = orders.filter(
    (o) => !["delivered", "cancelled"].includes(o.status)
  )
  const pastOrders = orders.filter((o) =>
    ["delivered", "cancelled"].includes(o.status)
  )

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/40 glass-strong">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex size-10 items-center justify-center rounded-full bg-secondary/80 transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-lg font-bold">Your Orders</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/40 py-16"
          >
            <div className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <ShoppingBag className="size-12 text-purple-400" />
            </div>
            <h2 className="mt-4 text-xl font-bold">No orders yet</h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              When you place an order, it will appear here
            </p>
            <Button asChild className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600">
              <Link href="/">Start Ordering</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Active Orders */}
            {activeOrders.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <Sparkles className="size-5 text-purple-400" />
                  Active Orders
                </h2>
                <div className="flex flex-col gap-4">
                  {activeOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <OrderCard order={order} isActive />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Past Orders */}
            {pastOrders.length > 0 && (
              <section>
                <h2 className="mb-4 text-lg font-bold">Past Orders</h2>
                <div className="flex flex-col gap-4">
                  {pastOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <OrderCard order={order} />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

function OrderCard({ order, isActive }: { order: Order; isActive?: boolean }) {
  const statusConfig = STATUS_CONFIG[order.status]
  const StatusIcon = statusConfig.icon
  const orderDate = new Date(order.created_at)
  const formattedDate = orderDate.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  const formattedTime = orderDate.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  })

  return (
    <article className={cn(
      "rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur transition-all hover:border-purple-500/30",
      isActive && "border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-pink-500/5"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative size-14 overflow-hidden rounded-xl">
            {order.restaurant?.image_url ? (
              <Image
                src={order.restaurant.image_url}
                alt={order.restaurant?.name ?? ""}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <UtensilsCrossed className="size-5 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">{order.restaurant?.name}</span>
            <span className="text-xs text-muted-foreground">
              {formattedDate} at {formattedTime}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              #{order.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
        </div>
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1",
            statusConfig.bgColor
          )}
        >
          <StatusIcon className={cn("size-3.5", statusConfig.color)} />
          <span className={cn("text-xs font-medium", statusConfig.color)}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Order Items */}
      <div className="mt-4 flex flex-col gap-2">
        {order.order_items?.slice(0, 3).map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {item.quantity}x {item.menu_item?.name}
            </span>
            <span className="flex items-center">
              <IndianRupee className="size-3" />
              {item.subtotal.toFixed(0)}
            </span>
          </div>
        ))}
        {(order.order_items?.length ?? 0) > 3 && (
          <span className="text-xs text-muted-foreground">
            +{(order.order_items?.length ?? 0) - 3} more items
          </span>
        )}
      </div>

      {/* Delivery Address */}
      <div className="mt-3 flex items-start gap-2 rounded-lg bg-secondary/30 p-2 text-xs">
        <MapPin className="mt-0.5 size-3.5 shrink-0 text-purple-400" />
        <span className="text-muted-foreground">{order.delivery_address}</span>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Total</span>
          <span className="flex items-center text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            <IndianRupee className="size-4 text-purple-400" />
            {order.total.toFixed(0)}
          </span>
        </div>
        <div className="flex gap-2">
          {isActive && (
            <Button asChild size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Link href={`/orders/${order.id}`}>
                <Navigation className="mr-1 size-4" />
                Track Order
              </Link>
            </Button>
          )}
          {order.status === "delivered" && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/restaurant/${order.restaurant_id}`}>Reorder</Link>
            </Button>
          )}
        </div>
      </div>

      {/* ETA for active orders */}
      {order.estimated_delivery && !["delivered", "cancelled"].includes(order.status) && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-purple-500/10 p-2 text-xs text-purple-400">
          <Clock className="size-3.5" />
          Estimated delivery:{" "}
          {new Date(order.estimated_delivery).toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </div>
      )}
    </article>
  )
}
