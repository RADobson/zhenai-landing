-- ZhenAI Waitlist Table
-- Run this in your Supabase SQL Editor

create table if not exists waitlist (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table waitlist enable row level security;

-- Allow anonymous inserts (for the waitlist form)
create policy "Allow anonymous inserts" on waitlist
  for insert
  with check (true);

-- Only authenticated users (you) can read
create policy "Only admins can read" on waitlist
  for select
  using (auth.role() = 'authenticated');

-- Index on email for uniqueness checks
create index if not exists waitlist_email_idx on waitlist (email);
