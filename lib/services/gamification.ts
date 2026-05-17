// ============================================================================
// Gamification & Rewards Service
// ============================================================================

import { createClient } from '@/lib/supabase/client'
import type { User } from '@/lib/types'

const supabase = createClient()

/**
 * Add XP to user and auto-level up
 */
export async function addXP(userId: string, xpAmount: number) {
  try {
    // Call the Supabase function to update XP and level
    const { data, error } = await supabase.rpc('update_user_xp', {
      user_id: userId,
      xp_amount: xpAmount,
    })

    if (error) throw error

    // Fetch updated user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    return { success: true, data: user as User, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to add XP',
    }
  }
}

/**
 * Add coins/reward points
 */
export async function addCoins(userId: string, coinsAmount: number, reason: string = 'order_completion') {
  try {
    // Use the add_reward_points function
    const { error: rewardError } = await supabase.rpc('add_reward_points', {
      user_id: userId,
      points_amount: coinsAmount,
      reason_text: reason,
    })

    if (rewardError) throw rewardError

    // Fetch updated user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    return { success: true, data: user as User, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to add coins',
    }
  }
}

/**
 * Get user achievements
 */
export async function getUserAchievements(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*, achievement:achievements(*)')
      .eq('user_id', userId)

    if (error) throw error

    return { success: true, data: data as any[], error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch achievements',
    }
  }
}

/**
 * Get available achievements
 */
export async function getAvailableAchievements() {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data: data as any[], error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch achievements',
    }
  }
}

/**
 * Unlock achievement
 */
export async function unlockAchievement(userId: string, achievementId: string) {
  try {
    // Check if already unlocked
    const { data: existing } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single()

    if (existing) {
      return { success: true, data: null, error: null }
    }

    // Get achievement to get rewards
    const { data: achievement } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', achievementId)
      .single()

    if (achievement) {
      // Award XP and coins
      if (achievement.xp_reward > 0) {
        await addXP(userId, achievement.xp_reward)
      }
      if (achievement.coin_reward > 0) {
        await addCoins(userId, achievement.coin_reward, 'achievement_unlock')
      }
    }

    // Unlock achievement
    const { data, error } = await supabase
      .from('user_achievements')
      .insert({ user_id: userId, achievement_id: achievementId })
      .select()
      .single()

    if (error) throw error

    return { success: true, data: data as any, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to unlock achievement',
    }
  }
}

/**
 * Get user stats
 */
export async function getUserStats(userId: string) {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('customer_id', userId)

    if (ordersError) throw ordersError

    const totalSpent = (orders as any[]).reduce((sum, order) => sum + (order.total_amount || 0), 0)

    return {
      success: true,
      data: {
        xp: (user as any).xp,
        level: (user as any).level,
        coins: (user as any).coins,
        lifetime_orders: (user as any).lifetime_orders,
        total_spent: totalSpent,
        average_order_value: (user as any).lifetime_orders > 0 ? totalSpent / (user as any).lifetime_orders : 0,
      },
      error: null,
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch user stats',
    }
  }
}

/**
 * Get leaderboard
 */
export async function getLeaderboard(limit = 100) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, avatar_url, xp, level, coins, lifetime_orders')
      .order('xp', { ascending: false })
      .limit(limit)

    if (error) throw error

    // Add rank
    const leaderboard = (data as any[]).map((user, index) => ({
      ...user,
      rank: index + 1,
    }))

    return { success: true, data: leaderboard, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch leaderboard',
    }
  }
}

/**
 * Get user rank
 */
export async function getUserRank(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('xp')
      .order('xp', { ascending: false })

    if (error) throw error

    const userIndex = (data as any[]).findIndex(u => u.id === userId)
    const rank = userIndex !== -1 ? userIndex + 1 : null

    return { success: true, data: rank, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch user rank',
    }
  }
}
