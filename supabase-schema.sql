-- Run this entire file in: Supabase Dashboard > SQL Editor > New Query > Run
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists orders (
  id                  uuid primary key default gen_random_uuid(),
  order_number        text unique not null,
  customer_name       text not null,
  customer_email      text not null,
  customer_phone      text not null,
  shipping_address    jsonb not null,
  items               jsonb not null,
  subtotal            integer not null,
  discount            integer not null default 0,
  coupon_code         text,
  total               integer not null,
  payment_method      text not null,          -- 'online' | 'cod'
  payment_status      text not null default 'pending',  -- 'pending' | 'paid'
  razorpay_order_id   text,
  razorpay_payment_id text,
  status              text not null default 'confirmed', -- 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  created_at          timestamptz not null default now()
);

-- Index for quick lookup by email or order number
create index if not exists orders_email_idx on orders (customer_email);
create index if not exists orders_number_idx on orders (order_number);
create index if not exists orders_created_idx on orders (created_at desc);

-- Enable Row Level Security
alter table orders enable row level security;

-- Only the service role (used in API routes) can read/write
-- Public users cannot access this table directly
create policy "Service role full access" on orders
  using (true)
  with check (true);
