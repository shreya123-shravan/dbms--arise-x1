import { supabase as _supabase } from './supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = _supabase as any
// alias so existing code using `supabase` still works
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = db as any

// ============ USER QUERIES ============

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, updates: {
  username?: string;
  avatar_url?: string;
}) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============ MEAL QUERIES ============

export async function logMeal(userId: string, meal: {
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  image_url?: string;
}) {
  const { data, error } = await supabase
    .from('meals')
    .insert({ user_id: userId, ...meal })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getTodaysMeals(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', `${today}T00:00:00`)
    .order('logged_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getMealsByDateRange(userId: string, startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', startDate)
    .lte('logged_at', endDate)
    .order('logged_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function deleteMeal(mealId: string) {
  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', mealId);
  
  if (error) throw error;
}

// ============ XP & LEVELING ============

export async function addUserXP(userId: string, xpGain: number) {
  const { error } = await db.rpc('update_user_xp', {
    p_user_id: userId,
    p_xp_gain: xpGain
  });
  
  if (error) throw error;
}

// ============ LEADERBOARD ============

export async function getLeaderboard(limit = 50) {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('rank', { ascending: true })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
}

export async function getUserRank(userId: string) {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('rank, total_xp, level')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

// ============ QUESTS ============

export async function getActiveQuests() {
  const { data, error } = await supabase
    .from('quests')
    .select('*')
    .eq('is_active', true)
    .order('quest_type', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function getUserQuestProgress(userId: string) {
  const { data, error } = await supabase
    .from('user_quests')
    .select(`
      *,
      quests (*)
    `)
    .eq('user_id', userId);
  
  if (error) throw error;
  return data || [];
}

export async function updateQuestProgress(
  userId: string,
  questId: string,
  progress: number,
  completed: boolean = false
) {
  const updateData: any = {
    user_id: userId,
    quest_id: questId,
    progress,
    completed
  };

  if (completed) {
    updateData.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('user_quests')
    .upsert(updateData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============ HYDRATION ============

export async function logHydration(userId: string, amountMl: number) {
  const { data, error } = await supabase
    .from('hydration')
    .insert({ user_id: userId, amount_ml: amountMl })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getTodaysHydration(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('hydration')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', `${today}T00:00:00`)
    .order('logged_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

// ============ MOODS ============

export async function logMood(userId: string, mood: 'energized' | 'happy' | 'neutral' | 'tired' | 'stressed', notes?: string) {
  const { data, error } = await supabase
    .from('moods')
    .insert({ user_id: userId, mood, notes })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getTodaysMood(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('moods')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', `${today}T00:00:00`)
    .order('logged_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  
  return data;
}

// ============ WALKS ============

export async function startWalk(userId: string) {
  const { data, error } = await supabase
    .from('walks')
    .insert({
      user_id: userId,
      distance_km: 0,
      started_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function endWalk(walkId: string, distanceKm: number, durationMinutes: number, xpEarned: number) {
  const { data, error } = await supabase
    .from('walks')
    .update({
      distance_km: distanceKm,
      duration_minutes: durationMinutes,
      xp_earned: xpEarned,
      ended_at: new Date().toISOString()
    })
    .eq('id', walkId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getWalkHistory(userId: string, limit = 20) {
  const { data, error } = await supabase
    .from('walks')
    .select('*')
    .eq('user_id', userId)
    .not('ended_at', 'is', null)
    .order('started_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
}

// ============ REAL-TIME SUBSCRIPTIONS ============

export function subscribeToUserProfile(userId: string, callback: (payload: any) => void): RealtimeChannel {
  return supabase
    .channel(`user:${userId}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'users',
      filter: `id=eq.${userId}`
    }, callback)
    .subscribe();
}

export function subscribeToLeaderboard(callback: (payload: any) => void): RealtimeChannel {
  return supabase
    .channel('leaderboard')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'leaderboard'
    }, callback)
    .subscribe();
}

export function subscribeToUserMeals(userId: string, callback: (payload: any) => void): RealtimeChannel {
  return supabase
    .channel(`meals:${userId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'meals',
      filter: `user_id=eq.${userId}`
    }, callback)
    .subscribe();
}

export function unsubscribe(channel: RealtimeChannel) {
  db.removeChannel(channel);
}

// ============ SUBSCRIPTIONS & PAYMENTS ============

export async function getUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data;
}

export async function createSubscription(userId: string, planType: 'free' | 'pro' | 'elite') {
  const expiresAt = planType === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  
  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_type: planType,
      status: planType === 'free' ? 'active' : 'trial',
      expires_at: expiresAt
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateSubscription(
  userId: string,
  updates: {
    plan_type?: 'free' | 'pro' | 'elite';
    status?: 'active' | 'cancelled' | 'expired' | 'trial';
    expires_at?: string | null;
    payment_provider?: string;
    payment_id?: string;
  }
) {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function createPayment(payment: {
  user_id: string;
  subscription_id?: string;
  amount: number;
  currency?: string;
  payment_provider: string;
  payment_id?: string;
  payment_method?: string;
  metadata?: any;
}) {
  const { data, error } = await supabase
    .from('payments')
    .insert(payment)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updatePaymentStatus(
  paymentId: string,
  status: 'pending' | 'completed' | 'failed' | 'refunded'
) {
  const { data, error } = await supabase
    .from('payments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', paymentId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getUserPayments(userId: string, limit = 20) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
}
