create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(btrim(full_name)) between 2 and 120),
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  amount numeric(12, 2) not null check (amount > 0),
  category text not null check (char_length(btrim(category)) between 1 and 80),
  description text not null check (char_length(btrim(description)) between 1 and 240),
  payment_method text not null default 'Other' check (char_length(btrim(payment_method)) between 1 and 80),
  transaction_date timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category text not null check (char_length(btrim(category)) between 1 and 80),
  budget_amount numeric(12, 2) not null check (budget_amount > 0),
  period text not null check (period in ('weekly', 'monthly', 'semester')),
  created_at timestamptz not null default now(),
  unique (user_id, category, period)
);

create table if not exists public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  goal_name text not null check (char_length(btrim(goal_name)) between 1 and 120),
  category text not null default 'General' check (char_length(btrim(category)) between 1 and 80),
  target_amount numeric(12, 2) not null check (target_amount > 0),
  current_amount numeric(12, 2) not null default 0 check (current_amount >= 0 and current_amount <= target_amount),
  deadline date,
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_date_idx on public.transactions (user_id, transaction_date desc);
create index if not exists transactions_user_category_idx on public.transactions (user_id, category);
create index if not exists budgets_user_idx on public.budgets (user_id);
create index if not exists savings_goals_user_idx on public.savings_goals (user_id);

alter table public.profiles enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.savings_goals enable row level security;

drop policy if exists "Profiles are readable by their owner" on public.profiles;
create policy "Profiles are readable by their owner" on public.profiles for select to authenticated using ((select auth.uid()) = id);
drop policy if exists "Profiles are editable by their owner" on public.profiles;
create policy "Profiles are editable by their owner" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "Users manage their own transactions" on public.transactions;
create policy "Users manage their own transactions" on public.transactions for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "Users manage their own budgets" on public.budgets;
create policy "Users manage their own budgets" on public.budgets for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "Users manage their own savings goals" on public.savings_goals;
create policy "Users manage their own savings goals" on public.savings_goals for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.transactions to authenticated;
grant select, insert, update, delete on public.budgets to authenticated;
grant select, insert, update, delete on public.savings_goals to authenticated;

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists create_profile_after_signup on auth.users;
create trigger create_profile_after_signup
  after insert on auth.users
  for each row execute procedure public.create_profile_for_new_user();

revoke all on function public.create_profile_for_new_user() from public, anon, authenticated;

insert into public.profiles (id, full_name, email)
select
  users.id,
  coalesce(nullif(btrim(users.raw_user_meta_data ->> 'full_name'), ''), split_part(users.email, '@', 1)),
  users.email
from auth.users as users
where users.email is not null
on conflict (id) do nothing;
