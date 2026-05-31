-- Youker Fit Database Schema

-- 1. Profiles Table
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  age int,
  gender text,
  height_cm numeric,
  start_weight numeric,
  current_weight numeric,
  target_weight numeric,
  activity_level text,
  goal text,
  bmr numeric,
  tdee numeric,
  daily_calorie_target numeric,
  daily_protein_target numeric,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Foods Table
create table if not exists foods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  aliases text[],
  calories_per_100g numeric not null,
  protein_per_100g numeric default 0,
  carbs_per_100g numeric default 0,
  fat_per_100g numeric default 0,
  default_serving_gram numeric,
  default_serving_name text,
  category text,
  created_at timestamp with time zone default now()
);

-- 3. Food Logs Table
create table if not exists food_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  food_id uuid references foods(id),
  food_name text not null,
  quantity numeric default 1,
  serving_unit text,
  serving_gram numeric,
  total_gram numeric,
  estimated_calories numeric,
  estimated_protein numeric,
  estimated_carbs numeric,
  estimated_fat numeric,
  meal_time text,
  log_date date default current_date,
  note text,
  created_at timestamp with time zone default now()
);

-- 4. Exercise Types Table
create table if not exists exercise_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  aliases text[],
  met_value numeric,
  calculation_type text,
  category text,
  created_at timestamp with time zone default now()
);

-- 5. Exercise Logs Table
create table if not exists exercise_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  exercise_type_id uuid references exercise_types(id),
  exercise_name text not null,
  duration_minutes numeric,
  distance_km numeric,
  intensity text,
  estimated_calories_burned numeric,
  log_date date default current_date,
  note text,
  created_at timestamp with time zone default now()
);

-- 6. Weight Logs Table
create table if not exists weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  weight numeric not null,
  log_date date default current_date,
  note text,
  created_at timestamp with time zone default now()
);

-- Note: 
-- You can run this entire script in the Supabase SQL Editor.
-- After running this, don't forget to set up Row Level Security (RLS) policies 
-- in the Authentication settings to protect user data.
