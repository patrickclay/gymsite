-- Phase 1B: Admin expansion (run in Supabase SQL Editor)

-- Add cancelled_at to bookings for soft-cancel tracking
alter table bookings add column if not exists cancelled_at timestamptz;

-- RLS for email_signups (service role needs to read for broadcast)
alter table email_signups enable row level security;

-- Service role can read email_signups (for broadcast feature)
create policy "Allow service role read email_signups" on email_signups
  for select using (auth.role() = 'service_role');

-- Index for filtering bookings by status
create index if not exists idx_bookings_status on bookings(status);
