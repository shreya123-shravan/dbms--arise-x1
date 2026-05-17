// ============================================================================
// Cart Service
// ============================================================================

import { createClient } from '@/lib/supabase/client'
import type { CartItem, Restaurant, MenuItem } from '@/lib/types'

// Local types for service layer
interface CartItemWithDetails extends CartItem {
  menu_item?: MenuItem & { restaurant?: Restaurant }
}

interface CartSummary {
  items: CartItemWithDetails[]
  restaurant: Restaurant
  subtotal: number
  delivery_fee: number
  discount_amount: number
  total_amount: number
  item_count: number
}

const supabase = createClient()

/**
 * Get user's cart
 */
export async function getCart(userId: string) {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(
        `*,
        menu_item:menu_items(*),
        restaurant:restaurants(*)`
      )
      .eq('user_id', userId)

    if (error) throw error

    // Group by restaurant
    const cartByRestaurant = (data as any[]).reduce(
      (acc, item) => {
        if (!acc[item.restaurant_id]) {
          acc[item.restaurant_id] = {
            restaurant: item.restaurant,
            items: [],
          }
        }
        acc[item.restaurant_id].items.push(item)
        return acc
      },
      {} as Record<string, any>
    )

    return { success: true, data: cartByRestaurant, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch cart',
    }
  }
}

/**
 * Get cart for specific restaurant
 */
export async function getRestaurantCart(userId: string, restaurantId: string) {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, menu_item:menu_items(*)')
      .eq('user_id', userId)
      .eq('restaurant_id', restaurantId)

    if (error) throw error

    // Get restaurant details
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', restaurantId)
      .single()

    if (restaurantError) throw restaurantError

    // Calculate totals
    const items = data as CartItemWithDetails[]
    const subtotal = items.reduce((sum, item) => sum + (item.menu_item?.price || 0) * item.quantity, 0)

    return {
      success: true,
      data: {
        items,
        restaurant: restaurant as Restaurant,
        subtotal,
        delivery_fee: (restaurant as any).delivery_fee || 0,
        discount_amount: 0,
        total_amount: subtotal + ((restaurant as any).delivery_fee || 0),
        item_count: items.reduce((sum, item) => sum + item.quantity, 0),
      } as CartSummary,
      error: null,
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch cart',
    }
  }
}

/**
 * Add item to cart
 */
export async function addToCart(
  userId: string,
  restaurantId: string,
  menuItemId: string,
  quantity: number,
  specialInstructions?: string
) {
  try {
    // Clear cart if switching restaurants
    const { data: existingCart } = await supabase
      .from('cart_items')
      .select('restaurant_id')
      .eq('user_id', userId)
      .limit(1)

    if (existingCart && existingCart.length > 0 && existingCart[0].restaurant_id !== restaurantId) {
      await supabase.from('cart_items').delete().eq('user_id', userId)
    }

    // Upsert cart item
    const { data, error } = await supabase
      .from('cart_items')
      .upsert(
        {
          user_id: userId,
          restaurant_id: restaurantId,
          menu_item_id: menuItemId,
          quantity,
          special_instructions: specialInstructions || null,
        },
        { onConflict: 'user_id,restaurant_id,menu_item_id' }
      )
      .select()
      .single()

    if (error) throw error

    return { success: true, data: data as CartItem, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to add to cart',
    }
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(
  cartItemId: string,
  quantity: number,
  specialInstructions?: string
) {
  try {
    if (quantity <= 0) {
      // Delete if quantity is 0
      const { error } = await supabase.from('cart_items').delete().eq('id', cartItemId)
      if (error) throw error
      return { success: true, data: null, error: null }
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity, special_instructions: specialInstructions || null })
      .eq('id', cartItemId)
      .select()
      .single()

    if (error) throw error

    return { success: true, data: data as CartItem, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update cart item',
    }
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(cartItemId: string) {
  try {
    const { error } = await supabase.from('cart_items').delete().eq('id', cartItemId)

    if (error) throw error

    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove item',
    }
  }
}

/**
 * Clear cart for restaurant
 */
export async function clearCart(userId: string, restaurantId?: string) {
  try {
    let query = supabase.from('cart_items').delete().eq('user_id', userId)

    if (restaurantId) {
      query = query.eq('restaurant_id', restaurantId)
    }

    const { error } = await query

    if (error) throw error

    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to clear cart',
    }
  }
}

/**
 * Get cart count
 */
export async function getCartCount(userId: string) {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', userId)

    if (error) throw error

    const count = (data as any[]).reduce((sum, item) => sum + item.quantity, 0)

    return { success: true, data: count, error: null }
  } catch (error) {
    return {
      success: false,
      data: 0,
      error: error instanceof Error ? error.message : 'Failed to get cart count',
    }
  }
}
