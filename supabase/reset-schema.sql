-- ⚠️ WARNING: This will DELETE ALL DATA!
-- Only run this if you want to start fresh

-- Drop all tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS walks CASCADE;
DROP TABLE IF EXISTS moods CASCADE;
DROP TABLE IF EXISTS hydration CASCADE;
DROP TABLE IF EXISTS user_quests CASCADE;
DROP TABLE IF EXISTS quests CASCADE;
DROP TABLE IF EXISTS meals CASCADE;
DROP TABLE IF EXISTS leaderboard CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_user_xp(UUID, INTEGER);
DROP FUNCTION IF EXISTS refresh_leaderboard_ranks();

-- Now run the main schema.sql file after this
