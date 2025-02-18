/*
  # Add Razorpay payment fields

  1. Changes
    - Add payment_id column to orders table
    - Add payment_signature column to orders table
    
  2. Purpose
    - Store Razorpay payment transaction details
    - Track payment status and verification
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'payment_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN payment_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'payment_signature'
  ) THEN
    ALTER TABLE orders ADD COLUMN payment_signature text;
  END IF;
END $$;