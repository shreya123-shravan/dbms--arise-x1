-- ============================================================================
-- ARISE-X1 Food Delivery Platform - PostgreSQL Schema
-- Supabase Database Schema
-- ============================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE user_role AS ENUM ('customer', 'restaurant_owner', 'delivery_partner', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'on_the_way', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE delivery_status AS ENUM ('unassigned', 'assigned', 'picked_up', 'on_the_way', 'delivered', 'cancelled');

-- ============================================================================
-- USERS TABLE
-- ============================================================================

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone_number TEXT UNIQUE,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'customer',

  -- Gamification
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  coins INTEGER DEFAULT 0,
  lifetime_orders INTEGER DEFAULT 0,

  -- Account
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT xp_non_negative CHECK (xp >= 0),
  CONSTRAINT coins_non_negative CHECK (coins >= 0)
);

-- ============================================================================
-- ADDRESSES TABLE
-- ============================================================================

CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  label TEXT, -- 'Home', 'Work', 'Other'
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- RESTAURANTS TABLE
-- ============================================================================

CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  cuisine_types TEXT[] NOT NULL, -- ['Indian', 'Chinese', 'Pizza']
  rating DECIMAL(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,

  -- Location
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,

  -- Operations
  opening_time TIME,
  closing_time TIME,
  is_open BOOLEAN DEFAULT TRUE,
  estimated_delivery_minutes INTEGER DEFAULT 30,
  minimum_order_amount DECIMAL(10, 2) DEFAULT 0,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,

  -- Gamification
  total_orders INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT rating_range CHECK (rating >= 0 AND rating <= 5)
);

-- ============================================================================
-- RESTAURANT CATEGORIES TABLE
-- ============================================================================

CREATE TABLE restaurant_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,

  name TEXT NOT NULL, -- 'Appetizers', 'Main Course', 'Desserts'
  description TEXT,
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(restaurant_id, name)
);

-- ============================================================================
-- MENU ITEMS TABLE
-- ============================================================================

CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES restaurant_categories(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,

  price DECIMAL(10, 2) NOT NULL,
  discounted_price DECIMAL(10, 2),

  -- Nutritional info
  calories INTEGER,
  vegetarian BOOLEAN DEFAULT FALSE,
  vegan BOOLEAN DEFAULT FALSE,
  spice_level INTEGER, -- 1-5

  -- Stock management
  is_available BOOLEAN DEFAULT TRUE,
  stock_count INTEGER DEFAULT -1, -- -1 means unlimited

  -- Gamification
  popularity_score DECIMAL(3, 2) DEFAULT 0,
  times_ordered INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT price_positive CHECK (price > 0)
);

-- ============================================================================
-- ORDERS TABLE
-- ============================================================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE RESTRICT,
  delivery_address_id UUID NOT NULL REFERENCES addresses(id) ON DELETE RESTRICT,

  status order_status DEFAULT 'pending',

  -- Pricing
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,

  -- Payment
  payment_method TEXT, -- 'credit_card', 'debit_card', 'upi', 'wallet'
  payment_status payment_status DEFAULT 'pending',

  -- Gamification
  xp_earned INTEGER DEFAULT 0,

  -- Timing
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  prepared_at TIMESTAMP WITH TIME ZONE,
  picked_up_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,

  -- Special requests
  special_instructions TEXT,

  CONSTRAINT total_amount_positive CHECK (total_amount > 0)
);

-- ============================================================================
-- ORDER ITEMS TABLE
-- ============================================================================

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE RESTRICT,

  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  special_instructions TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT quantity_positive CHECK (quantity > 0),
  CONSTRAINT unit_price_positive CHECK (unit_price >= 0)
);

-- ============================================================================
-- CART ITEMS TABLE
-- ============================================================================

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,

  quantity INTEGER NOT NULL DEFAULT 1,
  special_instructions TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT quantity_positive CHECK (quantity > 0),
  UNIQUE(user_id, restaurant_id, menu_item_id)
);

-- ============================================================================
-- DELIVERY AGENTS TABLE
-- ============================================================================

CREATE TABLE delivery_agents (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

  license_number TEXT UNIQUE,
  vehicle_type TEXT NOT NULL, -- 'bike', 'scooter', 'car'
  vehicle_number TEXT UNIQUE,

  is_active BOOLEAN DEFAULT TRUE,
  current_latitude DECIMAL(10, 8),
  current_longitude DECIMAL(11, 8),
  last_location_update TIMESTAMP WITH TIME ZONE,

  total_deliveries INTEGER DEFAULT 0,
  rating DECIMAL(2, 1) DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- DELIVERY TRACKING TABLE
-- ============================================================================

CREATE TABLE delivery_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  delivery_agent_id UUID REFERENCES delivery_agents(id) ON DELETE SET NULL,

  status delivery_status DEFAULT 'unassigned',

  pickup_latitude DECIMAL(10, 8),
  pickup_longitude DECIMAL(11, 8),
  pickup_time TIMESTAMP WITH TIME ZONE,

  current_latitude DECIMAL(10, 8),
  current_longitude DECIMAL(11, 8),

  destination_latitude DECIMAL(10, 8),
  destination_longitude DECIMAL(11, 8),

  estimated_arrival_time TIMESTAMP WITH TIME ZONE,
  actual_delivery_time TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- REVIEWS TABLE
-- ============================================================================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  rating INTEGER NOT NULL,
  comment TEXT,

  food_quality_rating INTEGER,
  packaging_rating INTEGER,
  delivery_rating INTEGER,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5),
  UNIQUE(order_id, reviewer_id)
);

