-- Tosh note: database schema and Row Level Security policies
-- Run this in the Supabase SQL editor (Project -> SQL Editor -> New query)
-- for the project you created for this app.

-- 1. Table -------------------------------------------------------------

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default '',
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at current on every edit.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists notes_set_updated_at on public.notes;
create trigger notes_set_updated_at
  before update on public.notes
  for each row
  execute function public.set_updated_at();

-- Speeds up "my notes, newest first" queries.
create index if not exists notes_user_id_created_at_idx
  on public.notes (user_id, created_at desc);

-- 2. Row Level Security -------------------------------------------------

alter table public.notes enable row level security;

-- Belt-and-suspenders: force RLS even for the table owner role.
alter table public.notes force row level security;

-- Users can only ever see their own notes.
drop policy if exists "Users can view their own notes" on public.notes;
create policy "Users can view their own notes"
  on public.notes
  for select
  using (auth.uid() = user_id);

-- Users can only insert notes attributed to themselves.
drop policy if exists "Users can insert their own notes" on public.notes;
create policy "Users can insert their own notes"
  on public.notes
  for insert
  with check (auth.uid() = user_id);

-- Users can only update their own notes (and can't reassign them
-- to someone else via update).
drop policy if exists "Users can update their own notes" on public.notes;
create policy "Users can update their own notes"
  on public.notes
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can only delete their own notes.
drop policy if exists "Users can delete their own notes" on public.notes;
create policy "Users can delete their own notes"
  on public.notes
  for delete
  using (auth.uid() = user_id);
