// ============================================================================
// Restaurant Service
// ============================================================================

import { createClient } from '@/lib/supabase/client'
import type { Restaurant, MenuItem } from '@/lib/types'

// Local type for service layer
interface RestaurantCategory {
  id: string
  restaurant_id: string
  name: string
  display_order: number
}

const supabase = createClient()

/**
 * Get all restaurants (with filters)
 */
export async function getRestaurants(filters?: {
  city?: string
  cuisine?: string
  search?: string
  isOpen?: boolean
  sortBy?: 'rating' | 'delivery_time' | 'newest'
}) {
  try {
    let query = supabase.from('restaurants').select('*')

    if (filters?.city) {
      query = query.eq('city', filters.city)
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters?.isOpen !== undefined) {
      query = query.eq('is_open', filters.isOpen)
    }

    if (filters?.sortBy === 'rating') {
      query = query.order('rating', { ascending: false })
    } else if (filters?.sortBy === 'delivery_time') {
      query = query.order('estimated_delivery_minutes', { ascending: true })
    } else if (filters?.sortBy === 'newest') {
      query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query

    if (error) throw error

    return { success: true, data: data as Restaurant[], error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch restaurants',
    }
  }
}

/**
 * Get restaurant by ID with menu
 */
export async function getRestaurantDetails(restaurantId: string) {
  try {
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', restaurantId)
      .single()

    if (restaurantError) throw restaurantError

    const { data: categories, error: categoriesError } = await supabase
      .from('restaurant_categories')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('display_order', { ascending: true })

    if (categoriesError) throw categoriesError

    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_available', true)

    if (menuError) throw menuError

    return {
      success: true,
      data: {
        restaurant: restaurant as Restaurant,
        categories: categories as RestaurantCategory[],
        menuItems: menuItems as MenuItem[],
      },
      error: null,
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch restaurant details',
    }
  }
}

/**
 * Get menu items for restaurant
 */
export async function getMenuItems(restaurantId: string, categoryId?: string) {
  try {
    let query = supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_available', true)

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data: data as MenuItem[], error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch menu items',
    }
  }
}

/**
 * Get popular restaurants
 */
export async function getPopularRestaurants(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_open', true)
      .order('rating', { ascending: false })
      .order('review_count', { ascending: false })
      .limit(limit)

    if (error) throw error

    return { success: true, data: data as Restaurant[], error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch popular restaurants',
    }
  }
}

/**
 * Get trending restaurants
 */
export async function getTrendingRestaurants(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_open', true)
      .order('total_orders', { ascending: false })
      .limit(limit)

    if (error) throw error

    return { success: true, data: data as Restaurant[], error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch trending restaurants',
    }
  }
}

/**
 * Search restaurants and items
 */
export async function searchRestaurantsAndItems(query: string) {
  try {
    const { data: restaurants, error: restaurantError } = await supabase
      .from('restaurants')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('rating', { ascending: false })
      .limit(5)

    if (restaurantError) throw restaurantError

    const { data: items, error: itemError } = await supabase
      .from('menu_items')
      .select('*, restaurant_id')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('is_available', true)
      .limit(10)

    if (itemError) throw itemError

    return {
      success: true,
      data: {
        restaurants: restaurants as Restaurant[],
        items: items as MenuItem[],
      },
      error: null,
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Search failed',
    }
  }
}

/**
 * Get restaurant owner's restaurants
 */
export async function getOwnerRestaurants(ownerId: string) {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data: data as Restaurant[], error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch restaurants',
    }
  }
}
