-- Add Test Customers with Authentication
-- Run this in Supabase SQL Editor

-- Delete existing records if any
DELETE FROM customers WHERE email IN ('shreya12@gmail.com', 'goku@test.com');

-- STEP 1: Create customers table records
INSERT INTO customers (id, email, name, phone, address, city) VALUES
(
  '33333333-3333-3333-3333-333333333333',
  'shreya12@gmail.com',
  'Shreya',
  '+91-9876543220',
  '123 MG Road, Apartment 5B',
  'Mumbai'
),
(
  '22222222-2222-2222-2222-222222222222',
  'goku@test.com',
  'Goku',
  '+91-9876543221',
  '456 Capsule Corp, West City',
  'Mumbai'
);

-- ============================================
-- STEP 2: Add Auth Users Manually
-- ============================================
-- Go to: Authentication → Users → Add user → Create new user
--
-- User 1:
-- - Email: shreya12@gmail.com
-- - Password: 1234567
-- - User UID: 33333333-3333-3333-3333-333333333333
-- - ✅ Auto Confirm User: YES
--
-- User 2:
-- - Email: goku@test.com
-- - Password: 12092005
-- - User UID: 22222222-2222-2222-2222-222222222222
-- - ✅ Auto Confirm User: YES
-- ============================================
