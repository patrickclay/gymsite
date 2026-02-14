-- Phase 1A: Classes and bookings (run in Supabase SQL Editor)
-- Price in cents; default $35 = 3500

create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  instructor text not null,
  start_time timestamptz not null,
  duration_minutes int not null default 60,
  capacity int not null default 12,
  price_cents int not null default 3500,
  description text,
  created_at timestamptz default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes(id) on delete cascade not null,
  customer_email text not null,
  customer_name text not null,
  customer_phone text,
  status text not null default 'confirmed',
  created_at timestamptz default now()
);

alter table classes enable row level security;
alter table bookings enable row level security;

-- Classes: anyone can read (for schedule page)
create policy "Allow public read classes" on classes for select using (true);
-- Only service role can insert/update/delete (admin uses service role key)
create policy "Allow service role insert classes" on classes for insert with check (auth.role() = 'service_role');
create policy "Allow service role update classes" on classes for update using (auth.role() = 'service_role');
create policy "Allow service role delete classes" on classes for delete using (auth.role() = 'service_role');

-- Bookings: anyone can insert (sign up)
create policy "Allow insert bookings" on bookings for insert with check (true);
-- Only service role can read/update/delete
create policy "Allow service role read bookings" on bookings
  for select using (auth.role() = 'service_role');
create policy "Allow service role update bookings" on bookings
  for update using (auth.role() = 'service_role');
create policy "Allow service role delete bookings" on bookings
  for delete using (auth.role() = 'service_role');

-- Optional: index for schedule queries
create index if not exists idx_classes_start_time on classes(start_time);
create index if not exists idx_bookings_class_id on bookings(class_id);
