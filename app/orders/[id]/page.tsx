"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  CheckCircle2,
  ChefHat,
  Clock,
  IndianRupee,
  MapPin,
  Package,
  Phone,
  Bike,
  Star,
  Navigation,
  Utensils,
  Home,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { Order, Restaurant, DeliveryPartner } from "@/lib/types"

const deliveryStages = [
  { id: "confirmed", label: "Order Confirmed", icon: CheckCircle2, description: "Your order has been received" },
  { id: "cooking", label: "Preparing Food", icon: ChefHat, description: "Chef is preparing your meal" },
  { id: "food_ready", label: "Food Ready", icon: Package, description: "Your food is packed and ready" },
  { id: "picked_up", label: "Picked Up", icon: Bike, description: "Delivery partner picked up your order" },
  { id: "on_the_way", label: "On The Way", icon: Navigation, description: "Your order is on its way" },
  { id: "near_location", label: "Near You", icon: MapPin, description: "Delivery partner is nearby" },
  { id: "delivered", label: "Delivered", icon: Home, description: "Order delivered successfully" },
]

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [order, setOrder] = useState<Order | null>(null)
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [deliveryPartner, setDeliveryPartner] = useState<DeliveryPartner | null>(null)
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [riderPosition, setRiderPosition] = useState({ x: 20, y: 80 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrderDetails()
  }, [id])

  // Simulate delivery progress
  useEffect(() => {
    if (!order || order.status === "delivered") return

    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < deliveryStages.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 8000) // Progress every 8 seconds for demo

    return () => clearInterval(interval)
  }, [order])

  // Animate rider position
  useEffect(() => {
    if (currentStageIndex >= 3) {
      const interval = setInterval(() => {
        setRiderPosition((prev) => ({
          x: Math.min(prev.x + Math.random() * 5, 80),
          y: Math.max(prev.y - Math.random() * 3, 20),
        }))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [currentStageIndex])

  const fetchOrderDetails = async () => {
    const supabase = createClient()
    
    const { data: orderData } = await supabase
      .from("orders")
      .select("*, restaurant:restaurants(*)")
      .eq("id", id)
      .single()

    if (orderData) {
      setOrder(orderData)
      setRestaurant(orderData.restaurant)
      
      // Get a random delivery partner
      const { data: partners } = await supabase
        .from("delivery_partners")
        .select("*")
        .eq("is_available", true)
        .limit(1)
      
      if (partners && partners.length > 0) {
        setDeliveryPartner(partners[0])
      }

      // Set initial stage based on order status
      const stageIndex = deliveryStages.findIndex(s => s.id === orderData.delivery_status)
      setCurrentStageIndex(stageIndex >= 0 ? stageIndex : 0)
    }
    
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-500" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <Button asChild className="mt-4">
          <Link href="/orders">View All Orders</Link>
        </Button>
      </div>
    )
  }

  const currentStage = deliveryStages[currentStageIndex]
  const isDelivered = currentStageIndex === deliveryStages.length - 1

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/40 glass-strong">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <Link
            href="/orders"
            className="flex size-10 items-center justify-center rounded-full bg-secondary/80 transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold">Track Order</h1>
            <p className="text-xs text-muted-foreground">#{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* Animated Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-6 h-64 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900"
        >
          {/* Map Grid */}
          <div className="absolute inset-0 opacity-20">
            <svg className="h-full w-full">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Roads */}
          <svg className="absolute inset-0 h-full w-full">
            <path
              d="M 50 230 Q 150 180, 200 150 T 350 80"
              fill="none"
              stroke="rgba(147, 51, 234, 0.5)"
              strokeWidth="4"
              strokeDasharray="10,5"
            />
            <motion.path
              d="M 50 230 Q 150 180, 200 150 T 350 80"
              fill="none"
              stroke="rgba(236, 72, 153, 0.8)"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: currentStageIndex >= 3 ? (currentStageIndex - 3) / 4 : 0 }}
              transition={{ duration: 2 }}
            />
          </svg>

          {/* Restaurant Location */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute left-[10%] top-[85%] -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative">
              <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/30">
                <Utensils className="size-6 text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-full bg-orange-500/30"
              />
            </div>
            <p className="mt-1 text-center text-xs text-white/70">Restaurant</p>
          </motion.div>

          {/* Customer Location */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute right-[15%] top-[25%] -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative">
              <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/30">
                <Home className="size-6 text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                className="absolute inset-0 rounded-full bg-green-500/30"
              />
            </div>
            <p className="mt-1 text-center text-xs text-white/70">Your Location</p>
          </motion.div>

          {/* Delivery Rider */}
          {currentStageIndex >= 3 && (
            <motion.div
              animate={{ 
                left: `${riderPosition.x}%`,
                top: `${riderPosition.y}%`,
              }}
              transition={{ type: "spring", stiffness: 50 }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50"
                >
                  <Bike className="size-5 text-white" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="absolute inset-0 rounded-full bg-purple-500"
                />
              </div>
            </motion.div>
          )}

          {/* ETA Badge */}
          <div className="absolute right-4 top-4 rounded-full bg-black/50 px-4 py-2 backdrop-blur">
            <p className="flex items-center gap-2 text-sm text-white">
              <Clock className="size-4 text-purple-400" />
              ETA: {restaurant?.delivery_time_min}-{restaurant?.delivery_time_max} mins
            </p>
          </div>
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 rounded-2xl border border-border/60 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6"
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`flex size-16 items-center justify-center rounded-2xl ${
                isDelivered 
                  ? "bg-gradient-to-br from-green-500 to-emerald-500" 
                  : "bg-gradient-to-br from-purple-500 to-pink-500"
              } shadow-lg`}
            >
              <currentStage.icon className="size-8 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold">{currentStage.label}</h2>
              <p className="text-muted-foreground">{currentStage.description}</p>
            </div>
          </div>
        </motion.div>

        {/* Delivery Partner */}
        {deliveryPartner && currentStageIndex >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl border border-border/60 bg-card/60 p-4"
          >
            <h3 className="mb-3 font-semibold">Delivery Partner</h3>
            <div className="flex items-center gap-4">
              <div className="relative size-14 overflow-hidden rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                <div className="flex h-full w-full items-center justify-center text-white text-xl font-bold">
                  {deliveryPartner.name.charAt(0)}
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold">{deliveryPartner.name}</p>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="size-3 fill-yellow-400 text-yellow-400" />
                  {deliveryPartner.rating} rating
                </p>
                <p className="text-xs text-muted-foreground">{deliveryPartner.vehicle_number}</p>
              </div>
              <Button size="icon" variant="outline" className="size-12 rounded-full">
                <Phone className="size-5" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Tracking Timeline */}
        <div className="mb-6 rounded-2xl border border-border/60 bg-card/60 p-6">
          <h3 className="mb-4 font-semibold">Order Timeline</h3>
          <div className="relative space-y-4">
            {deliveryStages.map((stage, index) => {
              const isCompleted = index <= currentStageIndex
              const isCurrent = index === currentStageIndex
              const Icon = stage.icon

              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="relative flex flex-col items-center">
                    <motion.div
                      animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className={`flex size-10 items-center justify-center rounded-full ${
                        isCompleted
                          ? "bg-gradient-to-br from-purple-500 to-pink-500"
                          : "bg-muted"
                      }`}
                    >
                      <Icon className={`size-5 ${isCompleted ? "text-white" : "text-muted-foreground"}`} />
                    </motion.div>
                    {index < deliveryStages.length - 1 && (
                      <div className={`mt-2 h-12 w-0.5 ${
                        index < currentStageIndex ? "bg-purple-500" : "bg-border"
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 pt-2">
                    <p className={`font-medium ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                      {stage.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{stage.description}</p>
                  </div>
                  {isCurrent && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="flex items-center gap-1 self-center rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-400"
                    >
                      <Sparkles className="size-3" />
                      Now
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Order Details */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
          <h3 className="mb-4 font-semibold">Order Details</h3>
          
          {restaurant && (
            <div className="mb-4 flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <div className="relative size-12 overflow-hidden rounded-lg">
                {restaurant.image_url ? (
                  <Image
                    src={restaurant.image_url}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <Utensils className="size-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold">{restaurant.name}</p>
                <p className="text-sm text-muted-foreground">{restaurant.cuisine_type}</p>
              </div>
            </div>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Total</span>
              <span className="flex items-center font-bold">
                <IndianRupee className="size-3" />
                {order.total.toFixed(0)}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-muted-foreground">Delivery Address</span>
              <span className="max-w-[60%] text-right text-foreground">{order.delivery_address}</span>
            </div>
            {order.delivery_otp && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery OTP</span>
                <span className="font-mono font-bold text-purple-400">{order.delivery_otp}</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
