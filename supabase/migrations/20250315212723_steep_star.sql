/*
  # Add RLS policies for users table

  1. Security Changes
    - Enable RLS on users table
    - Add policies for:
      - Insert: Allow authenticated users to insert new users
      - Select: Allow authenticated users to read all users
      - Update: Allow authenticated users to update any user
*/

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for inserting users
CREATE POLICY "Allow insert access to authenticated users"
ON users
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy for reading users
CREATE POLICY "Allow read access to authenticated users"
ON users
FOR SELECT
TO authenticated
USING (true);

-- Policy for updating users
CREATE POLICY "Allow update access to authenticated users"
ON users
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);