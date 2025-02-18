/*
  # Add products table and admin role

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `category` (text)
      - `image` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on products table
    - Add admin role and policies
*/

-- Create admin role
CREATE ROLE admin;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  category text NOT NULL,
  image text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Everyone can view products"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify products"
  ON products
  USING (auth.jwt()->>'role' = 'admin')
  WITH CHECK (auth.jwt()->>'role' = 'admin');

-- Grant admin access to all tables
GRANT ALL ON products TO admin;
GRANT ALL ON profiles TO admin;
GRANT ALL ON orders TO admin;
GRANT ALL ON order_items TO admin;