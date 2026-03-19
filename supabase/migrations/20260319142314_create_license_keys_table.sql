/*
  # Create license keys table

  1. New Tables
    - `license_keys`
      - `id` (uuid, primary key)
      - `key` (text, unique)
      - `is_active` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `license_keys` table
    - Add policy for anonymous users to check if a key is valid
*/

CREATE TABLE IF NOT EXISTS license_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE license_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous users to check valid keys"
  ON license_keys
  FOR SELECT
  TO anon
  USING (is_active = true);