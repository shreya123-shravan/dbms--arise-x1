-- Fix Broken Image URLs and Update Ratings
-- Run this in Supabase SQL Editor

-- Update restaurant images and ratings
UPDATE restaurants SET 
  image_url = 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
  rating = 4.8
WHERE name = 'Tokyo Sushi Bar';

UPDATE restaurants SET 
  image_url = 'https://images.unsplash.com/photo-1557872943-16a5ac26437e',
  rating = 4.3
WHERE name = 'Ramen House';

UPDATE restaurants SET 
  image_url = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
  rating = 4.7
WHERE name = 'Bella Italia';

UPDATE restaurants SET 
  image_url = 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9',
  rating = 4.2
WHERE name = 'Pasta Paradise';

UPDATE restaurants SET 
  image_url = 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
  rating = 4.9
WHERE name = 'Spice Garden';

UPDATE restaurants SET 
  image_url = 'https://images.unsplash.com/photo-1630383249896-424e482df921',
  rating = 4.5
WHERE name = 'Dosa Corner';

UPDATE restaurants SET 
  image_url = 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43',
  rating = 4.6
WHERE name = 'Dragon Wok';

UPDATE restaurants SET 
  image_url = 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624',
  rating = 4.1
WHERE name = 'Noodle Express';

UPDATE restaurants SET 
  image_url = 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47',
  rating = 4.4
WHERE name = 'Taco Fiesta';

UPDATE restaurants SET 
  image_url = 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f',
  rating = 4.3
WHERE name = 'Burrito Bowl';

UPDATE restaurants SET 
  image_url = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
  rating = 4.8
WHERE name = 'Green Bowl';

UPDATE restaurants SET 
  image_url = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  rating = 4.6
WHERE name = 'Fit Kitchen';

UPDATE restaurants SET 
  image_url = 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9',
  rating = 4.5
WHERE name = 'Seoul Kitchen';

UPDATE restaurants SET 
  image_url = 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec',
  rating = 4.4
WHERE name = 'K-Pop Bites';