-- ============================================================================
-- REWARD POINTS TABLE
-- ============================================================================

CREATE TABLE reward_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  points INTEGER NOT NULL,
  reason TEXT, -- 'order_completion', 'review', 'referral', 'achievement'
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'order_update', 'delivery', 'promotion', 'reward'
  related_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,

  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ACHIEVEMENTS TABLE
-- ============================================================================

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  requirement_type TEXT NOT NULL, -- 'orders_count', 'total_spent', 'streak', etc
  requirement_value INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 0,
  coin_reward INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- USER ACHIEVEMENTS TABLE (Many-to-many)
-- ============================================================================

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,

  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, achievement_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_restaurants_city ON restaurants(city);
CREATE INDEX idx_restaurants_owner_id ON restaurants(owner_id);
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_restaurant_id ON cart_items(restaurant_id);
CREATE INDEX idx_delivery_agents_active ON delivery_agents(is_active);
CREATE INDEX idx_delivery_tracking_order_id ON delivery_tracking(order_id);
CREATE INDEX idx_delivery_tracking_agent_id ON delivery_tracking(delivery_agent_id);
CREATE INDEX idx_reviews_order_id ON reviews(order_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_agents ENABLE ROW LEVEL SECURITY;

-- USERS RLS
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- ADDRESSES RLS
CREATE POLICY "Users can view own addresses" ON addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own addresses" ON addresses
  FOR ALL USING (auth.uid() = user_id);

-- RESTAURANTS RLS
CREATE POLICY "Anyone can view restaurants" ON restaurants
  FOR SELECT USING (true);

CREATE POLICY "Owners can update own restaurants" ON restaurants
  FOR UPDATE USING (auth.uid() = owner_id);

-- MENU ITEMS RLS
CREATE POLICY "Anyone can view menu items" ON menu_items
  FOR SELECT USING (true);

CREATE POLICY "Owners can manage own menu items" ON menu_items
  FOR ALL USING (
    auth.uid() IN (
      SELECT owner_id FROM restaurants WHERE id = restaurant_id
    )
  );

-- ORDERS RLS
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Restaurant owners can view orders for their restaurant" ON orders
  FOR SELECT USING (
    auth.uid() IN (
      SELECT owner_id FROM restaurants WHERE id = restaurant_id
    )
  );

CREATE POLICY "Delivery agents can view assigned orders" ON orders
  FOR SELECT USING (
    auth.uid() IN (
      SELECT delivery_agent_id FROM delivery_tracking WHERE order_id = id AND delivery_agent_id IS NOT NULL
    )
  );

-- CART ITEMS RLS
CREATE POLICY "Users can view own cart" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cart" ON cart_items
  FOR ALL USING (auth.uid() = user_id);

-- NOTIFICATIONS RLS
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own notifications" ON notifications
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Update user XP and level
CREATE OR REPLACE FUNCTION update_user_xp(user_id UUID, xp_amount INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE users
  SET xp = xp + xp_amount,
      level = FLOOR(POWER(xp + xp_amount, 0.5) / 10) + 1
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Add reward points
CREATE OR REPLACE FUNCTION add_reward_points(user_id UUID, points_amount INTEGER, reason_text TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO reward_points (user_id, points, reason)
  VALUES (user_id, points_amount, reason_text);

  UPDATE users
  SET coins = coins + points_amount
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Update order status with timestamps
CREATE OR REPLACE FUNCTION update_order_status(order_id UUID, new_status order_status)
RETURNS void AS $$
BEGIN
  UPDATE orders
  SET status = new_status,
      confirmed_at = CASE WHEN new_status = 'confirmed' THEN NOW() ELSE confirmed_at END,
      prepared_at = CASE WHEN new_status = 'preparing' THEN NOW() ELSE prepared_at END,
      picked_up_at = CASE WHEN new_status = 'picked_up' THEN NOW() ELSE picked_up_at END,
      delivered_at = CASE WHEN new_status = 'delivered' THEN NOW() ELSE delivered_at END
  WHERE id = order_id;
END;
$$ LANGUAGE plpgsql;
