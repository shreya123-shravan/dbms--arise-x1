"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  UtensilsCrossed,
  MapPin,
  Clock,
  Tag,
  Percent,
  IndianRupee,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BottomNav } from "@/components/bottom-nav"
import { useCart } from "@/lib/cart-context"

export default function CartPage() {
  const router = useRouter()
  const {
    items,
    restaurant,
    subtotal,
    deliveryFee,
    total,
    itemCount,
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoading,
  } = useCart()

  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null)

  const handleApplyCoupon = () => {
    // Dummy coupon logic
    if (couponCode.toUpperCase() === "WELCOME50") {
      const discount = Math.min(subtotal * 0.5, 150)
      setAppliedCoupon({ code: "WELCOME50", discount })
    } else if (couponCode.toUpperCase() === "SAVE100") {
      if (subtotal >= 499) {
        setAppliedCoupon({ code: "SAVE100", discount: 100 })
      }
    } else if (couponCode.toUpperCase() === "FREEDEL") {
      if (subtotal >= 299) {
        setAppliedCoupon({ code: "FREEDEL", discount: deliveryFee })
      }
    }
  }

  const finalTotal = appliedCoupon ? total - appliedCoupon.discount : total

  const handleProceedToCheckout = () => {
    if (!deliveryAddress.trim()) {
      alert("Please enter a delivery address")
      return
    }
    // Store data in session storage for checkout
    sessionStorage.setItem("deliveryAddress", deliveryAddress)
    sessionStorage.setItem("specialInstructions", specialInstructions)
    sessionStorage.setItem("appliedCoupon", JSON.stringify(appliedCoupon))
    sessionStorage.setItem("finalTotal", finalTotal.toString())
    router.push("/checkout")
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-background pb-20">
        <header className="sticky top-0 z-30 border-b border-border/40 glass-strong">
          <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
            <Link
              href="/"
              className="flex size-10 items-center justify-center rounded-full bg-secondary/80 transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <h1 className="text-lg font-bold">Your Cart</h1>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <ShoppingBag className="size-12 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold">Your cart is empty</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              Looks like you haven&apos;t added anything to your cart yet. Start exploring delicious options!
            </p>
            <Button asChild className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600">
              <Link href="/">Browse Restaurants</Link>
            </Button>
          </motion.div>
        </main>

        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-40 md:pb-20">
      <header className="sticky top-0 z-30 border-b border-border/40 glass-strong">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex size-10 items-center justify-center rounded-full bg-secondary/80 transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <h1 className="text-lg font-bold">Your Cart</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearCart()}
            className="text-destructive hover:text-destructive"
            disabled={isLoading}
          >
            <Trash2 className="mr-1 size-4" />
            Clear
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Restaurant Info */}
            {restaurant && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 p-3"
              >
                <div className="relative size-14 overflow-hidden rounded-lg">
                  {restaurant.image_url ? (
                    <Image
                      src={restaurant.image_url}
                      alt={restaurant.name}
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
                  <span className="font-semibold">{restaurant.name}</span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    {restaurant.delivery_time_min}-{restaurant.delivery_time_max} min delivery
                  </span>
                </div>
              </motion.div>
            )}

            {/* Items */}
            <div className="flex flex-col gap-3">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-3 rounded-xl border border-border/60 bg-card/60 p-3"
                >
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
                    {item.menu_item?.image_url ? (
                      <Image
                        src={item.menu_item.image_url}
                        alt={item.menu_item?.name ?? ""}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <UtensilsCrossed className="size-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold leading-tight">
                        {item.menu_item?.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-muted-foreground hover:text-destructive"
                        disabled={isLoading}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <span className="flex items-center text-sm font-bold text-primary">
                      <IndianRupee className="size-3.5" />
                      {((item.menu_item?.price ?? 0) * item.quantity).toFixed(0)}
                    </span>

                    <div className="mt-auto flex items-center gap-2 pt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex size-8 items-center justify-center rounded-full border border-border/60 bg-secondary/50 hover:bg-secondary disabled:opacity-50"
                        disabled={isLoading}
                      >
                        <Minus className="size-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex size-8 items-center justify-center rounded-full border border-border/60 bg-secondary/50 hover:bg-secondary disabled:opacity-50"
                        disabled={isLoading}
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Coupon Section */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <Tag className="size-4 text-primary" />
                Apply Coupon
              </h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="bg-card/60 uppercase"
                />
                <Button 
                  variant="outline" 
                  onClick={handleApplyCoupon}
                  disabled={!couponCode}
                >
                  Apply
                </Button>
              </div>
              {appliedCoupon && (
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-green-500/10 p-2 text-sm text-green-500">
                  <Percent className="size-4" />
                  <span>Coupon {appliedCoupon.code} applied! You save Rs.{appliedCoupon.discount.toFixed(0)}</span>
                </div>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {["WELCOME50", "SAVE100", "FREEDEL"].map((code) => (
                  <button
                    key={code}
                    onClick={() => setCouponCode(code)}
                    className="rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-400 hover:bg-purple-500/20"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Delivery Address */}
            <div className="mt-6">
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <MapPin className="size-4 text-primary" />
                Delivery Address
              </h3>
              <Input
                placeholder="Enter your complete delivery address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="bg-card/60"
              />
            </div>

            {/* Special Instructions */}
            <div className="mt-4">
              <h3 className="mb-3 font-semibold">Special Instructions (Optional)</h3>
              <Textarea
                placeholder="Any special requests for your order..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="bg-card/60"
                rows={2}
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur"
            >
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                <Sparkles className="size-5 text-purple-400" />
                Order Summary
              </h3>

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal ({itemCount} item{itemCount !== 1 && "s"})
                  </span>
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
                    <span>Coupon Discount</span>
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

              {restaurant && restaurant.min_order > subtotal && (
                <p className="mt-4 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                  Minimum order is Rs.{restaurant.min_order.toFixed(0)}. Add Rs.
                  {(restaurant.min_order - subtotal).toFixed(0)} more to checkout.
                </p>
              )}

              <Button
                onClick={handleProceedToCheckout}
                disabled={
                  isLoading ||
                  !deliveryAddress.trim() ||
                  (restaurant ? subtotal < restaurant.min_order : false)
                }
                className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 font-bold shadow-lg shadow-purple-500/25"
                size="lg"
              >
                Proceed to Payment
              </Button>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                Pay via UPI, Cards, or Net Banking
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
