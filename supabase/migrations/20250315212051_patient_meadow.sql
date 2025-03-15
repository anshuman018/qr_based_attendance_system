/*
  # QR Attendance System Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `phone` (text)
      - `payment_status` (boolean)
      - `qr_code` (text)
      - `checked_in` (boolean)
      - `check_in_time` (timestamptz)
      - `created_at` (timestamptz)
    
  2. Security
    - Enable RLS on `users` table
    - Add policies for authenticated users to:
      - Read all users
      - Create and update users
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  payment_status boolean DEFAULT false,
  qr_code text UNIQUE,
  checked_in boolean DEFAULT false,
  check_in_time timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all authenticated users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert access to all authenticated users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update access to all authenticated users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (true);