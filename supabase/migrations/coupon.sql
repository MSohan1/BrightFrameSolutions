/*
  # Create coupons system

  1. New Tables
    - `coupons`
      - `id` (uuid, primary key)
      - `code` (text, unique)
      - `discount_percentage` (numeric)
      - `max_uses_per_user` (integer)
      - `active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `coupon_uses`
      - `id` (uuid, primary key)
      - `coupon_id` (uuid, references coupons)
      - `user_id` (uuid, references auth.users)
      - `order_id` (uuid, references orders)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for viewing and using coupons
*/

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_percentage numeric(5,2) NOT NULL,
  max_uses_per_user integer NOT NULL DEFAULT 1,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create coupon uses table to track usage
CREATE TABLE IF NOT EXISTS coupon_uses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id uuid REFERENCES coupons NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  order_id uuid REFERENCES orders NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_uses ENABLE ROW LEVEL SECURITY;

-- Policies for coupons
CREATE POLICY "Everyone can view active coupons"
  ON coupons
  FOR SELECT
  TO public
  USING (active = true);

-- Policies for coupon uses
CREATE POLICY "Users can view their own coupon uses"
  ON coupon_uses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coupon uses"
  ON coupon_uses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert the NEW15 coupon
INSERT INTO coupons (code, discount_percentage, max_uses_per_user, active)
VALUES ('NEW15', 15.00, 3, true);




