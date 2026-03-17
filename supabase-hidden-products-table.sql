-- Run once in Supabase SQL Editor (for admin product visibility toggle).

create table if not exists public.hidden_products (
  printify_product_id text primary key
);
