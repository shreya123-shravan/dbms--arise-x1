-- ARISE-X1 Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meals table
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein DECIMAL(5,1),
  carbs DECIMAL(5,1),
  fat DECIMAL(5,1),
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  image_url TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quests table
CREATE TABLE quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER NOT NULL,
  quest_type TEXT CHECK (quest_type IN ('daily', 'weekly', 'special')),
  category TEXT,
  target_value INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User quests (progress tracking)
CREATE TABLE user_quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quest_id UUID REFERENCES quests(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, quest_id)
);

-- Hydration tracking
CREATE TABLE hydration (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount_ml INTEGER NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leaderboard (materialized view updated daily)
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  total_xp INTEGER NOT NULL,
  level INTEGER NOT NULL,
  rank INTEGER,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Mood tracking
CREATE TABLE moods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mood TEXT CHECK (mood IN ('energized', 'happy', 'neutral', 'tired', 'stressed')),
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Walking/exploration data
CREATE TABLE walks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  distance_km DECIMAL(5,2) NOT NULL,
  duration_minutes INTEGER,
  xp_earned INTEGER,
  route_data JSONB,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  plan_type TEXT CHECK (plan_type IN ('free', 'pro', 'elite')) DEFAULT 'free',
  status TEXT CHECK (status IN ('active', 'cancelled', 'expired', 'trial')) DEFAULT 'free',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  payment_provider TEXT,
  payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment transactions
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  payment_provider TEXT NOT NULL,
  payment_id TEXT,
  payment_method TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_meals_user_id ON meals(user_id);
CREATE INDEX idx_meals_logged_at ON meals(logged_at DESC);
CREATE INDEX idx_user_quests_user_id ON user_quests(user_id);
CREATE INDEX idx_hydration_user_id ON hydration(user_id);
CREATE INDEX idx_hydration_logged_at ON hydration(logged_at DESC);
CREATE INDEX idx_leaderboard_rank ON leaderboard(rank);
CREATE INDEX idx_moods_user_id ON moods(user_id);
CREATE INDEX idx_walks_user_id ON walks(user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE hydration ENABLE ROW LEVEL SECURITY;
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE walks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Meals policies
CREATE POLICY "Users can view own meals" ON meals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meals" ON meals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals" ON meals
  FOR DELETE USING (auth.uid() = user_id);

-- User quests policies
CREATE POLICY "Users can view own quests" ON user_quests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own quest progress" ON user_quests
  FOR ALL USING (auth.uid() = user_id);

-- Hydration policies
CREATE POLICY "Users can view own hydration" ON hydration
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can log hydration" ON hydration
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Moods policies
CREATE POLICY "Users can view own moods" ON moods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can log moods" ON moods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Walks policies
CREATE POLICY "Users can view own walks" ON walks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can log walks" ON walks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- Leaderboard is public (read-only)
CREATE POLICY "Leaderboard is public" ON leaderboard
  FOR SELECT TO authenticated USING (true);

-- Quests are public (read-only)
CREATE POLICY "Quests are public" ON quests
  FOR SELECT TO authenticated USING (is_active = true);

-- Function to update user XP and level
CREATE OR REPLACE FUNCTION update_user_xp(
  p_user_id UUID,
  p_xp_gain INTEGER
)
RETURNS void AS $$
DECLARE
  v_new_xp INTEGER;
  v_new_total_xp INTEGER;
  v_new_level INTEGER;
BEGIN
  -- Get current values
  SELECT xp, total_xp, level INTO v_new_xp, v_new_total_xp, v_new_level
  FROM users WHERE id = p_user_id;
  
  -- Add XP
  v_new_xp := v_new_xp + p_xp_gain;
  v_new_total_xp := v_new_total_xp + p_xp_gain;
  
  -- Level up logic (100 XP per level)
  WHILE v_new_xp >= 100 LOOP
    v_new_level := v_new_level + 1;
    v_new_xp := v_new_xp - 100;
  END LOOP;
  
  -- Update user
  UPDATE users 
  SET xp = v_new_xp, 
      total_xp = v_new_total_xp, 
      level = v_new_level,
      updated_at = NOW()
  WHERE id = p_user_id;
  
  -- Update leaderboard
  INSERT INTO leaderboard (user_id, username, total_xp, level, avatar_url)
  SELECT id, username, total_xp, level, avatar_url FROM users WHERE id = p_user_id
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total_xp = EXCLUDED.total_xp,
    level = EXCLUDED.level,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to refresh leaderboard ranks
CREATE OR REPLACE FUNCTION refresh_leaderboard_ranks()
RETURNS void AS $$
BEGIN
  UPDATE leaderboard
  SET rank = ranked.new_rank
  FROM (
    SELECT user_id, ROW_NUMBER() OVER (ORDER BY total_xp DESC) as new_rank
    FROM leaderboard
  ) ranked
  WHERE leaderboard.user_id = ranked.user_id;
END;
$$ LANGUAGE plpgsql;

-- Insert default daily quests
INSERT INTO quests (title, description, xp_reward, quest_type, category, target_value) VALUES
('Log 3 Meals', 'Track breakfast, lunch, and dinner', 50, 'daily', 'nutrition', 3),
('Drink 8 Glasses', 'Stay hydrated with 2L of water', 30, 'daily', 'hydration', 8),
('Walk 5000 Steps', 'Get moving and explore', 40, 'daily', 'activity', 5000),
('Hit Protein Goal', 'Consume 100g+ protein today', 60, 'daily', 'nutrition', 100);

-- Insert weekly quests
INSERT INTO quests (title, description, xp_reward, quest_type, category, target_value) VALUES
('Meal Streak', 'Log meals 7 days in a row', 200, 'weekly', 'consistency', 7),
('Hydration Hero', 'Hit water goal 5 days this week', 150, 'weekly', 'hydration', 5),
('Explorer', 'Walk 25km this week', 250, 'weekly', 'activity', 25);
