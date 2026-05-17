"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, Loader2, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"

export default function CheckoutReturnPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [orderTime] = useState(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() + 35)
    return now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  })

  useEffect(() => {
    if (sessionId) {
      // In a real app, you would verify the session with Stripe here
      // For now, we assume success if there's a session_id
      const timer = setTimeout(() => {
        setStatus("success")
      }, 1500)
      return () => clearTimeout(timer)
    } else {
      setStatus("error")
    }
  }, [sessionId])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground">Processing your order...</p>
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 pb-24">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6"
        >
          <XCircle className="w-10 h-10 text-red-500" />
        </motion.div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Payment Failed</h1>
        <p className="text-muted-foreground text-center mb-8">
          Something went wrong with your payment. Please try again.
        </p>
        <Link
          href="/cart"
          className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl"
        >
          Return to Cart
        </Link>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="flex flex-col items-center justify-center p-6 pt-16">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            Your delicious food is being prepared
          </p>
        </motion.div>

        {/* Order Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-sm bg-muted rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estimated Arrival</p>
              <p className="text-xl font-bold text-foreground">{orderTime}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-foreground">Order confirmed</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
              <span className="text-sm text-muted-foreground">Preparing your food</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
              <span className="text-sm text-muted-foreground">On the way</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
              <span className="text-sm text-muted-foreground">Delivered</span>
            </div>
          </div>
        </motion.div>

        {/* Delivery Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-sm bg-muted rounded-2xl p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Delivering to</p>
              <p className="text-foreground font-medium">Your saved address</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-3 w-full max-w-sm"
        >
          <Link
            href="/orders"
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl text-center"
          >
            Track Order
          </Link>
          <Link
            href="/"
            className="w-full py-3 bg-muted text-foreground font-semibold rounded-xl text-center"
          >
            Continue Browsing
          </Link>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  )
}
