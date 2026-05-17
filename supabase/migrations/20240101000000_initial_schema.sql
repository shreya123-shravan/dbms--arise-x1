-- ARISE-X1 Database Schema
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  phone text,
  default_address text,
  xp integer not null default 0,
  level integer not null default 1,
  coins integer not null default 0,
  streak integer not null default 0,
  health_goal text default 'balanced',
  dietary_preference text default 'non_vegetarian',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Restaurants
create table public.restaurants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  image_url text,
  cuisine_type text not null default 'Multi-cuisine',
  rating numeric(2,1) not null default 4.0,
  delivery_time_min integer not null default 20,
  delivery_time_max integer not null default 40,
  delivery_fee numeric(10,2) not null default 0,
  min_order numeric(10,2) not null default 0,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  address text,
  created_at timestamptz not null default now()
);
alter table public.restaurants enable row level security;
create policy "Anyone can view active restaurants" on public.restaurants for select using (is_active = true);

-- Menu Items
create table public.menu_items (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references public.restaurants on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text,
  category text not null default 'Main Course',
  is_vegetarian boolean not null default false,
  is_vegan boolean not null default false,
  is_spicy boolean not null default false,
  is_available boolean not null default true,
  calories integer,
  created_at timestamptz not null default now()
);
alter table public.menu_items enable row level security;
create policy "Anyone can view available menu items" on public.menu_items for select using (is_available = true);

-- Cart Items
create table public.cart_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  menu_item_id uuid not null references public.menu_items on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  special_instructions text,
  created_at timestamptz not null default now(),
  unique(user_id, menu_item_id)
);
alter table public.cart_items enable row level security;
create policy "Users manage own cart" on public.cart_items for all using (auth.uid() = user_id);

-- Orders
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  restaurant_id uuid not null references public.restaurants,
  status text not null default 'pending',
  subtotal numeric(10,2) not null,
  delivery_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  delivery_address text not null,
  special_instructions text,
  stripe_session_id text,
  estimated_delivery timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.orders enable row level security;
create policy "Users view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users create own orders" on public.orders for insert with check (auth.uid() = user_id);

-- Order Items
create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders on delete cascade,
  menu_item_id uuid not null references public.menu_items,
  quantity integer not null,
  unit_price numeric(10,2) not null,
  subtotal numeric(10,2) not null,
  special_instructions text
);
alter table public.order_items enable row level security;
create policy "Users view own order items" on public.order_items for select
  using (exists (select 1 from public.orders where orders.id = order_id and orders.user_id = auth.uid()));

-- Quests
create table public.quests (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  category text not null default 'nutrition',
  difficulty text not null default 'easy',
  xp_reward integer not null default 50,
  coin_reward integer not null default 10,
  target integer not null default 1,
  action_label text not null default 'Complete',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.quests enable row level security;
create policy "Anyone can view active quests" on public.quests for select using (is_active = true);

-- User Quest Progress
create table public.user_quests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  quest_id uuid not null references public.quests on delete cascade,
  progress integer not null default 0,
  status text not null default 'active',
  claimed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(user_id, quest_id)
);
alter table public.user_quests enable row level security;
create policy "Users manage own quest progress" on public.user_quests for all using (auth.uid() = user_id);

-- Favorites
create table public.favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  restaurant_id uuid not null references public.restaurants on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, restaurant_id)
);
alter table public.favorites enable row level security;
create policy "Users manage own favorites" on public.favorites for all using (auth.uid() = user_id);

-- Seed: Sample restaurants
insert into public.restaurants (name, description, cuisine_type, rating, delivery_time_min, delivery_time_max, delivery_fee, min_order, is_featured) values
  ('Green Bowl', 'Healthy salads and bowls', 'Healthy', 4.8, 20, 35, 29, 199, true),
  ('Spice Route', 'Authentic Indian cuisine', 'Indian', 4.6, 25, 45, 39, 299, true),
  ('Burger Lab', 'Gourmet burgers and fries', 'American', 4.5, 15, 30, 49, 199, false),
  ('Sushi Zen', 'Fresh Japanese sushi', 'Japanese', 4.9, 30, 50, 59, 399, true),
  ('Pizza Planet', 'Wood-fired artisan pizzas', 'Italian', 4.4, 20, 40, 39, 249, false);

-- Seed: Sample quests
insert into public.quests (title, description, category, difficulty, xp_reward, coin_reward, target, action_label) values
  ('Hydration Hero', 'Drink 8 glasses of water today', 'hydration', 'easy', 50, 10, 8, 'Log Water'),
  ('Protein Power', 'Hit 100g protein in your meals', 'nutrition', 'medium', 100, 20, 100, 'Log Meal'),
  ('Step Master', 'Walk 10,000 steps today', 'movement', 'hard', 200, 40, 10000, 'Track Steps'),
  ('Mindful Eater', 'Log 3 meals with mood tracking', 'mindfulness', 'easy', 75, 15, 3, 'Log Meal'),
  ('Veggie Boost', 'Order a vegetarian meal', 'nutrition', 'easy', 60, 12, 1, 'Order Now');
