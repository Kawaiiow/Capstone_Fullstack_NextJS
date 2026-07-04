-- ============================================================
-- Profiles Table Migration
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'pending'
    check (role in ('pending', 'member', 'staff', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Enable Row Level Security
alter table public.profiles enable row level security;
-- 3. RLS Policies
-- Helper function to check if the current user is an admin without recursion
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Drop old policies to prevent collision/errors
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Admins can read all profiles" on public.profiles;
drop policy if exists "Admins can update all profiles" on public.profiles;

-- Everyone can read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Admins can read all profiles
create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());

-- Admins can update all profiles
create policy "Admins can update all profiles"
  on public.profiles for update
  using (public.is_admin());
-- 4. Auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profiles_updated
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- 5. Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'pending')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- 6. Seed existing users into profiles (run once)
insert into public.profiles (id, role)
select
  id,
  coalesce(raw_user_meta_data->>'role', 'member')
from auth.users
on conflict (id) do nothing;
