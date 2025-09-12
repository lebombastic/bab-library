-- Tables
create table if not exists public.books (
	id uuid primary key default gen_random_uuid(),
	title text not null,
	author text not null,
	genre text not null,
	available boolean not null default true,
	description text not null,
	cover_image text not null
);

create table if not exists public.events (
	id uuid primary key default gen_random_uuid(),
	title text not null,
	date text not null,
	time text not null,
	description text not null,
	whatsapp_group text not null
);

create table if not exists public.event_templates (
	id uuid primary key default gen_random_uuid(),
	title text not null,
	default_time text not null,
	description text not null,
	whatsapp_group text not null,
	category text not null
);

create table if not exists public.settings (
	key text primary key,
	value text not null
);

-- RLS (optional simple read access)
alter table public.books enable row level security;
alter table public.events enable row level security;
alter table public.event_templates enable row level security;
alter table public.settings enable row level security;

drop policy if exists "Allow anon read" on public.books;
drop policy if exists "Allow anon read" on public.events;
drop policy if exists "Allow anon read" on public.event_templates;
drop policy if exists "Allow anon write" on public.books;
drop policy if exists "Allow anon write" on public.events;
drop policy if exists "Allow anon write" on public.event_templates;

create policy "Allow anon read" on public.books for select using (true);
create policy "Allow anon read" on public.events for select using (true);
create policy "Allow anon read" on public.event_templates for select using (true);

create policy "Allow anon write" on public.books for all using (true);
create policy "Allow anon write" on public.events for all using (true);
create policy "Allow anon write" on public.event_templates for all using (true);
-- Do NOT allow reading settings without auth in production. For demo only you may allow select, better to protect settings.

-- Secure password verification function (server-side)
-- Requires pgcrypto extension for crypt()
create extension if not exists pgcrypto;

create or replace function public.verify_admin_password(candidate text)
returns boolean
language plpgsql
security definer
as $$
declare
  stored_hash text;
begin
  select value into stored_hash from public.settings where key = 'admin_password_hash' limit 1;
  if stored_hash is null then
    return false;
  end if;
  return crypt(candidate, stored_hash) = stored_hash;
end;
$$;

revoke all on function public.verify_admin_password(text) from public;
grant execute on function public.verify_admin_password(text) to anon;


