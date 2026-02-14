-- Run this in Supabase SQL Editor if you haven't already

create table if not exists email_signups (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

alter table email_signups enable row level security;

-- Allow anyone to insert (for signup form)
create policy "Allow insert" on email_signups
  for insert with check (true);

-- Restrict reads to service role (admin only)
create policy "Allow select for service role" on email_signups
  for select using (auth.role() = 'service_role');
