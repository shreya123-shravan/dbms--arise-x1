// ============================================================================
// User & Profile Service
// ============================================================================

import { createClient } from '@/lib/supabase/client'
import type { User, Address } from '@/lib/types'

const supabase = createClient()

/**
 * Get user profile
 */
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error

    return { success: true, data: data as User, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch user profile',
    }
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: Partial<User>) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    return { success: true, data: data as User, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update profile',
    }
  }
}

/**
 * Get user addresses
 */
export async function getUserAddresses(userId: string) {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })

    if (error) throw error

    return { success: true, data: data as Address[], error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch addresses',
    }
  }
}

/**
 * Add address
 */
export async function addAddress(userId: string, address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .insert({
        user_id: userId,
        ...address,
      })
      .select()
      .single()

    if (error) throw error

    return { success: true, data: data as Address, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to add address',
    }
  }
}

/**
 * Update address
 */
export async function updateAddress(addressId: string, updates: Partial<Address>) {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .update(updates)
      .eq('id', addressId)
      .select()
      .single()

    if (error) throw error

    return { success: true, data: data as Address, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update address',
    }
  }
}

/**
 * Delete address
 */
export async function deleteAddress(addressId: string) {
  try {
    const { error } = await supabase.from('addresses').delete().eq('id', addressId)

    if (error) throw error

    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete address',
    }
  }
}

/**
 * Set default address
 */
export async function setDefaultAddress(userId: string, addressId: string) {
  try {
    // Clear existing default
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId)

    // Set new default
    const { data, error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', addressId)
      .select()
      .single()

    if (error) throw error

    return { success: true, data: data as Address, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to set default address',
    }
  }
}

/**
 * Get default address
 */
export async function getDefaultAddress(userId: string) {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .eq('is_default', true)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows

    return { success: true, data: data ? (data as Address) : null, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch default address',
    }
  }
}

/**
 * Get user notifications
 */
export async function getUserNotifications(userId: string, limit = 20) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return { success: true, data: data as any[], error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch notifications',
    }
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    if (error) throw error

    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mark notification as read',
    }
  }
}

/**
 * Send notification
 */
export async function sendNotification(userId: string, notification: any) {
  try {
    const { error } = await supabase.from('notifications').insert({
      user_id: userId,
      ...notification,
    })

    if (error) throw error

    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send notification',
    }
  }
}
