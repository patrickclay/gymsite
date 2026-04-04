-- Fitness Tracker Tables
-- Run this in your Supabase SQL editor to set up the tracker database

-- Student profiles with daily targets
create table if not exists tracker_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null default '',
  calorie_target integer not null default 2000,
  protein_target integer not null default 150,
  carbs_target integer not null default 250,
  fat_target integer not null default 65,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Meals (breakfast, lunch, dinner, snack)
create table if not exists tracker_meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  date date not null,
  created_at timestamptz not null default now()
);

-- Dishes within a meal
create table if not exists tracker_dishes (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references tracker_meals(id) on delete cascade,
  name text not null,
  calories numeric not null default 0,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fat numeric not null default 0,
  fiber numeric not null default 0,
  sugar numeric not null default 0,
  sodium numeric not null default 0,
  serving_size text not null default '',
  created_at timestamptz not null default now()
);

-- Exercise entries
create table if not exists tracker_exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  exercise_type text not null check (exercise_type in ('cardio', 'strength', 'flexibility', 'sports', 'other')),
  duration_minutes numeric not null default 0,
  calories_burned numeric not null default 0,
  notes text not null default '',
  date date not null,
  created_at timestamptz not null default now()
);

-- Indexes for fast date-based lookups
create index if not exists idx_tracker_meals_user_date on tracker_meals(user_id, date);
create index if not exists idx_tracker_exercises_user_date on tracker_exercises(user_id, date);

-- Row Level Security: each student can only see/edit their own data
alter table tracker_profiles enable row level security;
alter table tracker_meals enable row level security;
alter table tracker_dishes enable row level security;
alter table tracker_exercises enable row level security;

-- Profiles: users can read/write their own profile
create policy "Users can view own profile"
  on tracker_profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on tracker_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on tracker_profiles for update
  using (auth.uid() = id);

-- Meals: users can CRUD their own meals
create policy "Users can view own meals"
  on tracker_meals for select
  using (auth.uid() = user_id);

create policy "Users can insert own meals"
  on tracker_meals for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own meals"
  on tracker_meals for delete
  using (auth.uid() = user_id);

-- Dishes: users can CRUD dishes in their own meals
create policy "Users can view own dishes"
  on tracker_dishes for select
  using (meal_id in (select id from tracker_meals where user_id = auth.uid()));

create policy "Users can insert own dishes"
  on tracker_dishes for insert
  with check (meal_id in (select id from tracker_meals where user_id = auth.uid()));

create policy "Users can update own dishes"
  on tracker_dishes for update
  using (meal_id in (select id from tracker_meals where user_id = auth.uid()));

create policy "Users can delete own dishes"
  on tracker_dishes for delete
  using (meal_id in (select id from tracker_meals where user_id = auth.uid()));

-- Exercises: users can CRUD their own exercises
create policy "Users can view own exercises"
  on tracker_exercises for select
  using (auth.uid() = user_id);

create policy "Users can insert own exercises"
  on tracker_exercises for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own exercises"
  on tracker_exercises for delete
  using (auth.uid() = user_id);

-- ── Admin policies ──────────────────────────────────────────────────────────
-- Admins (is_admin = true) can view ALL students' data

-- Helper function to check if the current user is an admin
create or replace function is_tracker_admin()
returns boolean as $$
  select exists (
    select 1 from tracker_profiles
    where id = auth.uid() and is_admin = true
  );
$$ language sql security definer;

create policy "Admins can view all profiles"
  on tracker_profiles for select
  using (is_tracker_admin());

create policy "Admins can view all meals"
  on tracker_meals for select
  using (is_tracker_admin());

create policy "Admins can view all dishes"
  on tracker_dishes for select
  using (is_tracker_admin());

create policy "Admins can view all exercises"
  on tracker_exercises for select
  using (is_tracker_admin());
