"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  IndianRupee,
  Loader2,
  MapPin,
  QrCode,
  Smartphone,
  Wallet,
  Building,
  ChevronRight,
  Shield,
  Sparkles,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { createClient } from "@/lib/supabase/client"

type PaymentMethod = "upi" | "card" | "netbanking" | "wallet"
type PaymentStatus = "idle" | "processing" | "waiting" | "success" | "failed"

const upiApps = [
  { name: "Google Pay", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png" },
  { name: "PhonePe", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png" },
  { name: "Paytm", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/512px-Paytm_Logo_%28standalone%29.svg.png" },
  { name: "BHIM", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/512px-UPI-Logo-vector.svg.png" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, restaurant, subtotal, deliveryFee, total, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi")
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle")
  const [showMobilePopup, setShowMobilePopup] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [finalTotal, setFinalTotal] = useState(total)
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDeliveryAddress(sessionStorage.getItem("deliveryAddress") || "")
      const coupon = sessionStorage.getItem("appliedCoupon")
      if (coupon && coupon !== "null") {
        setAppliedCoupon(JSON.parse(coupon))
      }
      const savedTotal = sessionStorage.getItem("finalTotal")
      if (savedTotal) {
        setFinalTotal(parseFloat(savedTotal))
      }
    }
  }, [])

  useEffect(() => {
    if (items.length === 0 && paymentStatus !== "success") {
      router.push("/cart")
    }
  }, [items.length, router, paymentStatus])

  const generateQRData = () => {
    return `upi://pay?pa=ariseeats@ybl&pn=ARISE Eats&am=${finalTotal.toFixed(2)}&cu=INR&tn=Order Payment`
  }

  const handlePayNow = () => {
    setPaymentStatus("processing")
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus("waiting")
      setShowMobilePopup(true)
    }, 1500)
  }

  const handleMobilePaymentAccept = async () => {
    setShowMobilePopup(false)
    setPaymentStatus("processing")
    
    // Simulate payment verification
    setTimeout(async () => {
      // Create order and payment in database
      const newOrderId = await createOrderAndPayment()
      setOrderId(newOrderId)
      setPaymentStatus("success")
      clearCart()
      sessionStorage.removeItem("deliveryAddress")
      sessionStorage.removeItem("specialInstructions")
      sessionStorage.removeItem("appliedCoupon")
      sessionStorage.removeItem("finalTotal")
    }, 2000)
  }

  const createOrderAndPayment = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || !restaurant) return null

    const specialInstructions = typeof window !== "undefined" 
      ? sessionStorage.getItem("specialInstructions") || ""
      : ""

    // Create order
    const { data: order, error: orderError } = await supabase
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
        estimated_delivery: new Date(
          Date.now() + (restaurant.delivery_time_max * 60 * 1000)
        ).toISOString(),
        delivery_otp: Math.floor(1000 + Math.random() * 9000).toString(),
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error("Error creating order:", orderError)
      return null
    }

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      unit_price: item.menu_item?.price || 0,
      subtotal: (item.menu_item?.price || 0) * item.quantity,
      special_instructions: item.special_instructions,
    }))

    await supabase.from("order_items").insert(orderItems)

    // Create payment record
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    await supabase.from("payments").insert({
      order_id: order.id,
      user_id: user.id,
      amount: finalTotal,
      payment_method: paymentMethod,
      transaction_id: transactionId,
      status: "completed",
      qr_code_data: generateQRData(),
      paid_at: new Date().toISOString(),
    })

    // Create notification
    await supabase.from("notifications").insert({
      user_id: user.id,
      title: "Order Confirmed!",
      message: `Your order from ${restaurant.name} has been placed successfully.`,
      type: "order",
      data: { order_id: order.id },
    })

    return order.id
  }

  if (paymentStatus === "success") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex max-w-md flex-col items-center gap-6 text-center"
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
            <p className="mt-2 text-muted-foreground">
              Your order has been placed and is being prepared
            </p>
          </div>

          <div className="w-full rounded-2xl border border-border/60 bg-card/60 p-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono text-sm font-semibold">{orderId?.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between pt-4">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="flex items-center text-xl font-bold text-green-400">
                <IndianRupee className="size-5" />
                {finalTotal.toFixed(0)}
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

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Payment Popup */}
      <AnimatePresence>
        {showMobilePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl"
            >
              <button
                onClick={() => {
                  setShowMobilePopup(false)
                  setPaymentStatus("idle")
                }}
                className="absolute right-4 top-4 text-white/60 hover:text-white"
              >
                <X className="size-5" />
              </button>

              {/* Phone Mockup */}
              <div className="relative mx-auto w-64 overflow-hidden rounded-[2.5rem] border-4 border-slate-700 bg-slate-900 p-4">
                <div className="absolute left-1/2 top-0 h-6 w-20 -translate-x-1/2 rounded-b-xl bg-slate-700" />
                
                <div className="mt-6 space-y-4">
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
                      <Wallet className="size-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Payment Request</h3>
                    <p className="text-sm text-white/60">ARISE Eats</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4 text-center">
                    <p className="text-sm text-white/60">Amount to Pay</p>
                    <p className="flex items-center justify-center text-3xl font-bold text-white">
                      <IndianRupee className="size-6" />
                      {finalTotal.toFixed(0)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={handleMobilePaymentAccept}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 py-6 text-lg font-bold"
                    >
                      <CheckCircle2 className="mr-2 size-5" />
                      Accept & Pay
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowMobilePopup(false)
                        setPaymentStatus("idle")
                      }}
                      className="w-full text-white/60"
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center text-sm text-white/60">
                Simulating mobile payment request...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
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
          {/* Payment Methods */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Select Payment Method</h2>

            {/* UPI */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setPaymentMethod("upi")}
              className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                paymentMethod === "upi"
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-border/60 bg-card/60 hover:border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex size-12 items-center justify-center rounded-xl ${
                  paymentMethod === "upi" ? "bg-purple-500" : "bg-muted"
                }`}>
                  <QrCode className={`size-6 ${paymentMethod === "upi" ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">UPI Payment</p>
                  <p className="text-sm text-muted-foreground">Pay using any UPI app</p>
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </div>
              
              {paymentMethod === "upi" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="mt-4 grid grid-cols-4 gap-2"
                >
                  {upiApps.map((app) => (
                    <div
                      key={app.name}
                      className="flex flex-col items-center gap-1 rounded-lg bg-white/5 p-2"
                    >
                      <div className="relative size-8 overflow-hidden rounded-lg bg-white">
                        <Image src={app.icon} alt={app.name} fill className="object-contain p-1" />
                      </div>
                      <span className="text-xs text-muted-foreground">{app.name}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.button>

            {/* Card */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setPaymentMethod("card")}
              className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                paymentMethod === "card"
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-border/60 bg-card/60 hover:border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex size-12 items-center justify-center rounded-xl ${
                  paymentMethod === "card" ? "bg-purple-500" : "bg-muted"
                }`}>
                  <CreditCard className={`size-6 ${paymentMethod === "card" ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Credit / Debit Card</p>
                  <p className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</p>
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </div>
            </motion.button>

            {/* Net Banking */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setPaymentMethod("netbanking")}
              className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                paymentMethod === "netbanking"
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-border/60 bg-card/60 hover:border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex size-12 items-center justify-center rounded-xl ${
                  paymentMethod === "netbanking" ? "bg-purple-500" : "bg-muted"
                }`}>
                  <Building className={`size-6 ${paymentMethod === "netbanking" ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Net Banking</p>
                  <p className="text-sm text-muted-foreground">All major banks supported</p>
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </div>
            </motion.button>

            {/* Wallet */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setPaymentMethod("wallet")}
              className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                paymentMethod === "wallet"
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-border/60 bg-card/60 hover:border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex size-12 items-center justify-center rounded-xl ${
                  paymentMethod === "wallet" ? "bg-purple-500" : "bg-muted"
                }`}>
                  <Wallet className={`size-6 ${paymentMethod === "wallet" ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Wallets</p>
                  <p className="text-sm text-muted-foreground">Paytm, Amazon Pay, etc.</p>
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </div>
            </motion.button>
          </div>

          {/* Order Summary & QR Code */}
          <div className="space-y-4">
            {/* QR Code Section */}
            {paymentMethod === "upi" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border/60 bg-card/60 p-6"
              >
                <h3 className="mb-4 text-center font-semibold">Scan QR Code to Pay</h3>
                <div className="mx-auto w-fit rounded-2xl bg-white p-4">
                  {/* QR Code Placeholder - In production, use a QR library */}
                  <div className="relative size-48">
                    <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-0.5">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-sm ${
                            Math.random() > 0.5 ? "bg-black" : "bg-white"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-lg bg-white p-2">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                          <IndianRupee className="size-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Open any UPI app and scan this code
                </p>
              </motion.div>
            )}

            {/* Order Summary */}
            <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
              <h3 className="mb-4 font-bold">Order Summary</h3>
              
              <div className="mb-4 flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                <MapPin className="mt-0.5 size-4 text-purple-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Delivering to</p>
                  <p className="text-sm text-muted-foreground">{deliveryAddress}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="flex items-center">
                    <IndianRupee className="size-3" />
                    {subtotal.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="flex items-center">
                    <IndianRupee className="size-3" />
                    {deliveryFee.toFixed(0)}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span className="flex items-center">
                      -<IndianRupee className="size-3" />
                      {appliedCoupon.discount.toFixed(0)}
                    </span>
                  </div>
                )}
                <div className="my-2 border-t border-border/60" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="flex items-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    <IndianRupee className="size-4 text-purple-400" />
                    {finalTotal.toFixed(0)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handlePayNow}
                disabled={paymentStatus === "processing" || paymentStatus === "waiting"}
                className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 py-6 text-lg font-bold shadow-lg shadow-purple-500/25"
              >
                {paymentStatus === "processing" ? (
                  <>
                    <Loader2 className="mr-2 size-5 animate-spin" />
                    Processing...
                  </>
                ) : paymentStatus === "waiting" ? (
                  <>
                    <Smartphone className="mr-2 size-5 animate-pulse" />
                    Waiting for approval...
                  </>
                ) : (
                  <>
                    Pay <IndianRupee className="ml-1 size-5" />
                    {finalTotal.toFixed(0)}
                  </>
                )}
              </Button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="size-4 text-green-500" />
                <span>100% Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
