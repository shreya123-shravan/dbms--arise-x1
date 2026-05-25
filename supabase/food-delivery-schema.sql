-- Food Delivery App - Simple 8 Table Schema
-- Clean, easy to understand table names

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE 1: customers (app users)
-- ============================================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 2: restaurants
-- ============================================
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT,
  image_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  is_open BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 3: menu_items (food items)
-- ============================================
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT, -- e.g., 'appetizer', 'main', 'dessert', 'drinks'
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 4: orders
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')) DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  ordered_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ
);

-- ============================================
-- TABLE 5: order_items (items in each order)
-- ============================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL, -- Store name in case menu item is deleted
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 6: payments
-- ============================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('card', 'upi', 'cash', 'wallet')) DEFAULT 'card',
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  transaction_id TEXT,
  paid_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 7: reviews (customer reviews)
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 8: delivery_tracking
-- ============================================
CREATE TABLE delivery_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES for better performance
-- ============================================
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_reviews_restaurant ON reviews(restaurant_id);
CREATE INDEX idx_delivery_tracking_order ON delivery_tracking(order_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_tracking ENABLE ROW LEVEL SECURITY;

-- Customers can view/update their own data
CREATE POLICY "Customers can view own profile" ON customers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Customers can update own profile" ON customers
  FOR UPDATE USING (auth.uid() = id);

-- Customers can view their own orders
CREATE POLICY "Customers can view own orders" ON orders
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Customers can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Customers can view their order items
CREATE POLICY "Customers can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.customer_id = auth.uid()
    )
  );

-- Customers can view their payments
CREATE POLICY "Customers can view own payments" ON payments
  FOR SELECT USING (auth.uid() = customer_id);

-- Customers can create reviews
CREATE POLICY "Customers can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT TO authenticated USING (true);

-- Customers can view delivery tracking for their orders
CREATE POLICY "Customers can view own delivery tracking" ON delivery_tracking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = delivery_tracking.order_id 
      AND orders.customer_id = auth.uid()
    )
  );

-- Restaurants and menu items are public (read-only for customers)
CREATE POLICY "Anyone can view restaurants" ON restaurants
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can view menu items" ON menu_items
  FOR SELECT TO authenticated USING (true);

-- ============================================
-- SAMPLE DATA (for testing)
-- ============================================

-- Sample restaurants
INSERT INTO restaurants (name, description, address, city, phone, rating, is_open) VALUES
('Pizza Palace', 'Best pizzas in town', '123 Main St', 'Mumbai', '+91-9876543210', 4.5, true),
('Burger Hub', 'Juicy burgers and fries', '456 Park Ave', 'Mumbai', '+91-9876543211', 4.2, true),
('Sushi Express', 'Fresh sushi daily', '789 Beach Rd', 'Mumbai', '+91-9876543212', 4.8, true);

-- Sample menu items (get restaurant IDs first)
INSERT INTO menu_items (restaurant_id, name, description, price, category, is_available)
SELECT id, 'Margherita Pizza', 'Classic tomato and cheese', 299.00, 'main', true
FROM restaurants WHERE name = 'Pizza Palace'
UNION ALL
SELECT id, 'Pepperoni Pizza', 'Spicy pepperoni slices', 399.00, 'main', true
FROM restaurants WHERE name = 'Pizza Palace'
UNION ALL
SELECT id, 'Classic Burger', 'Beef patty with lettuce and tomato', 199.00, 'main', true
FROM restaurants WHERE name = 'Burger Hub'
UNION ALL
SELECT id, 'Cheese Fries', 'Crispy fries with cheese sauce', 99.00, 'appetizer', true
FROM restaurants WHERE name = 'Burger Hub'
UNION ALL
SELECT id, 'California Roll', 'Crab, avocado, cucumber', 349.00, 'main', true
FROM restaurants WHERE name = 'Sushi Express'
UNION ALL
SELECT id, 'Miso Soup', 'Traditional Japanese soup', 79.00, 'appetizer', true
FROM restaurants WHERE name = 'Sushi Express';
UNION ALL

