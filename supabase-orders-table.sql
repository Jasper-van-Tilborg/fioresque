-- Run this once in Supabase SQL Editor to create the orders table (no Prisma).

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  "firstName" text not null,
  "lastName" text not null,
  address text not null,
  city text not null,
  "postalCode" text not null,
  country text not null,
  phone text,
  items jsonb not null,
  "totalAmount" integer not null,
  status text not null,
  "molliePaymentId" text,
  "printifyOrderId" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

-- Optional: enable RLS and allow service role full access (service role bypasses RLS by default).
-- alter table public.orders enable row level security;
