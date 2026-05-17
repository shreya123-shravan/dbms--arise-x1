-- Add unique constraint on restaurant name to prevent duplicates
-- Run this in Supabase SQL Editor if you have duplicate restaurants

-- First, remove duplicate restaurants (keep the one with the lowest created_at)
DELETE FROM restaurants
WHERE id NOT IN (
  SELECT DISTINCT ON (name) id
  FROM restaurants
  ORDER BY name, created_at ASC
);

-- Add unique constraint
ALTER TABLE restaurants ADD CONSTRAINT restaurants_name_unique UNIQUE (name);
