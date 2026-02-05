-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Customers Table
create table public.customers (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text,
  phone text,
  stamps integer default 0,
  visits integer default 0,
  last_visit timestamp with time zone,
  status text default 'active' check (status in ('active', 'inactive', 'banned')),
  tier text default 'Bronze'
);

-- 2. Create Transactions (Stamps) Table
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  customer_id uuid references public.customers(id) on delete cascade not null,
  amount integer not null, -- Positive for earning, Negative for redeeming
  type text not null check (type in ('earn', 'redeem')),
  description text
);

-- 3. Insert specific Demo Data
insert into public.customers (name, email, phone, stamps, visits, last_visit, status, tier)
values
  ('Juan Pérez', 'juan@gmail.com', '+51 999 000 111', 4, 12, now(), 'active', 'Silver'),
  ('Maria Garcia', 'maria@hotmail.com', '+51 999 123 456', 8, 24, now() - interval '2 days', 'active', 'Gold'),
  ('Carlos Lopez', 'carlos@yahoo.com', '+51 987 654 321', 1, 3, now() - interval '5 days', 'active', 'Bronze'),
  ('Ana Torres', 'ana.torres@outlook.com', '+51 955 444 333', 10, 45, now() - interval '1 day', 'active', 'Platinum');

-- 4. Enable Row Level Security (RLS)
alter table public.customers enable row level security;
alter table public.transactions enable row level security;

-- 5. Create Policies (Allow Public Read/Write for now for development, lock down later)
create policy "Enable read access for all users" on public.customers for select using (true);
create policy "Enable insert for all users" on public.customers for insert with check (true);
create policy "Enable update for all users" on public.customers for update using (true);

create policy "Enable read access for all users" on public.transactions for select using (true);
