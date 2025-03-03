/*
  # Update customers table and policies

  1. Table Updates
    - Ensures the customers table exists with all required fields
    - Adds user_id field to link customers to authenticated users
  
  2. Security
    - Ensures Row Level Security is enabled
    - Adds policy for unauthenticated users to insert customer data (for guest checkout)
*/

-- Create customers table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'customers') THEN
    CREATE TABLE customers (
      id text PRIMARY KEY,
      name text NOT NULL,
      email text NOT NULL,
      phone text NOT NULL,
      purchase_date timestamptz NOT NULL,
      total numeric NOT NULL,
      payment_method text NOT NULL,
      items jsonb NOT NULL,
      created_at timestamptz DEFAULT now(),
      user_id uuid REFERENCES auth.users(id)
    );
  END IF;
END $$;

-- Enable Row Level Security if not already enabled
DO $$ 
BEGIN
  EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', 'customers');
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Create policy for unauthenticated users to insert customer data
-- This is needed for guest checkout
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'customers' 
    AND policyname = 'Allow unauthenticated users to insert customers'
  ) THEN
    CREATE POLICY "Allow unauthenticated users to insert customers"
      ON customers
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END $$;

-- Add user_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'customers' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE customers ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;