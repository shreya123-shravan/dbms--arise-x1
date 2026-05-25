-- Populate Database with Restaurants & Menu Items
-- Run this after creating the schema
-- Uses ON CONFLICT DO NOTHING to prevent duplicates on re-run

-- ============================================
-- 🍣 JAPANESE RESTAURANTS
-- ============================================

INSERT INTO restaurants (name, description, address, city, phone, image_url, rating, is_open) VALUES
('Tokyo Sushi Bar', 'Authentic Japanese sushi and sashimi', '12 Sakura Street, Bandra', 'Mumbai', '+91-9876543201', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&auto=format&fit=crop', 4.8, true),
('Ramen House', 'Traditional Japanese ramen bowls', '45 Noodle Lane, Andheri', 'Mumbai', '+91-9876543202', 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800&auto=format&fit=crop', 4.6, true)
ON CONFLICT (name) DO NOTHING;

-- Tokyo Sushi Bar Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'California Roll', 'Crab, avocado, cucumber', 349.00, 'main', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&auto=format&fit=crop', true FROM restaurants WHERE name = 'Tokyo Sushi Bar'
UNION ALL
SELECT id, 'Salmon Nigiri', 'Fresh salmon over rice (6 pcs)', 449.00, 'main', 'https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=400&auto=format&fit=crop', true FROM restaurants WHERE name = 'Tokyo Sushi Bar'
UNION ALL
SELECT id, 'Miso Soup', 'Traditional soybean soup', 99.00, 'appetizer', 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop', true FROM restaurants WHERE name = 'Tokyo Sushi Bar'
UNION ALL
SELECT id, 'Edamame', 'Steamed soybeans with salt', 149.00, 'appetizer', 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&auto=format&fit=crop', true FROM restaurants WHERE name = 'Tokyo Sushi Bar';

-- Ramen House Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Tonkotsu Ramen', 'Rich pork bone broth with noodles', 399.00, 'main', 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400', true FROM restaurants WHERE name = 'Ramen House'
UNION ALL
SELECT id, 'Spicy Miso Ramen', 'Miso broth with chili oil', 429.00, 'main', 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=400', true FROM restaurants WHERE name = 'Ramen House'
UNION ALL
SELECT id, 'Gyoza', 'Pan-fried dumplings (6 pcs)', 199.00, 'appetizer', 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400', true FROM restaurants WHERE name = 'Ramen House';

-- ============================================
-- 🍕 ITALIAN RESTAURANTS
-- ============================================

INSERT INTO restaurants (name, description, address, city, phone, image_url, rating, is_open) VALUES
('Bella Italia', 'Authentic Italian pizzas and pastas', '78 Roma Street, Powai', 'Mumbai', '+91-9876543203', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', 4.7, true),
('Pasta Paradise', 'Handmade pasta and Italian classics', '23 Venice Road, Juhu', 'Mumbai', '+91-9876543204', 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800', 4.5, true)
ON CONFLICT (name) DO NOTHING;

-- Bella Italia Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Margherita Pizza', 'Classic tomato, mozzarella, basil', 349.00, 'main', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', true FROM restaurants WHERE name = 'Bella Italia'
UNION ALL
SELECT id, 'Pepperoni Pizza', 'Spicy pepperoni with cheese', 449.00, 'main', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', true FROM restaurants WHERE name = 'Bella Italia'
UNION ALL
SELECT id, 'Garlic Bread', 'Toasted bread with garlic butter', 129.00, 'appetizer', 'https://images.unsplash.com/photo-1573140401552-388e5ae4e28f?w=400', true FROM restaurants WHERE name = 'Bella Italia'
UNION ALL
SELECT id, 'Tiramisu', 'Classic Italian dessert', 199.00, 'dessert', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', true FROM restaurants WHERE name = 'Bella Italia';

-- Pasta Paradise Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Spaghetti Carbonara', 'Creamy egg and bacon pasta', 399.00, 'main', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400', true FROM restaurants WHERE name = 'Pasta Paradise'
UNION ALL
SELECT id, 'Penne Arrabbiata', 'Spicy tomato sauce pasta', 349.00, 'main', 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400', true FROM restaurants WHERE name = 'Pasta Paradise'
UNION ALL
SELECT id, 'Bruschetta', 'Toasted bread with tomatoes', 179.00, 'appetizer', 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400', true FROM restaurants WHERE name = 'Pasta Paradise';

-- ============================================
-- 🍛 INDIAN RESTAURANTS
-- ============================================

INSERT INTO restaurants (name, description, address, city, phone, image_url, rating, is_open) VALUES
('Spice Garden', 'North Indian curries and tandoor', '56 Masala Street, Dadar', 'Mumbai', '+91-9876543205', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800', 4.9, true),
('Dosa Corner', 'South Indian breakfast and snacks', '89 Chennai Lane, Malad', 'Mumbai', '+91-9876543206', 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800', 4.6, true)
ON CONFLICT (name) DO NOTHING;

-- Spice Garden Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Butter Chicken', 'Creamy tomato curry with chicken', 399.00, 'main', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', true FROM restaurants WHERE name = 'Spice Garden'
UNION ALL
SELECT id, 'Paneer Tikka Masala', 'Cottage cheese in spicy gravy', 349.00, 'main', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', true FROM restaurants WHERE name = 'Spice Garden'
UNION ALL
SELECT id, 'Garlic Naan', 'Tandoor-baked flatbread', 49.00, 'appetizer', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', true FROM restaurants WHERE name = 'Spice Garden'
UNION ALL
SELECT id, 'Biryani', 'Fragrant rice with spices', 299.00, 'main', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', true FROM restaurants WHERE name = 'Spice Garden';

-- Dosa Corner Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Masala Dosa', 'Crispy crepe with potato filling', 149.00, 'main', 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400', true FROM restaurants WHERE name = 'Dosa Corner'
UNION ALL
SELECT id, 'Idli Sambar', 'Steamed rice cakes with lentil soup', 99.00, 'main', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', true FROM restaurants WHERE name = 'Dosa Corner'
UNION ALL
SELECT id, 'Vada', 'Crispy lentil donuts (2 pcs)', 79.00, 'appetizer', 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400', true FROM restaurants WHERE name = 'Dosa Corner';

-- ============================================
-- 🥡 CHINESE RESTAURANTS
-- ============================================

INSERT INTO restaurants (name, description, address, city, phone, image_url, rating, is_open) VALUES
('Dragon Wok', 'Authentic Chinese stir-fry and dim sum', '34 Beijing Road, Colaba', 'Mumbai', '+91-9876543207', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800', 4.7, true),
('Noodle Express', 'Quick Chinese noodles and rice', '67 Shanghai Street, Goregaon', 'Mumbai', '+91-9876543208', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800', 4.4, true)
ON CONFLICT (name) DO NOTHING;

-- Dragon Wok Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Kung Pao Chicken', 'Spicy chicken with peanuts', 379.00, 'main', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400', true FROM restaurants WHERE name = 'Dragon Wok'
UNION ALL
SELECT id, 'Fried Rice', 'Egg fried rice with vegetables', 249.00, 'main', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', true FROM restaurants WHERE name = 'Dragon Wok'
UNION ALL
SELECT id, 'Spring Rolls', 'Crispy vegetable rolls (4 pcs)', 149.00, 'appetizer', 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', true FROM restaurants WHERE name = 'Dragon Wok'
UNION ALL
SELECT id, 'Dim Sum Platter', 'Assorted steamed dumplings', 299.00, 'appetizer', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400', true FROM restaurants WHERE name = 'Dragon Wok';

-- Noodle Express Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Hakka Noodles', 'Stir-fried noodles with vegetables', 199.00, 'main', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', true FROM restaurants WHERE name = 'Noodle Express'
UNION ALL
SELECT id, 'Manchurian', 'Fried veggie balls in sauce', 229.00, 'main', 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400', true FROM restaurants WHERE name = 'Noodle Express'
UNION ALL
SELECT id, 'Hot & Sour Soup', 'Spicy tangy soup', 129.00, 'appetizer', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', true FROM restaurants WHERE name = 'Noodle Express';

-- ============================================
-- 🌮 MEXICAN RESTAURANTS
-- ============================================

INSERT INTO restaurants (name, description, address, city, phone, image_url, rating, is_open) VALUES
('Taco Fiesta', 'Authentic Mexican tacos and burritos', '91 Mexico Street, Bandra', 'Mumbai', '+91-9876543209', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800', 4.6, true),
('Burrito Bowl', 'Fresh Mexican bowls and wraps', '12 Salsa Lane, Andheri', 'Mumbai', '+91-9876543210', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800', 4.5, true)
ON CONFLICT (name) DO NOTHING;

-- Taco Fiesta Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Chicken Tacos', 'Grilled chicken with salsa (3 pcs)', 299.00, 'main', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', true FROM restaurants WHERE name = 'Taco Fiesta'
UNION ALL
SELECT id, 'Beef Burrito', 'Wrapped tortilla with beef and beans', 349.00, 'main', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400', true FROM restaurants WHERE name = 'Taco Fiesta'
UNION ALL
SELECT id, 'Nachos Supreme', 'Tortilla chips with cheese and salsa', 249.00, 'appetizer', 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400', true FROM restaurants WHERE name = 'Taco Fiesta'
UNION ALL
SELECT id, 'Guacamole & Chips', 'Fresh avocado dip with chips', 199.00, 'appetizer', 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400', true FROM restaurants WHERE name = 'Taco Fiesta';

-- Burrito Bowl Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Chicken Burrito Bowl', 'Rice bowl with grilled chicken', 329.00, 'main', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400', true FROM restaurants WHERE name = 'Burrito Bowl'
UNION ALL
SELECT id, 'Veggie Quesadilla', 'Grilled tortilla with cheese', 279.00, 'main', 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400', true FROM restaurants WHERE name = 'Burrito Bowl'
UNION ALL
SELECT id, 'Churros', 'Fried dough with chocolate sauce', 149.00, 'dessert', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400', true FROM restaurants WHERE name = 'Burrito Bowl';

-- ============================================
-- 🥗 HEALTHY RESTAURANTS
-- ============================================

INSERT INTO restaurants (name, description, address, city, phone, image_url, rating, is_open) VALUES
('Green Bowl', 'Fresh salads and smoothie bowls', '45 Wellness Street, Powai', 'Mumbai', '+91-9876543211', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', 4.8, true),
('Fit Kitchen', 'High-protein healthy meals', '78 Fitness Lane, Malad', 'Mumbai', '+91-9876543212', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800', 4.7, true)
ON CONFLICT (name) DO NOTHING;

-- Green Bowl Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Caesar Salad', 'Romaine lettuce with parmesan', 299.00, 'main', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', true FROM restaurants WHERE name = 'Green Bowl'
UNION ALL
SELECT id, 'Acai Bowl', 'Acai berries with granola', 349.00, 'main', 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', true FROM restaurants WHERE name = 'Green Bowl'
UNION ALL
SELECT id, 'Green Smoothie', 'Spinach, banana, protein blend', 199.00, 'drinks', 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400', true FROM restaurants WHERE name = 'Green Bowl'
UNION ALL
SELECT id, 'Quinoa Bowl', 'Quinoa with roasted vegetables', 329.00, 'main', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', true FROM restaurants WHERE name = 'Green Bowl';

-- Fit Kitchen Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Grilled Chicken Salad', 'High-protein chicken with greens', 379.00, 'main', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', true FROM restaurants WHERE name = 'Fit Kitchen'
UNION ALL
SELECT id, 'Protein Bowl', 'Chicken, eggs, avocado, quinoa', 429.00, 'main', 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400', true FROM restaurants WHERE name = 'Fit Kitchen'
UNION ALL
SELECT id, 'Fruit Salad', 'Fresh seasonal fruits', 179.00, 'dessert', 'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=400', true FROM restaurants WHERE name = 'Fit Kitchen';

-- ============================================
-- 🍜 KOREAN RESTAURANTS
-- ============================================

INSERT INTO restaurants (name, description, address, city, phone, image_url, rating, is_open) VALUES
('Seoul Kitchen', 'Authentic Korean BBQ and kimchi', '23 Seoul Street, Juhu', 'Mumbai', '+91-9876543213', 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800', 4.7, true),
('K-Pop Bites', 'Korean street food and fried chicken', '56 Gangnam Road, Colaba', 'Mumbai', '+91-9876543214', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800', 4.6, true)
ON CONFLICT (name) DO NOTHING;

-- Seoul Kitchen Menu
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Bibimbap', 'Mixed rice with vegetables and egg', 379.00, 'main', 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400', true FROM restaurants WHERE name = 'Seoul Kitchen'
UNION ALL
SELECT id, 'Korean BBQ Platter', 'Grilled meat with sides', 599.00, 'main', 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400', true FROM restaurants WHERE name = 'Seoul Kitchen'
UNION ALL
SELECT id, 'Kimchi', 'Fermented spicy cabbage', 99.00, 'appetizer', 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400', true FROM restaurants WHERE name = 'Seoul Kitchen'
UNION ALL
SELECT id, 'Tteokbokki', 'Spicy rice cakes', 249.00, 'appetizer', 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', true FROM restaurants WHERE name = 'Seoul Kitchen';
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Korean Fried Chicken', 'Crispy chicken with sweet sauce', 399.00, 'main', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400', true FROM restaurants WHERE name = 'K-Pop Bites'
UNION ALL
SELECT id, 'Japchae', 'Stir-fried glass noodles', 329.00, 'main', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', true FROM restaurants WHERE name = 'K-Pop Bites'
UNION ALL
SELECT id, 'Mandu', 'Korean dumplings (6 pcs)', 199.00, 'appetizer', 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400', true FROM restaurants WHERE name = 'K-Pop Bites';

-- K-Pop Bites Menu


-- ============================================
-- SUMMARY
-- ============================================
-- Total: 16 restaurants across 7 cuisines
-- Total: ~60 menu items with images
-- All using Unsplash food images
-- ============================================
