/*
  # Create contact form system

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `subject` (text)
      - `message` (text)
      - `status` (text) - For tracking message status (new, read, replied)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for submitting messages and admin access
*/

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies for contact_messages
CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only admins can view and manage messages
CREATE POLICY "Admins can view all messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (auth.jwt()->>'role' = 'admin');

CREATE POLICY "Admins can update messages"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (auth.jwt()->>'role' = 'admin')
  WITH CHECK (auth.jwt()->>'role' = 'admin');

