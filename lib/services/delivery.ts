// ============================================================================
// Delivery Service
// ============================================================================

import { createClient } from '@/lib/supabase/client'
import type { DeliveryStatus } from '@/lib/types'

// Local type for service layer
interface DeliveryTracking {
  id: string
  order_id: string
  delivery_agent_id?: string
  status: DeliveryStatus
  current_latitude?: number
  current_longitude?: number
  pickup_time?: string
  actual_delivery_time?: string
  updated_at?: string
}

const supabase = createClient()

/**
 * Get delivery tracking for order
 */
export async function getDeliveryTracking(orderId: string) {
  try {
    const { data, error } = await supabase
      .from('delivery_tracking')
      .select(`*, delivery_agent:delivery_agents(*)`)
      .eq('order_id', orderId)
      .single()

    if (error) throw error

    return { success: true, data: data as DeliveryTracking, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch delivery tracking',
    }
  }
}

/**
 * Update delivery location (for delivery partner)
 */
export async function updateDeliveryLocation(
  trackingId: string,
  latitude: number,
  longitude: number
) {
  try {
    const { data, error } = await supabase
      .from('delivery_tracking')
      .update({
        current_latitude: latitude,
        current_longitude: longitude,
        updated_at: new Date().toISOString(),
      })
      .eq('id', trackingId)
      .select()
      .single()

    if (error) throw error

    // Also update delivery agent location
    const tracking = data as DeliveryTracking
    if (tracking.delivery_agent_id) {
      await supabase
        .from('delivery_agents')
        .update({
          current_latitude: latitude,
          current_longitude: longitude,
          last_location_update: new Date().toISOString(),
        })
        .eq('id', tracking.delivery_agent_id)
    }

    return { success: true, data: data as DeliveryTracking, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update delivery location',
    }
  }
}

/**
 * Assign delivery agent
 */
export async function assignDeliveryAgent(trackingId: string, agentId: string) {
  try {
    const { data, error } = await supabase
      .from('delivery_tracking')
      .update({
        delivery_agent_id: agentId,
        status: 'assigned',
        updated_at: new Date().toISOString(),
      })
      .eq('id', trackingId)
      .select()
      .single()

    if (error) throw error

    return { success: true, data: data as DeliveryTracking, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to assign delivery agent',
    }
  }
}

/**
 * Update delivery status
 */
export async function updateDeliveryStatus(trackingId: string, newStatus: DeliveryStatus) {
  try {
    const updateData: Record<string, any> = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    }

    if (newStatus === 'picked_up') {
      updateData.pickup_time = new Date().toISOString()
    } else if (newStatus === 'delivered') {
      updateData.actual_delivery_time = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('delivery_tracking')
      .update(updateData)
      .eq('id', trackingId)
      .select()
      .single()

    if (error) throw error

    // Update order status based on delivery status
    const tracking = data as DeliveryTracking
    const orderStatusMap: Record<DeliveryStatus, string> = {
      pending: 'confirmed',
      confirmed: 'confirmed',
      cooking: 'preparing',
      food_ready: 'preparing',
      picked_up: 'picked_up',
      on_the_way: 'on_the_way',
      near_location: 'on_the_way',
      delivered: 'delivered',
    }

    await supabase
      .from('orders')
      .update({ status: orderStatusMap[newStatus] })
      .eq('id', tracking.order_id)

    return { success: true, data: data as DeliveryTracking, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update delivery status',
    }
  }
}

/**
 * Get available delivery agents
 */
export async function getAvailableDeliveryAgents() {
  try {
    const { data, error } = await supabase
      .from('delivery_agents')
      .select('*')
      .eq('is_active', true)
      .order('total_deliveries', { ascending: true })

    if (error) throw error

    return { success: true, data: data as any[], error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch delivery agents',
    }
  }
}

/**
 * Get delivery agent's active deliveries
 */
export async function getAgentActiveDeliveries(agentId: string) {
  try {
    const { data, error } = await supabase
      .from('delivery_tracking')
      .select(`*, order:orders(*)`)
      .eq('delivery_agent_id', agentId)
      .in('status', ['assigned', 'picked_up', 'on_the_way'])

    if (error) throw error

    return { success: true, data: data as any[], error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch active deliveries',
    }
  }
}

/**
 * Estimate delivery time
 */
export async function estimateDeliveryTime(
  pickupLatitude: number,
  pickupLongitude: number,
  deliveryLatitude: number,
  deliveryLongitude: number
) {
  try {
    // Simplified distance calculation (Haversine formula)
    const toRad = (value: number) => (value * Math.PI) / 180
    const R = 6371 // Earth's radius in km

    const lat1 = toRad(pickupLatitude)
    const lat2 = toRad(deliveryLatitude)
    const deltaLat = toRad(deliveryLatitude - pickupLatitude)
    const deltaLon = toRad(deliveryLongitude - pickupLongitude)

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // Distance in km

    // Assuming average speed of 25 km/h in traffic
    const timeInMinutes = Math.ceil((distance / 25) * 60)

    return {
      success: true,
      data: {
        distanceKm: distance.toFixed(2),
        estimatedMinutes: timeInMinutes,
      },
      error: null,
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to estimate delivery time',
    }
  }
}
