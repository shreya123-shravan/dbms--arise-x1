export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface FoodDeliveryDatabase {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          address: string | null
          city: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone?: string | null
          address?: string | null
          city?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          address?: string | null
          city?: string | null
          created_at?: string
        }
      }
      restaurants: {
        Row: {
          id: string
          name: string
          description: string | null
          address: string
          city: string
          phone: string | null
          image_url: string | null
          rating: number
          is_open: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          address: string
          city: string
          phone?: string | null
          image_url?: string | null
          rating?: number
          is_open?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          address?: string
          city?: string
          phone?: string | null
          image_url?: string | null
          rating?: number
          is_open?: boolean
          created_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          description: string | null
          price: number
          category: string | null
          image_url: string | null
          is_available: boolean
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          description?: string | null
          price: number
          category?: string | null
          image_url?: string | null
          is_available?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          description?: string | null
          price?: number
          category?: string | null
          image_url?: string | null
          is_available?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          restaurant_id: string | null
          status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'
          total_amount: number
          delivery_address: string
          delivery_fee: number
          notes: string | null
          ordered_at: string
          delivered_at: string | null
        }
        Insert: {
          id?: string
          customer_id: string
          restaurant_id?: string | null
          status?: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'
          total_amount: number
          delivery_address: string
          delivery_fee?: number
          notes?: string | null
          ordered_at?: string
          delivered_at?: string | null
        }
        Update: {
          id?: string
          customer_id?: string
          restaurant_id?: string | null
          status?: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'
          total_amount?: number
          delivery_address?: string
          delivery_fee?: number
          notes?: string | null
          ordered_at?: string
          delivered_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          menu_item_id: string | null
          item_name: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          menu_item_id?: string | null
          item_name: string
          quantity?: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          menu_item_id?: string | null
          item_name?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          order_id: string
          customer_id: string
          amount: number
          payment_method: 'card' | 'upi' | 'cash' | 'wallet'
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id: string | null
          paid_at: string
        }
        Insert: {
          id?: string
          order_id: string
          customer_id: string
          amount: number
          payment_method?: 'card' | 'upi' | 'cash' | 'wallet'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string | null
          paid_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          customer_id?: string
          amount?: number
          payment_method?: 'card' | 'upi' | 'cash' | 'wallet'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string | null
          paid_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          customer_id: string
          restaurant_id: string
          order_id: string | null
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          restaurant_id: string
          order_id?: string | null
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          restaurant_id?: string
          order_id?: string | null
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      delivery_tracking: {
        Row: {
          id: string
          order_id: string
          status: string
          location_lat: number | null
          location_lng: number | null
          notes: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          status: string
          location_lat?: number | null
          location_lng?: number | null
          notes?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          status?: string
          location_lat?: number | null
          location_lng?: number | null
          notes?: string | null
          updated_at?: string
        }
      }
    }
  }
}
