"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react"
import { createClient } from "@/lib/supabase/client"
import type { CartItem, MenuItem, Restaurant, CartState } from "@/lib/types"

interface CartContextType extends CartState {
  addToCart: (menuItem: MenuItem, restaurant: Restaurant, quantity?: number) => Promise<void>
  removeFromCart: (cartItemId: string) => Promise<void>
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [cachedUser, setCachedUser] = useState<{ id: string } | null>(null)

  // Lazy supabase client — avoids throwing during SSR when env vars may not be set
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  const getSupabase = useCallback(() => {
    if (!supabaseRef.current) {
      try {
        supabaseRef.current = createClient()
      } catch {
        return null
      }
    }
    return supabaseRef.current
  }, [])

  const calculateTotals = useCallback(
    (cartItems: CartItem[]) => {
      const subtotal = cartItems.reduce((sum, item) => {
        const price = item.menu_item?.price ?? 0
        return sum + price * item.quantity
      }, 0)
      const deliveryFee = cartItems.length > 0 ? (restaurant?.delivery_fee ?? 2.99) : 0
      const total = subtotal + deliveryFee
      const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
      return { subtotal, deliveryFee, total, itemCount }
    },
    [restaurant]
  )

  const refreshCart = useCallback(async () => {
    const supabase = getSupabase()
    if (!supabase) return
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setItems([])
      setRestaurant(null)
      setCachedUser(null)
      return
    }
    setCachedUser(user)
    setIsLoading(true)
    try {
      const { data: cartItems } = await supabase
        .from("cart_items")
        .select(`*, menu_item:menu_items (*, restaurant:restaurants (*))`)
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })

      if (cartItems && cartItems.length > 0) {
        setItems(cartItems as CartItem[])
        const firstItem = cartItems[0] as CartItem
        if (firstItem.menu_item?.restaurant)
          setRestaurant(firstItem.menu_item.restaurant as Restaurant)
      } else {
        setItems([])
        setRestaurant(null)
      }
    } catch (error) {
      console.error("Error refreshing cart:", error)
    } finally {
      setIsLoading(false)
    }
  }, [getSupabase])

  useEffect(() => {
    const supabase = getSupabase()
    if (!supabase) return
    refreshCart()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => refreshCart())
    return () => subscription.unsubscribe()
  }, [refreshCart, getSupabase])

  const addToCart = async (menuItem: MenuItem, itemRestaurant: Restaurant, quantity = 1) => {
    const supabase = getSupabase()
    if (!supabase) return
    const user = cachedUser
    if (!user) {
      window.location.href = "/auth/login"
      return
    }

    if (restaurant && restaurant.id !== itemRestaurant.id) {
      setItems([])
      setRestaurant(null)
      supabase.from("cart_items").delete().eq("user_id", user.id).then(() => {})
    }

    const existingItem = items.find((item) => item.menu_item_id === menuItem.id)

    if (existingItem) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === existingItem.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      )
    } else {
      const optimisticItem: CartItem = {
        id: `optimistic-${menuItem.id}`,
        user_id: user.id,
        menu_item_id: menuItem.id,
        quantity,
        special_instructions: null,
        created_at: new Date().toISOString(),
        menu_item: { ...menuItem, restaurant: itemRestaurant },
      }
      setItems((prev) => [...prev, optimisticItem])
    }
    setRestaurant(itemRestaurant)

    try {
      if (existingItem) {
        await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + quantity })
          .eq("id", existingItem.id)
      } else {
        const { data } = await supabase
          .from("cart_items")
          .insert({ user_id: user.id, menu_item_id: menuItem.id, quantity })
          .select("id")
          .single()
        if (data)
          setItems((prev) =>
            prev.map((i) =>
              i.id === `optimistic-${menuItem.id}` ? { ...i, id: data.id } : i
            )
          )
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      await refreshCart()
    }
  }

  const removeFromCart = async (cartItemId: string) => {
    const supabase = getSupabase()
    if (!supabase) return
    setItems((prev) => prev.filter((i) => i.id !== cartItemId))
    try {
      await supabase.from("cart_items").delete().eq("id", cartItemId)
    } catch (error) {
      console.error("Error removing from cart:", error)
      await refreshCart()
    }
  }

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId)
      return
    }
    const supabase = getSupabase()
    if (!supabase) return
    setItems((prev) => prev.map((i) => (i.id === cartItemId ? { ...i, quantity } : i)))
    try {
      await supabase.from("cart_items").update({ quantity }).eq("id", cartItemId)
    } catch (error) {
      console.error("Error updating quantity:", error)
      await refreshCart()
    }
  }

  const clearCart = async () => {
    const supabase = getSupabase()
    if (!supabase) return
    const user = cachedUser
    if (!user) return
    setIsLoading(true)
    try {
      await supabase.from("cart_items").delete().eq("user_id", user.id)
      setItems([])
      setRestaurant(null)
    } catch (error) {
      console.error("Error clearing cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const { subtotal, deliveryFee, total, itemCount } = calculateTotals(items)

  return (
    <CartContext.Provider
      value={{
        items,
        restaurant,
        subtotal,
        deliveryFee,
        total,
        itemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) throw new Error("useCart must be used within a CartProvider")
  return context
}
