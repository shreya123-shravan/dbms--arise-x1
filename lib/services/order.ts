// ============================================================================
// Order Service
// ============================================================================

import { createClient } from '@/lib/supabase/client'
import type { Order, OrderStatus } from '@/lib/types'

// Local types for service layer
interface OrderWithDetails extends Omit<Order, 'delivery_address'> {
  delivery_address?: string | Record<string, unknown>
  customer?: Record<string, unknown>
  items?: Array<Record<string, unknown>>
  delivery_tracking?: Record<string, unknown>
}

interface CheckoutData {
  restaurant_id: string
  delivery_address_id: string
  items: Array<{ menu_item_id: string; quantity: number; special_instructions?: string }>
  subtotal: number
  delivery_fee: number
  discount_amount: number
  total_amount: number
  payment_method: string
  special_instructions?: string
}

const supabase = createClient()

/**
 * Get user's orders
 */
export async function getUserOrders(userId: string, limit = 10) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(
        `*,
        customer:users(*),
        restaurant:restaurants(*),
        delivery_address:addresses(*),
        items:order_items(*, menu_item:menu_items(*)),
        delivery_tracking(*)`
      )
      .eq('customer_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return { success: true, data: data as OrderWithDetails[], error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch orders',
    }
  }
}

/**
 * Get order details
 */
export async function getOrderDetails(orderId: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(
        `*,
        customer:users(*),
        restaurant:restaurants(*),
        delivery_address:addresses(*),
        items:order_items(*, menu_item:menu_items(*)),
        delivery_tracking(*)`
      )
      .eq('id', orderId)
      .single()

    if (error) throw error

    return { success: true, data: data as OrderWithDetails, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch order',
    }
  }
}

/**
 * Create order
 */
export async function createOrder(checkoutData: CheckoutData, userId: string) {
  try {
    // Calculate totals
    const { restaurant_id, delivery_address_id, items, subtotal, delivery_fee, discount_amount, total_amount, payment_method, special_instructions } = checkoutData

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: userId,
        restaurant_id,
        delivery_address_id,
        status: 'pending',
        payment_method,
        payment_status: 'pending',
        subtotal,
        delivery_fee,
        discount_amount,
        total_amount,
        special_instructions,
        xp_earned: Math.round(total_amount / 10), // 1 XP per 10 rupees
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Add order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      unit_price: 0, // Will be fetched from menu_item
      special_instructions: item.special_instructions || null,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    // Create delivery tracking
    const { error: trackingError } = await supabase
      .from('delivery_tracking')
      .insert({
        order_id: order.id,
        status: 'unassigned',
      })

    if (trackingError) throw trackingError

    return { success: true, data: order as Order, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to create order',
    }
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error

    return { success: true, data: data as Order, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update order',
    }
  }
}

/**
 * Confirm payment (dummy payment)
 */
export async function confirmPayment(orderId: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({
        payment_status: 'completed',
        status: 'confirmed',
      })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error

    // Award XP to user
    const order = data as Order & { customer_id?: string; xp_earned?: number }
    if (order.customer_id && order.xp_earned) {
      await supabase.rpc('update_user_xp', {
        user_id: order.customer_id,
        xp_amount: order.xp_earned,
      })
    }

    return { success: true, data, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Payment confirmation failed',
    }
  }
}

/**
 * Cancel order
 */
export async function cancelOrder(orderId: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'cancelled', payment_status: 'refunded' })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error

    return { success: true, data: data as Order, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to cancel order',
    }
  }
}

/**
 * Get restaurant orders (for owner)
 */
export async function getRestaurantOrders(restaurantId: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(
        `*,
        customer:users(*),
        delivery_address:addresses(*),
        items:order_items(*)`
      )
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data: data as OrderWithDetails[], error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch orders',
    }
  }
}
