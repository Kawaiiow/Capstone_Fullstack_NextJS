-- ============================================================
-- Notifications Table Migration
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Create notifications table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2. Enable Row Level Security
alter table public.notifications enable row level security;

-- Drop old policies to prevent collision/errors
drop policy if exists "Users can read own notifications" on public.notifications;
drop policy if exists "Users can update own notifications" on public.notifications;
drop policy if exists "Admins can insert notifications" on public.notifications;
drop policy if exists "Admins can read all notifications" on public.notifications;
drop policy if exists "Admins can update all notifications" on public.notifications;

-- 3. RLS Policies
-- Users can read own notifications
create policy "Users can read own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

-- Users can update own notifications (to mark as read)
create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- Admins can create or read all notifications
create policy "Admins can insert notifications"
  on public.notifications for insert
  with check (public.is_admin());

create policy "Admins can read all notifications"
  on public.notifications for select
  using (public.is_admin());

create policy "Admins can update all notifications"
  on public.notifications for update
  using (public.is_admin());

-- Users can insert their own notifications
create policy "Users can insert own notifications"
  on public.notifications for insert
  with check (auth.uid() = user_id);

-- Staff can insert notifications (for anyone)
create policy "Staff can insert notifications"
  on public.notifications for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'staff')
    )
  );
