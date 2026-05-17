/**
 * Core type definitions for ARISE Food Delivery
 * AI-powered food delivery with gamification
 */

export type Mood = "energized" | "stressed" | "tired" | "happy" | "neutral" | "hungry" | "adventurous"
export type MealType = "breakfast" | "lunch" | "dinner" | "snack" | "late_night"
export type OrderStatus = "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled"

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  default_address: string | null
  created_at: string
  updated_at: string
}

export interface Restaurant {
  id: string
  name: string
  description: string | null
  image_url: string | null
  cuisine_type: string
  rating: number
  delivery_time_min: number
  delivery_time_max: number
  delivery_fee: number
  min_order: number
  is_featured: boolean
  is_active: boolean
  address: string | null
  created_at: string
}

export interface MenuItem {
  id: string
  restaurant_id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category: string
  is_vegetarian: boolean
  is_vegan: boolean
  is_spicy: boolean
  is_available: boolean
  calories: number | null
  created_at: string
}

export interface CartItem {
  id: string
  user_id: string
  menu_item_id: string
  quantity: number
  special_instructions: string | null
  created_at: string
  // Joined data
  menu_item?: MenuItem & { restaurant?: Restaurant }
}

export interface Order {
  id: string
  user_id: string
  restaurant_id: string
  status: OrderStatus
  subtotal: number
  delivery_fee: number
  total: number
  delivery_address: string
  special_instructions: string | null
  stripe_session_id: string | null
  estimated_delivery: string | null
  created_at: string
  updated_at: string
  // Joined data
  restaurant?: Restaurant
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string
  quantity: number
  unit_price: number
  subtotal: number
  special_instructions: string | null
  // Joined data
  menu_item?: MenuItem
}

export interface Favorite {
  id: string
  user_id: string
  restaurant_id: string
  created_at: string
  // Joined data
  restaurant?: Restaurant
}

export interface Category {
  id: string
  name: string
  icon: string | null
  image_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
}

export interface DeliveryPartner {
  id: string
  user_id: string | null
  name: string
  phone: string
  vehicle_type: string
  vehicle_number: string | null
  avatar_url: string | null
  rating: number
  total_deliveries: number
  is_available: boolean
  current_location_lat: number | null
  current_location_lng: number | null
  created_at: string
}

export interface Address {
  id: string
  user_id: string
  label: string
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  pincode: string
  latitude: number | null
  longitude: number | null
  is_default: boolean
  created_at: string
}

export interface Payment {
  id: string
  order_id: string | null
  user_id: string
  amount: number
  payment_method: string
  transaction_id: string | null
  status: "pending" | "processing" | "completed" | "failed"
  qr_code_data: string | null
  paid_at: string | null
  created_at: string
}

export interface Review {
  id: string
  user_id: string
  restaurant_id: string | null
  order_id: string | null
  rating: number
  comment: string | null
  food_rating: number | null
  delivery_rating: number | null
  created_at: string
  // Joined data
  profile?: Profile
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  is_read: boolean
  data: Record<string, unknown> | null
  created_at: string
}

export interface Coupon {
  id: string
  code: string
  description: string | null
  discount_type: "percentage" | "fixed"
  discount_value: number
  min_order_value: number
  max_discount: number | null
  valid_from: string
  valid_until: string | null
  usage_limit: number | null
  used_count: number
  is_active: boolean
  created_at: string
}

export type DeliveryStatus = 
  | "pending"
  | "confirmed" 
  | "cooking"
  | "food_ready"
  | "picked_up"
  | "on_the_way"
  | "near_location"
  | "delivered"

// AI Recommendation types
export interface FoodRecommendation {
  menu_item: MenuItem
  restaurant: Restaurant
  reason: string
  match_score: number
}

export interface ContextSignals {
  timeOfDay: "morning" | "afternoon" | "evening" | "night"
  dayOfWeek: string
  mood: Mood
  weather?: string
}

// Cart context types
export interface CartState {
  items: CartItem[]
  restaurant: Restaurant | null
  subtotal: number
  deliveryFee: number
  total: number
  itemCount: number
}

// Legacy types kept for compatibility
export type HealthGoal = "weight_loss" | "muscle_gain" | "energy" | "gut_health" | "balanced"
export type Diet = "vegetarian" | "vegan" | "non_vegetarian" | "jain" | "keto"
export type Language = "en" | "hi" | "ta" | "kn" | "te"

export interface User {
  uid: string
  displayName: string
  email: string
  xp: number
  level: number
  coins: number
  streak: number
  steps: number
  stepsTarget: number
  healthGoal: HealthGoal
  dietaryPreference: Diet
  cuisinePreference: string[]
  preferredLanguage: Language
  badges: string[]
  mealsLogged: number
  hydrationGlasses: number
  hydrationTarget: number
}

export interface Meal {
  id: string
  meal_name: string
  image?: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  fiber_g: number
  health_score: number
  xp_reward: number
  reason: string
  preparation_time_min: number
  ingredients: string[]
  tags: string[]
  cuisine: string
  meal_type: MealType
}

export interface LeaderboardEntry {
  userId: string
  displayName: string
  xp: number
  level: number
  streak: number
  rank: number
  isYou?: boolean
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
}

export interface Challenge {
  id: string
  title: string
  description: string
  type: "daily" | "weekly"
  xpReward: number
  coinReward: number
  progress: number
  target: number
  isGroupChallenge: boolean
  participants?: number
}

export interface BehaviorInsight {
  id: string
  title: string
  body: string
  severity: "info" | "warn" | "good"
}

export type QuestCategory = "nutrition" | "movement" | "hydration" | "mindfulness"
export type QuestDifficulty = "easy" | "medium" | "hard"
export type QuestStatus = "active" | "ready" | "claimed"

export interface Quest {
  id: string
  title: string
  description: string
  category: QuestCategory
  difficulty: QuestDifficulty
  xpReward: number
  coinReward: number
  progress: number
  target: number
  status: QuestStatus
  actionLabel: string
}

export type SpotKind = "produce" | "hydration" | "jog" | "cafe" | "yoga" | "market"

export interface WalkSpot {
  id: string
  name: string
  kind: SpotKind
  x: number
  y: number
  distanceM: number
  xpReward: number
  coinReward: number
  blurb: string
  claimed: boolean
}
