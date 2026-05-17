export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          level: number
          xp: number
          total_xp: number
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          level?: number
          xp?: number
          total_xp?: number
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          level?: number
          xp?: number
          total_xp?: number
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      meals: {
        Row: {
          id: string
          user_id: string
          name: string
          calories: number
          protein: number | null
          carbs: number | null
          fat: number | null
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          image_url: string | null
          logged_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          calories: number
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          image_url?: string | null
          logged_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          calories?: number
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          image_url?: string | null
          logged_at?: string
          created_at?: string
        }
      }
      quests: {
        Row: {
          id: string
          title: string
          description: string | null
          xp_reward: number
          quest_type: 'daily' | 'weekly' | 'special'
          category: string | null
          target_value: number | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          xp_reward: number
          quest_type: 'daily' | 'weekly' | 'special'
          category?: string | null
          target_value?: number | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          xp_reward?: number
          quest_type?: 'daily' | 'weekly' | 'special'
          category?: string | null
          target_value?: number | null
          is_active?: boolean
          created_at?: string
        }
      }
      user_quests: {
        Row: {
          id: string
          user_id: string
          quest_id: string
          progress: number
          completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          quest_id: string
          progress?: number
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          quest_id?: string
          progress?: number
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
      }
      hydration: {
        Row: {
          id: string
          user_id: string
          amount_ml: number
          logged_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount_ml: number
          logged_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount_ml?: number
          logged_at?: string
        }
      }
      leaderboard: {
        Row: {
          id: string
          user_id: string
          username: string
          total_xp: number
          level: number
          rank: number | null
          avatar_url: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          total_xp: number
          level: number
          rank?: number | null
          avatar_url?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          total_xp?: number
          level?: number
          rank?: number | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      moods: {
        Row: {
          id: string
          user_id: string
          mood: 'energized' | 'happy' | 'neutral' | 'tired' | 'stressed'
          notes: string | null
          logged_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mood: 'energized' | 'happy' | 'neutral' | 'tired' | 'stressed'
          notes?: string | null
          logged_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mood?: 'energized' | 'happy' | 'neutral' | 'tired' | 'stressed'
          notes?: string | null
          logged_at?: string
        }
      }
      walks: {
        Row: {
          id: string
          user_id: string
          distance_km: number
          duration_minutes: number | null
          xp_earned: number | null
          route_data: Json | null
          started_at: string
          ended_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          distance_km: number
          duration_minutes?: number | null
          xp_earned?: number | null
          route_data?: Json | null
          started_at: string
          ended_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          distance_km?: number
          duration_minutes?: number | null
          xp_earned?: number | null
          route_data?: Json | null
          started_at?: string
          ended_at?: string | null
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_type: 'free' | 'pro' | 'elite'
          status: 'active' | 'cancelled' | 'expired' | 'trial'
          started_at: string
          expires_at: string | null
          payment_provider: string | null
          payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_type?: 'free' | 'pro' | 'elite'
          status?: 'active' | 'cancelled' | 'expired' | 'trial'
          started_at?: string
          expires_at?: string | null
          payment_provider?: string | null
          payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_type?: 'free' | 'pro' | 'elite'
          status?: 'active' | 'cancelled' | 'expired' | 'trial'
          started_at?: string
          expires_at?: string | null
          payment_provider?: string | null
          payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          subscription_id: string | null
          amount: number
          currency: string
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_provider: string
          payment_id: string | null
          payment_method: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subscription_id?: string | null
          amount: number
          currency?: string
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_provider: string
          payment_id?: string | null
          payment_method?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subscription_id?: string | null
          amount?: number
          currency?: string
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_provider?: string
          payment_id?: string | null
          payment_method?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      update_user_xp: {
        Args: {
          p_user_id: string
          p_xp_gain: number
        }
        Returns: void
      }
      refresh_leaderboard_ranks: {
        Args: Record<string, never>
        Returns: void
      }
    }
  }
}
