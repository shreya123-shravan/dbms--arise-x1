-- ============================================================
-- FRESH SEED: 30 Restaurants + Menus
-- Run this in Supabase SQL Editor
-- Step 1: Clean existing data
-- ============================================================

TRUNCATE TABLE menu_items CASCADE;
TRUNCATE TABLE restaurants CASCADE;


-- ============================================================
-- Step 2: Insert 30 Restaurants
-- ============================================================

INSERT INTO restaurants (name, description, address, city, phone, image_url, rating, is_open) VALUES
-- Indian
('Spice Garden',        'Authentic North Indian curries & tandoor',         '56 Masala Street, Dadar',       'Mumbai', '+91-9800000001', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80', 4.9, true),
('Dosa Corner',         'Crispy South Indian dosas & idlis',                '89 Chennai Lane, Malad',        'Mumbai', '+91-9800000002', 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80', 4.6, true),
('Biryani House',       'Dum biryani & kebabs from Hyderabad',              '12 Nizami Road, Bandra',        'Mumbai', '+91-9800000003', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80', 4.8, true),
('Punjabi Dhaba',       'Hearty Punjabi meals & lassi',                     '34 Amritsar Lane, Andheri',     'Mumbai', '+91-9800000004', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80', 4.5, true),
('Chettinad Kitchen',   'Spicy Chettinad curries & appam',                  '7 Madurai Street, Powai',       'Mumbai', '+91-9800000005', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80', 4.7, true),
-- Italian
('Bella Italia',        'Wood-fired pizzas & handmade pasta',               '78 Roma Street, Powai',         'Mumbai', '+91-9800000006', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80', 4.7, true),
('Pasta Paradise',      'Authentic Italian pasta & risotto',                '23 Venice Road, Juhu',          'Mumbai', '+91-9800000007', 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80', 4.5, true),
('La Piazza',           'Neapolitan pizza & tiramisu',                      '5 Florence Avenue, Colaba',     'Mumbai', '+91-9800000008', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80', 4.6, true),
-- Japanese
('Tokyo Sushi Bar',     'Premium sushi, sashimi & maki rolls',              '12 Sakura Street, Bandra',      'Mumbai', '+91-9800000009', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80', 4.8, true),
('Ramen House',         'Rich tonkotsu & miso ramen bowls',                 '45 Noodle Lane, Andheri',       'Mumbai', '+91-9800000010', 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800&q=80', 4.6, true),
-- Chinese
('Dragon Wok',          'Authentic Cantonese stir-fry & dim sum',           '34 Beijing Road, Colaba',       'Mumbai', '+91-9800000011', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80', 4.7, true),
('Noodle Express',      'Quick Chinese noodles, rice & soups',              '67 Shanghai Street, Goregaon',  'Mumbai', '+91-9800000012', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80', 4.4, true),
-- Mexican
('Taco Fiesta',         'Street-style tacos, burritos & nachos',            '91 Mexico Street, Bandra',      'Mumbai', '+91-9800000013', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80', 4.6, true),
('Burrito Bowl',        'Fresh Mexican bowls, quesadillas & wraps',         '12 Salsa Lane, Andheri',        'Mumbai', '+91-9800000014', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&q=80', 4.5, true),
-- Healthy
('Green Bowl',          'Superfood salads & smoothie bowls',                '45 Wellness Street, Powai',     'Mumbai', '+91-9800000015', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', 4.8, true),
('Fit Kitchen',         'High-protein meal preps & clean eats',             '78 Fitness Lane, Malad',        'Mumbai', '+91-9800000016', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80', 4.7, true),
-- Korean
('Seoul Kitchen',       'Korean BBQ, bibimbap & kimchi stew',               '23 Seoul Street, Juhu',         'Mumbai', '+91-9800000017', 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&q=80', 4.7, true),
('K-Pop Bites',         'Korean fried chicken & street snacks',             '56 Gangnam Road, Colaba',       'Mumbai', '+91-9800000018', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80', 4.6, true),
-- Burgers
('Burger Republic',     'Gourmet smash burgers & loaded fries',             '10 Patty Lane, Bandra',         'Mumbai', '+91-9800000019', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', 4.5, true),
('The Bun Factory',     'Craft burgers with artisan buns',                  '22 Grill Street, Andheri',      'Mumbai', '+91-9800000020', 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80', 4.4, true),
-- Desserts & Cafe
('Sweet Tooth',         'Waffles, crepes & artisan desserts',               '8 Sugar Lane, Juhu',            'Mumbai', '+91-9800000021', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80', 4.6, true),
('Brew & Bites',        'Specialty coffee, sandwiches & pastries',          '15 Cafe Road, Powai',           'Mumbai', '+91-9800000022', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', 4.5, true),
-- Thai
('Thai Orchid',         'Authentic Thai curries, pad thai & soups',         '33 Bangkok Street, Dadar',      'Mumbai', '+91-9800000023', 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&q=80', 4.7, true),
-- Mediterranean
('Olive Garden',        'Greek salads, hummus, falafel & shawarma',         '19 Athens Road, Bandra',        'Mumbai', '+91-9800000024', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80', 4.6, true),
-- Street Food
('Mumbai Chaat House',  'Pani puri, bhel, vada pav & pav bhaji',            '3 Chowpatty Road, Marine Lines','Mumbai', '+91-9800000025', 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80', 4.8, true),
-- Seafood
('The Fish Market',     'Fresh catch — grilled, fried & curried',           '77 Harbour Road, Colaba',       'Mumbai', '+91-9800000026', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80', 4.7, true),
-- Wraps & Rolls
('Roll Station',        'Kathi rolls, frankie & wraps',                     '41 Roll Street, Goregaon',      'Mumbai', '+91-9800000027', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&q=80', 4.4, true),
-- Lebanese
('Beirut Bites',        'Shawarma, falafel wraps & mezze platters',         '9 Beirut Lane, Andheri',        'Mumbai', '+91-9800000028', 'https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=800&q=80', 4.5, true),
-- American BBQ
('Smoke & Grill',       'BBQ ribs, pulled pork & smoked brisket',           '55 Texas Road, Bandra',         'Mumbai', '+91-9800000029', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80', 4.6, true),
-- Breakfast
('Morning Glory',       'All-day breakfast, pancakes & eggs benedict',      '2 Sunrise Lane, Juhu',          'Mumbai', '+91-9800000030', 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80', 4.5, true);


-- ============================================================
-- Step 3: Menu Items — Indian restaurants
-- ============================================================

-- Spice Garden
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Butter Chicken',       'Tender chicken in creamy tomato gravy',         399, 'main',      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', true FROM restaurants WHERE name='Spice Garden' UNION ALL
SELECT id, 'Paneer Tikka Masala',  'Cottage cheese in spiced onion-tomato gravy',   349, 'main',      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80', true FROM restaurants WHERE name='Spice Garden' UNION ALL
SELECT id, 'Dal Makhani',          'Slow-cooked black lentils with butter & cream', 299, 'main',      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80', true FROM restaurants WHERE name='Spice Garden' UNION ALL
SELECT id, 'Garlic Naan',          'Tandoor-baked flatbread with garlic butter',     59, 'appetizer', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80', true FROM restaurants WHERE name='Spice Garden' UNION ALL
SELECT id, 'Gulab Jamun',          'Soft milk dumplings in rose sugar syrup',        99, 'dessert',   'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80', true FROM restaurants WHERE name='Spice Garden' UNION ALL
SELECT id, 'Mango Lassi',          'Chilled yogurt drink with Alphonso mango',       89, 'drinks',    'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80', true FROM restaurants WHERE name='Spice Garden';

-- Dosa Corner
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Masala Dosa',          'Crispy crepe with spiced potato filling',        149, 'main',      'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80', true FROM restaurants WHERE name='Dosa Corner' UNION ALL
SELECT id, 'Idli Sambar',          'Steamed rice cakes with lentil soup & chutney',   99, 'main',      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80', true FROM restaurants WHERE name='Dosa Corner' UNION ALL
SELECT id, 'Rava Dosa',            'Thin crispy semolina crepe',                     169, 'main',      'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80', true FROM restaurants WHERE name='Dosa Corner' UNION ALL
SELECT id, 'Medu Vada',            'Crispy lentil donuts with sambar (2 pcs)',         79, 'appetizer', 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80', true FROM restaurants WHERE name='Dosa Corner' UNION ALL
SELECT id, 'Filter Coffee',        'South Indian drip coffee with frothy milk',       49, 'drinks',    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80', true FROM restaurants WHERE name='Dosa Corner';

-- Biryani House
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Chicken Dum Biryani',  'Slow-cooked basmati rice with spiced chicken',  399, 'main',      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', true FROM restaurants WHERE name='Biryani House' UNION ALL
SELECT id, 'Mutton Biryani',       'Tender mutton with aromatic dum rice',           499, 'main',      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', true FROM restaurants WHERE name='Biryani House' UNION ALL
SELECT id, 'Veg Biryani',          'Seasonal vegetables in fragrant basmati',        299, 'main',      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', true FROM restaurants WHERE name='Biryani House' UNION ALL
SELECT id, 'Mirchi Ka Salan',      'Spicy green chilli curry — biryani side',         99, 'appetizer', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80', true FROM restaurants WHERE name='Biryani House' UNION ALL
SELECT id, 'Double Ka Meetha',     'Hyderabadi bread pudding with saffron',          129, 'dessert',   'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80', true FROM restaurants WHERE name='Biryani House';

-- Punjabi Dhaba
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Sarson Da Saag',       'Mustard greens with makki roti',                 249, 'main',      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', true FROM restaurants WHERE name='Punjabi Dhaba' UNION ALL
SELECT id, 'Chole Bhature',        'Spiced chickpeas with fluffy fried bread',       199, 'main',      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80', true FROM restaurants WHERE name='Punjabi Dhaba' UNION ALL
SELECT id, 'Amritsari Kulcha',     'Stuffed bread baked in tandoor',                 129, 'appetizer', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80', true FROM restaurants WHERE name='Punjabi Dhaba' UNION ALL
SELECT id, 'Sweet Lassi',          'Chilled yogurt drink with sugar & cardamom',      79, 'drinks',    'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80', true FROM restaurants WHERE name='Punjabi Dhaba';

-- Chettinad Kitchen
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Chettinad Chicken',    'Fiery chicken curry with kalpasi & marathi mokku', 379, 'main',   'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', true FROM restaurants WHERE name='Chettinad Kitchen' UNION ALL
SELECT id, 'Appam with Stew',      'Lacy rice hoppers with coconut vegetable stew',  199, 'main',      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80', true FROM restaurants WHERE name='Chettinad Kitchen' UNION ALL
SELECT id, 'Kothu Parotta',        'Shredded parotta tossed with egg & masala',      229, 'main',      'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80', true FROM restaurants WHERE name='Chettinad Kitchen' UNION ALL
SELECT id, 'Rasam',                'Tangy tamarind pepper soup',                      59, 'appetizer', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80', true FROM restaurants WHERE name='Chettinad Kitchen';


-- ============================================================
-- Step 4: Menu Items — Italian, Japanese, Chinese
-- ============================================================

-- Bella Italia
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Margherita Pizza',     'San Marzano tomato, fior di latte, fresh basil',  349, 'main',      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80', true FROM restaurants WHERE name='Bella Italia' UNION ALL
SELECT id, 'Pepperoni Pizza',      'Spicy pepperoni, mozzarella, tomato sauce',        449, 'main',      'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80', true FROM restaurants WHERE name='Bella Italia' UNION ALL
SELECT id, 'Penne Arrabbiata',     'Penne in spicy tomato & garlic sauce',             329, 'main',      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80', true FROM restaurants WHERE name='Bella Italia' UNION ALL
SELECT id, 'Garlic Bread',         'Toasted ciabatta with herb garlic butter',         129, 'appetizer', 'https://images.unsplash.com/photo-1573140401552-388e5ae4e28f?w=400&q=80', true FROM restaurants WHERE name='Bella Italia' UNION ALL
SELECT id, 'Tiramisu',             'Classic espresso-soaked ladyfinger dessert',        199, 'dessert',   'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80', true FROM restaurants WHERE name='Bella Italia';

-- Pasta Paradise
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Spaghetti Carbonara',  'Egg, pancetta, pecorino & black pepper',           399, 'main',      'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80', true FROM restaurants WHERE name='Pasta Paradise' UNION ALL
SELECT id, 'Fettuccine Alfredo',   'Creamy butter & parmesan sauce',                   379, 'main',      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80', true FROM restaurants WHERE name='Pasta Paradise' UNION ALL
SELECT id, 'Bruschetta',           'Toasted bread with tomato, basil & olive oil',     179, 'appetizer', 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&q=80', true FROM restaurants WHERE name='Pasta Paradise' UNION ALL
SELECT id, 'Panna Cotta',          'Vanilla cream dessert with berry coulis',           169, 'dessert',   'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80', true FROM restaurants WHERE name='Pasta Paradise';

-- La Piazza
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Quattro Formaggi',     'Four-cheese pizza — mozzarella, gorgonzola, parmesan, ricotta', 499, 'main', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80', true FROM restaurants WHERE name='La Piazza' UNION ALL
SELECT id, 'Lasagne al Forno',     'Layered pasta with bolognese & béchamel',           429, 'main',      'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80', true FROM restaurants WHERE name='La Piazza' UNION ALL
SELECT id, 'Caprese Salad',        'Buffalo mozzarella, tomato & fresh basil',          249, 'appetizer', 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&q=80', true FROM restaurants WHERE name='La Piazza' UNION ALL
SELECT id, 'Cannoli',              'Crispy pastry shells with sweet ricotta filling',   149, 'dessert',   'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80', true FROM restaurants WHERE name='La Piazza';

-- Tokyo Sushi Bar
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'California Roll',      'Crab, avocado & cucumber (8 pcs)',                 349, 'main',      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&q=80', true FROM restaurants WHERE name='Tokyo Sushi Bar' UNION ALL
SELECT id, 'Salmon Nigiri',        'Fresh Atlantic salmon over seasoned rice (6 pcs)', 449, 'main',      'https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=400&q=80', true FROM restaurants WHERE name='Tokyo Sushi Bar' UNION ALL
SELECT id, 'Spicy Tuna Roll',      'Tuna, sriracha mayo & cucumber (8 pcs)',           399, 'main',      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&q=80', true FROM restaurants WHERE name='Tokyo Sushi Bar' UNION ALL
SELECT id, 'Miso Soup',            'Traditional dashi broth with tofu & wakame',        99, 'appetizer', 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80', true FROM restaurants WHERE name='Tokyo Sushi Bar' UNION ALL
SELECT id, 'Edamame',              'Steamed salted soybeans',                           149, 'appetizer', 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&q=80', true FROM restaurants WHERE name='Tokyo Sushi Bar';

-- Ramen House
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Tonkotsu Ramen',       'Rich pork bone broth, chashu, soft egg & nori',   399, 'main',      'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400&q=80', true FROM restaurants WHERE name='Ramen House' UNION ALL
SELECT id, 'Spicy Miso Ramen',     'Miso broth with chili oil, corn & bamboo shoots', 429, 'main',      'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=400&q=80', true FROM restaurants WHERE name='Ramen House' UNION ALL
SELECT id, 'Shoyu Ramen',          'Soy sauce broth with chicken & menma',             379, 'main',      'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400&q=80', true FROM restaurants WHERE name='Ramen House' UNION ALL
SELECT id, 'Gyoza',                'Pan-fried pork & cabbage dumplings (6 pcs)',        199, 'appetizer', 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&q=80', true FROM restaurants WHERE name='Ramen House';

-- Dragon Wok
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Kung Pao Chicken',     'Spicy chicken with peanuts & dried chilies',       379, 'main',      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80', true FROM restaurants WHERE name='Dragon Wok' UNION ALL
SELECT id, 'Dim Sum Platter',      'Assorted steamed dumplings — har gow & siu mai',   299, 'appetizer', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80', true FROM restaurants WHERE name='Dragon Wok' UNION ALL
SELECT id, 'Egg Fried Rice',       'Wok-tossed rice with egg, spring onion & soy',    249, 'main',      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', true FROM restaurants WHERE name='Dragon Wok' UNION ALL
SELECT id, 'Spring Rolls',         'Crispy vegetable rolls with sweet chili dip (4 pcs)', 149, 'appetizer', 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80', true FROM restaurants WHERE name='Dragon Wok';

-- Noodle Express
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Hakka Noodles',        'Stir-fried noodles with vegetables & soy sauce',  199, 'main',      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80', true FROM restaurants WHERE name='Noodle Express' UNION ALL
SELECT id, 'Veg Manchurian',       'Fried veggie balls in tangy Manchurian sauce',     229, 'main',      'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&q=80', true FROM restaurants WHERE name='Noodle Express' UNION ALL
SELECT id, 'Hot & Sour Soup',      'Spicy tangy broth with tofu & mushrooms',          129, 'appetizer', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80', true FROM restaurants WHERE name='Noodle Express' UNION ALL
SELECT id, 'Chilli Paneer',        'Crispy paneer tossed in spicy Indo-Chinese sauce', 249, 'main',      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80', true FROM restaurants WHERE name='Noodle Express';


-- ============================================================
-- Step 5: Menu Items — Mexican, Healthy, Korean, Burgers
-- ============================================================

-- Taco Fiesta
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Chicken Tacos',        'Grilled chicken, pico de gallo & lime (3 pcs)',   299, 'main',      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80', true FROM restaurants WHERE name='Taco Fiesta' UNION ALL
SELECT id, 'Beef Burrito',         'Flour tortilla with beef, beans, rice & salsa',   349, 'main',      'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80', true FROM restaurants WHERE name='Taco Fiesta' UNION ALL
SELECT id, 'Nachos Supreme',       'Tortilla chips, cheese sauce, jalapeños & salsa', 249, 'appetizer', 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&q=80', true FROM restaurants WHERE name='Taco Fiesta' UNION ALL
SELECT id, 'Guacamole & Chips',    'Fresh avocado dip with lime & cilantro',           199, 'appetizer', 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400&q=80', true FROM restaurants WHERE name='Taco Fiesta' UNION ALL
SELECT id, 'Churros',              'Fried dough sticks with chocolate dipping sauce',  149, 'dessert',   'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80', true FROM restaurants WHERE name='Taco Fiesta';

-- Burrito Bowl
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Chicken Burrito Bowl', 'Rice, grilled chicken, black beans & corn',       329, 'main',      'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80', true FROM restaurants WHERE name='Burrito Bowl' UNION ALL
SELECT id, 'Veggie Quesadilla',    'Grilled tortilla with cheese, peppers & onions',  279, 'main',      'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400&q=80', true FROM restaurants WHERE name='Burrito Bowl' UNION ALL
SELECT id, 'Elote (Corn)',         'Mexican street corn with cotija & chili powder',   149, 'appetizer', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80', true FROM restaurants WHERE name='Burrito Bowl' UNION ALL
SELECT id, 'Horchata',             'Sweet rice milk with cinnamon',                     99, 'drinks',    'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80', true FROM restaurants WHERE name='Burrito Bowl';

-- Green Bowl
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Acai Bowl',            'Acai, banana, granola, honey & fresh berries',    349, 'main',      'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&q=80', true FROM restaurants WHERE name='Green Bowl' UNION ALL
SELECT id, 'Caesar Salad',         'Romaine, parmesan, croutons & Caesar dressing',   299, 'main',      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', true FROM restaurants WHERE name='Green Bowl' UNION ALL
SELECT id, 'Quinoa Power Bowl',    'Quinoa, roasted veggies, avocado & tahini',        329, 'main',      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', true FROM restaurants WHERE name='Green Bowl' UNION ALL
SELECT id, 'Green Detox Smoothie', 'Spinach, cucumber, ginger, lemon & apple',        199, 'drinks',    'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&q=80', true FROM restaurants WHERE name='Green Bowl';

-- Fit Kitchen
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Grilled Chicken Bowl', 'Chicken breast, brown rice, broccoli & quinoa',   429, 'main',      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', true FROM restaurants WHERE name='Fit Kitchen' UNION ALL
SELECT id, 'Protein Omelette',     'Egg whites, spinach, mushroom & low-fat cheese',  299, 'main',      'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80', true FROM restaurants WHERE name='Fit Kitchen' UNION ALL
SELECT id, 'Avocado Toast',        'Multigrain toast, smashed avocado & poached egg', 279, 'appetizer', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', true FROM restaurants WHERE name='Fit Kitchen' UNION ALL
SELECT id, 'Whey Protein Shake',   'Chocolate or vanilla protein shake with milk',    199, 'drinks',    'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&q=80', true FROM restaurants WHERE name='Fit Kitchen';

-- Seoul Kitchen
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Bibimbap',             'Mixed rice bowl with vegetables, egg & gochujang', 379, 'main',     'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&q=80', true FROM restaurants WHERE name='Seoul Kitchen' UNION ALL
SELECT id, 'Korean BBQ Platter',   'Marinated beef bulgogi & pork belly with sides',  599, 'main',      'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80', true FROM restaurants WHERE name='Seoul Kitchen' UNION ALL
SELECT id, 'Kimchi Jjigae',        'Spicy kimchi stew with tofu & pork',               349, 'main',      'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80', true FROM restaurants WHERE name='Seoul Kitchen' UNION ALL
SELECT id, 'Tteokbokki',           'Chewy rice cakes in spicy gochujang sauce',        249, 'appetizer', 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&q=80', true FROM restaurants WHERE name='Seoul Kitchen';

-- K-Pop Bites
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Korean Fried Chicken', 'Double-fried chicken with sweet soy glaze',        399, 'main',      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80', true FROM restaurants WHERE name='K-Pop Bites' UNION ALL
SELECT id, 'Japchae',              'Stir-fried glass noodles with vegetables & beef',  329, 'main',      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80', true FROM restaurants WHERE name='K-Pop Bites' UNION ALL
SELECT id, 'Mandu',                'Steamed or fried Korean dumplings (6 pcs)',         199, 'appetizer', 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&q=80', true FROM restaurants WHERE name='K-Pop Bites' UNION ALL
SELECT id, 'Banana Milk',          'Sweet Korean banana-flavoured milk',                 79, 'drinks',    'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80', true FROM restaurants WHERE name='K-Pop Bites';

-- Burger Republic
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Classic Smash Burger', 'Double smash patty, American cheese & pickles',   349, 'main',      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', true FROM restaurants WHERE name='Burger Republic' UNION ALL
SELECT id, 'BBQ Bacon Burger',     'Beef patty, crispy bacon, BBQ sauce & onion rings', 429, 'main',    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80', true FROM restaurants WHERE name='Burger Republic' UNION ALL
SELECT id, 'Loaded Fries',         'Crispy fries with cheese sauce, jalapeños & bacon', 199, 'appetizer', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80', true FROM restaurants WHERE name='Burger Republic' UNION ALL
SELECT id, 'Chocolate Milkshake',  'Thick shake with premium chocolate ice cream',     179, 'drinks',    'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80', true FROM restaurants WHERE name='Burger Republic';

-- The Bun Factory
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Mushroom Swiss Burger','Beef patty, sautéed mushrooms & Swiss cheese',     379, 'main',      'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80', true FROM restaurants WHERE name='The Bun Factory' UNION ALL
SELECT id, 'Crispy Chicken Burger','Buttermilk fried chicken with coleslaw & sriracha', 329, 'main',     'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', true FROM restaurants WHERE name='The Bun Factory' UNION ALL
SELECT id, 'Onion Rings',          'Beer-battered onion rings with ranch dip',          149, 'appetizer', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80', true FROM restaurants WHERE name='The Bun Factory';


-- ============================================================
-- Step 6: Menu Items — Desserts, Thai, Mediterranean,
--          Street Food, Seafood, Rolls, Lebanese, BBQ, Breakfast
-- ============================================================

-- Sweet Tooth
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Belgian Waffles',      'Crispy waffles with Nutella, banana & cream',     299, 'main',      'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80', true FROM restaurants WHERE name='Sweet Tooth' UNION ALL
SELECT id, 'Nutella Crepe',        'Thin crepe with Nutella & fresh strawberries',     249, 'main',      'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80', true FROM restaurants WHERE name='Sweet Tooth' UNION ALL
SELECT id, 'Brownie Sundae',       'Warm chocolate brownie with vanilla ice cream',    229, 'dessert',   'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80', true FROM restaurants WHERE name='Sweet Tooth' UNION ALL
SELECT id, 'Bubble Tea',           'Tapioca pearl milk tea — taro or matcha',          149, 'drinks',    'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80', true FROM restaurants WHERE name='Sweet Tooth';

-- Brew & Bites
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Flat White',           'Double ristretto with velvety steamed milk',       149, 'drinks',    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80', true FROM restaurants WHERE name='Brew & Bites' UNION ALL
SELECT id, 'Avocado Club Sandwich','Grilled chicken, avocado, bacon & aioli',          299, 'main',      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', true FROM restaurants WHERE name='Brew & Bites' UNION ALL
SELECT id, 'Almond Croissant',     'Buttery croissant filled with almond cream',       129, 'appetizer', 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80', true FROM restaurants WHERE name='Brew & Bites' UNION ALL
SELECT id, 'Cold Brew',            '18-hour cold-steeped coffee over ice',             169, 'drinks',    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80', true FROM restaurants WHERE name='Brew & Bites';

-- Thai Orchid
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Pad Thai',             'Stir-fried rice noodles with shrimp, egg & peanuts', 349, 'main',   'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&q=80', true FROM restaurants WHERE name='Thai Orchid' UNION ALL
SELECT id, 'Green Curry',          'Coconut milk curry with Thai basil & vegetables',  379, 'main',      'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&q=80', true FROM restaurants WHERE name='Thai Orchid' UNION ALL
SELECT id, 'Tom Yum Soup',         'Spicy lemongrass & galangal prawn soup',           249, 'appetizer', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80', true FROM restaurants WHERE name='Thai Orchid' UNION ALL
SELECT id, 'Mango Sticky Rice',    'Sweet glutinous rice with fresh mango & coconut cream', 199, 'dessert', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80', true FROM restaurants WHERE name='Thai Orchid';

-- Olive Garden
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Chicken Shawarma',     'Marinated chicken in pita with garlic sauce',      299, 'main',      'https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=400&q=80', true FROM restaurants WHERE name='Olive Garden' UNION ALL
SELECT id, 'Falafel Plate',        'Crispy chickpea fritters with hummus & tabbouleh', 279, 'main',      'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80', true FROM restaurants WHERE name='Olive Garden' UNION ALL
SELECT id, 'Hummus & Pita',        'Creamy hummus with warm pita & olive oil',          179, 'appetizer', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80', true FROM restaurants WHERE name='Olive Garden' UNION ALL
SELECT id, 'Greek Salad',          'Cucumber, tomato, olives, feta & oregano',          229, 'appetizer', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', true FROM restaurants WHERE name='Olive Garden';

-- Mumbai Chaat House
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Pani Puri',            'Crispy puris with spiced tamarind water (6 pcs)',   79, 'appetizer', 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80', true FROM restaurants WHERE name='Mumbai Chaat House' UNION ALL
SELECT id, 'Pav Bhaji',            'Spiced mashed vegetables with buttered pav',        149, 'main',      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80', true FROM restaurants WHERE name='Mumbai Chaat House' UNION ALL
SELECT id, 'Bhel Puri',            'Puffed rice, sev, onion & tamarind chutney',         89, 'appetizer', 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80', true FROM restaurants WHERE name='Mumbai Chaat House' UNION ALL
SELECT id, 'Vada Pav',             'Spiced potato fritter in a soft bun',                49, 'main',      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80', true FROM restaurants WHERE name='Mumbai Chaat House';

-- The Fish Market
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Grilled Pomfret',      'Whole pomfret marinated in Goan masala & grilled', 599, 'main',      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80', true FROM restaurants WHERE name='The Fish Market' UNION ALL
SELECT id, 'Prawn Koliwada',       'Crispy batter-fried prawns with mint chutney',      449, 'main',      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80', true FROM restaurants WHERE name='The Fish Market' UNION ALL
SELECT id, 'Fish & Chips',         'Beer-battered fish fillet with tartar sauce',        399, 'main',      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80', true FROM restaurants WHERE name='The Fish Market' UNION ALL
SELECT id, 'Clam Soup',            'Coastal clam broth with coconut & pepper',           199, 'appetizer', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80', true FROM restaurants WHERE name='The Fish Market';

-- Roll Station
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Chicken Kathi Roll',   'Grilled chicken tikka wrapped in flaky paratha',   179, 'main',      'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80', true FROM restaurants WHERE name='Roll Station' UNION ALL
SELECT id, 'Paneer Frankie',       'Spiced paneer & onion in a soft roll',              159, 'main',      'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80', true FROM restaurants WHERE name='Roll Station' UNION ALL
SELECT id, 'Egg Roll',             'Egg omelette wrapped with onion & green chutney',   129, 'main',      'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80', true FROM restaurants WHERE name='Roll Station' UNION ALL
SELECT id, 'Masala Chai',          'Spiced Indian tea with ginger & cardamom',           39, 'drinks',    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80', true FROM restaurants WHERE name='Roll Station';

-- Beirut Bites
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Lamb Shawarma Wrap',   'Slow-roasted lamb with garlic sauce in flatbread', 329, 'main',      'https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=400&q=80', true FROM restaurants WHERE name='Beirut Bites' UNION ALL
SELECT id, 'Mezze Platter',        'Hummus, baba ganoush, falafel & pita',              399, 'appetizer', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80', true FROM restaurants WHERE name='Beirut Bites' UNION ALL
SELECT id, 'Fattoush Salad',       'Crispy pita, tomato, cucumber & sumac dressing',   229, 'appetizer', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', true FROM restaurants WHERE name='Beirut Bites' UNION ALL
SELECT id, 'Baklava',              'Layered filo pastry with pistachio & honey',        149, 'dessert',   'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80', true FROM restaurants WHERE name='Beirut Bites';

-- Smoke & Grill
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'BBQ Pork Ribs',        'Slow-smoked ribs with house BBQ sauce (half rack)', 699, 'main',     'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80', true FROM restaurants WHERE name='Smoke & Grill' UNION ALL
SELECT id, 'Smoked Brisket',       '12-hour smoked beef brisket with pickles & bread', 599, 'main',      'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80', true FROM restaurants WHERE name='Smoke & Grill' UNION ALL
SELECT id, 'Pulled Pork Sandwich', 'Slow-cooked pulled pork on a brioche bun',          399, 'main',      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', true FROM restaurants WHERE name='Smoke & Grill' UNION ALL
SELECT id, 'Coleslaw',             'Creamy cabbage & carrot slaw',                       99, 'appetizer', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', true FROM restaurants WHERE name='Smoke & Grill';

-- Morning Glory
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
SELECT id, 'Eggs Benedict',        'Poached eggs, Canadian bacon & hollandaise on muffin', 349, 'main',  'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80', true FROM restaurants WHERE name='Morning Glory' UNION ALL
SELECT id, 'Blueberry Pancakes',   'Fluffy pancakes with fresh blueberries & maple syrup', 299, 'main',  'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80', true FROM restaurants WHERE name='Morning Glory' UNION ALL
SELECT id, 'Full English Breakfast','Eggs, sausage, bacon, beans, toast & grilled tomato', 399, 'main',  'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80', true FROM restaurants WHERE name='Morning Glory' UNION ALL
SELECT id, 'Fresh Orange Juice',   'Cold-pressed seasonal oranges',                       129, 'drinks',  'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80', true FROM restaurants WHERE name='Morning Glory';

