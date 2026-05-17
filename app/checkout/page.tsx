"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  CheckCircle2,
  IndianRupee,
  Loader2,
  MapPin,
  QrCode,
  Smartphone,
  Shield,
  Sparkles,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { QRCodeSVG } from "qrcode.react"
import { createClient } from "@/lib/supabase/client"

type PaymentStatus = "idle" | "processing" | "waiting" | "success"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, restaurant, subtotal, deliveryFee, total, clearCart } = useCart()
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle")
  const [orderId, setOrderId] = useState<string | null>(null)
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [finalTotal, setFinalTotal] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [qrSessionId, setQrSessionId] = useState<string | null>(null)
  const [qrExpired, setQrExpired] = useState(false)
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null)
  const expiryRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setDeliveryAddress(sessionStorage.getItem("deliveryAddress") || "")
    const coupon = sessionStorage.getItem("appliedCoupon")
    if (coupon && coupon !== "null") setAppliedCoupon(JSON.parse(coupon))
    const saved = sessionStorage.getItem("finalTotal")
    setFinalTotal(saved ? parseFloat(saved) : total)
  }, [total])

  useEffect(() => {
    if (items.length === 0 && paymentStatus !== "success") router.push("/cart")
  }, [items.length, router, paymentStatus])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      channelRef.current?.unsubscribe()
      if (expiryRef.current) clearTimeout(expiryRef.current)
    }
  }, [])

  const startQRSession = async () => {
    setQrExpired(false)
    setPaymentStatus("processing")

    const sessionId = crypto.randomUUID()
    setQrSessionId(sessionId)
    setPaymentStatus("waiting")

    const supabase = createClient()

    // Insert session (best-effort, QR shows regardless)
    await supabase.from("payment_sessions").insert({ id: sessionId, amount: finalTotal })

    // Subscribe to realtime approval
    const channel = supabase
      .channel(`pay_${sessionId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "payment_sessions", filter: `id=eq.${sessionId}` },
        (payload) => {
          channel.unsubscribe()
          if (payload.new.status === "approved") completePayment()
          else if (payload.new.status === "declined") {
            setPaymentStatus("idle")
            setQrSessionId(null)
          }
        }
      )
      .subscribe()

    channelRef.current = channel

    // QR expires after 5 minutes
    expiryRef.current = setTimeout(() => {
      channel.unsubscribe()
      setQrExpired(true)
      setPaymentStatus("idle")
    }, 5 * 60 * 1000)
  }

  const completePayment = async () => {
    if (expiryRef.current) clearTimeout(expiryRef.current)
    setPaymentStatus("processing")
    const newOrderId = await createOrderAndPayment()
    setOrderId(newOrderId)
    setPaymentStatus("success")
    clearCart()
    sessionStorage.removeItem("deliveryAddress")
    sessionStorage.removeItem("specialInstructions")
    sessionStorage.removeItem("appliedCoupon")
    sessionStorage.removeItem("finalTotal")
  }

  const createOrderAndPayment = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !restaurant) return null

    const specialInstructions = sessionStorage.getItem("specialInstructions") || ""

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        restaurant_id: restaurant.id,
        status: "confirmed",
        delivery_status: "confirmed",
        subtotal,
        delivery_fee: deliveryFee,
        total: finalTotal,
        delivery_address: deliveryAddress,
        special_instructions: specialInstructions || null,
        estimated_delivery: new Date(Date.now() + (restaurant.delivery_time_max ?? 40) * 60 * 1000).toISOString(),
        delivery_otp: Math.floor(1000 + Math.random() * 9000).toString(),
      })
      .select("id")
      .single()

    if (error || !order) { console.error(error); return null }

    await supabase.from("order_items").insert(
      items.map((item) => ({
        order_id: order.id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        unit_price: item.menu_item?.price ?? 0,
        subtotal: (item.menu_item?.price ?? 0) * item.quantity,
        special_instructions: item.special_instructions ?? null,
      }))
    )

    await supabase.from("payments").insert({
      order_id: order.id,
      user_id: user.id,
      amount: finalTotal,
      payment_method: "upi",
      transaction_id: `TXN${Date.now()}`,
      status: "completed",
      paid_at: new Date().toISOString(),
    })

    await supabase.from("notifications").insert({
      user_id: user.id,
      title: "Order Confirmed!",
      message: `Your order from ${restaurant.name} has been placed.`,
      type: "order",
      data: { order_id: order.id },
    })

    return order.id
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (paymentStatus === "success") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex max-w-md w-full flex-col items-center gap-6 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative"
          >
            <div className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-500/30">
              <CheckCircle2 className="size-12 text-white" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full bg-purple-500"
            >
              <Sparkles className="size-4 text-white" />
            </motion.div>
          </motion.div>

          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Payment Successful!
            </h1>
            <p className="mt-2 text-muted-foreground">Your order is being prepared</p>
          </div>

          <div className="w-full rounded-2xl border border-border/60 bg-card/60 p-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono text-sm font-semibold">{orderId?.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between pt-4">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="flex items-center text-xl font-bold text-green-400">
                <IndianRupee className="size-5" />{finalTotal.toFixed(0)}
              </span>
            </div>
          </div>

          <div className="flex w-full gap-3">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/orders">Track Order</Link>
            </Button>
            <Button asChild className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
              <Link href="/">Continue</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Main checkout ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/40 glass-strong">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <Link
            href="/cart"
            className="flex size-10 items-center justify-center rounded-full bg-secondary/80 transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-lg font-bold">Payment</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Left — QR / Status */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/5 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-purple-500">
                  <QrCode className="size-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">UPI Payment</p>
                  <p className="text-sm text-muted-foreground">Scan QR with any UPI app</p>
                </div>
              </div>

              {/* QR area */}
              <div className="flex flex-col items-center gap-4">
                {paymentStatus === "waiting" && qrSessionId && !qrExpired ? (
                  <>
                    <div className="rounded-2xl bg-white p-4 shadow-lg">
                      <QRCodeSVG
                        value={`${window.location.origin}/checkout/qr?session=${qrSessionId}&amount=${finalTotal.toFixed(2)}`}
                        size={200}
                        level="M"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Smartphone className="size-4 animate-pulse text-purple-400" />
                      Waiting for approval on mobile…
                    </div>
                  </>
                ) : paymentStatus === "processing" ? (
                  <div className="flex h-[232px] flex-col items-center justify-center gap-3">
                    <Loader2 className="size-10 animate-spin text-purple-400" />
                    <p className="text-sm text-muted-foreground">Generating QR…</p>
                  </div>
                ) : (
                  <div className="flex h-[232px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/60">
                    <QrCode className="size-12 text-muted-foreground/40" />
                    {qrExpired && (
                      <p className="text-sm text-red-400">QR expired</p>
                    )}
                    <p className="text-sm text-muted-foreground">Click Pay to generate QR</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-card/40 px-4 py-3 text-xs text-muted-foreground">
              <Shield className="size-4 shrink-0 text-green-500" />
              Payments are end-to-end secured. QR expires in 5 minutes.
            </div>
          </div>

          {/* Right — Order Summary */}
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
            <h3 className="mb-4 font-bold">Order Summary</h3>

            {deliveryAddress && (
              <div className="mb-4 flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-purple-400" />
                <div>
                  <p className="text-sm font-medium">Delivering to</p>
                  <p className="text-sm text-muted-foreground">{deliveryAddress}</p>
                </div>
              </div>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="flex items-center gap-0.5"><IndianRupee className="size-3" />{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="flex items-center gap-0.5"><IndianRupee className="size-3" />{deliveryFee.toFixed(0)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-500">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span className="flex items-center gap-0.5">-<IndianRupee className="size-3" />{appliedCoupon.discount.toFixed(0)}</span>
                </div>
              )}
              <div className="my-2 border-t border-border/60" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="flex items-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  <IndianRupee className="size-4 text-purple-400" />{finalTotal.toFixed(0)}
                </span>
              </div>
            </div>

            <Button
              onClick={startQRSession}
              disabled={paymentStatus === "processing" || paymentStatus === "waiting"}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 py-6 text-lg font-bold shadow-lg shadow-purple-500/25"
            >
              {paymentStatus === "processing" ? (
                <><Loader2 className="mr-2 size-5 animate-spin" />Generating QR…</>
              ) : paymentStatus === "waiting" ? (
                <><Smartphone className="mr-2 size-5 animate-pulse" />Waiting for approval…</>
              ) : qrExpired ? (
                <><RefreshCw className="mr-2 size-5" />Regenerate QR</>
              ) : (
                <>Pay <IndianRupee className="ml-1 size-5" />{finalTotal.toFixed(0)}</>
              )}
            </Button>
          </div>

        </div>
      </main>
    </div>
  )
}
