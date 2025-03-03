/*
  # Create customers table and authentication

  1. New Tables
    - `customers`
      - `id` (text, primary key)
      - `name` (text, not null)
      - `email` (text, not null)
      - `phone` (text, not null)
      - `purchase_date` (timestamptz, not null)
      - `total` (numeric, not null)
      - `payment_method` (text, not null)
      - `items` (jsonb, not null)
      - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `customers` table
    - Add policy for authenticated users to read all customer data
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  purchase_date timestamptz NOT NULL,
  total numeric NOT NULL,
  payment_method text NOT NULL,
  items jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all customer data
CREATE POLICY "Allow authenticated users to read all customers"
  ON customers
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to insert customer data
CREATE POLICY "Allow authenticated users to insert customers"
  ON customers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);