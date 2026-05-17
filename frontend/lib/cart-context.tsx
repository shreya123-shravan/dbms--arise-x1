"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
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
  const supabase = createClient()

  const calculateTotals = useCallback((cartItems: CartItem[]) => {
    const subtotal = cartItems.reduce((sum, item) => {
      const price = item.menu_item?.price ?? 0
      return sum + price * item.quantity
    }, 0)
    const deliveryFee = cartItems.length > 0 ? (restaurant?.delivery_fee ?? 2.99) : 0
    const total = subtotal + deliveryFee
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    return { subtotal, deliveryFee, total, itemCount }
  }, [restaurant])

  const refreshCart = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setItems([])
      setRestaurant(null)
      return
    }

    setIsLoading(true)
    try {
      const { data: cartItems } = await supabase
        .from("cart_items")
        .select(`
          *,
          menu_item:menu_items (
            *,
            restaurant:restaurants (*)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })

      if (cartItems && cartItems.length > 0) {
        setItems(cartItems as CartItem[])
        // Set restaurant from the first item
        const firstItem = cartItems[0] as CartItem
        if (firstItem.menu_item?.restaurant) {
          setRestaurant(firstItem.menu_item.restaurant as Restaurant)
        }
      } else {
        setItems([])
        setRestaurant(null)
      }
    } catch (error) {
      console.error("Error refreshing cart:", error)
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    refreshCart()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      refreshCart()
    })

    return () => subscription.unsubscribe()
  }, [refreshCart, supabase.auth])

  const addToCart = async (menuItem: MenuItem, itemRestaurant: Restaurant, quantity = 1) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      // Redirect to login
      window.location.href = "/auth/login"
      return
    }

    // Check if adding from a different restaurant
    if (restaurant && restaurant.id !== itemRestaurant.id) {
      // Clear cart first
      await clearCart()
    }

    setIsLoading(true)
    try {
      // Check if item already exists
      const existingItem = items.find(item => item.menu_item_id === menuItem.id)
      
      if (existingItem) {
        // Update quantity
        await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + quantity })
          .eq("id", existingItem.id)
      } else {
        // Insert new item
        await supabase
          .from("cart_items")
          .insert({
            user_id: user.id,
            menu_item_id: menuItem.id,
            quantity,
          })
      }

      setRestaurant(itemRestaurant)
      await refreshCart()
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (cartItemId: string) => {
    setIsLoading(true)
    try {
      await supabase
        .from("cart_items")
        .delete()
        .eq("id", cartItemId)
      
      await refreshCart()
    } catch (error) {
      console.error("Error removing from cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId)
      return
    }

    setIsLoading(true)
    try {
      await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", cartItemId)
      
      await refreshCart()
    } catch (error) {
      console.error("Error updating quantity:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setIsLoading(true)
    try {
      await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
      
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
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
