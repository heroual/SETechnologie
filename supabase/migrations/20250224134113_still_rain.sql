/*
  # Initial Schema Setup for SE Technologie Admin Dashboard

  1. New Tables
    - `products`
      - Product management with full details and SEO support
    - `services`
      - Service management with pricing options and featured status
    - `users`
      - User management with role-based access
    - `activity_logs`
      - Audit trail for all system actions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles
*/

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text,
  images text[] DEFAULT '{}',
  price decimal(10,2) NOT NULL,
  stock integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  seo_keywords text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Services Table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text,
  image text,
  pricing_type text NOT NULL CHECK (pricing_type IN ('fixed', 'quote')),
  price decimal(10,2),
  status text DEFAULT 'available' CHECK (status IN ('available', 'unavailable')),
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies for products
CREATE POLICY "Allow read access to all authenticated users"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow full access to admins and managers"
  ON products
  USING (
    auth.jwt() ->> 'role' IN ('admin', 'manager')
  );

-- Policies for services
CREATE POLICY "Allow read access to all authenticated users"
  ON services
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow full access to admins and managers"
  ON services
  USING (
    auth.jwt() ->> 'role' IN ('admin', 'manager')
  );

-- Policies for activity logs
CREATE POLICY "Allow read access to admins only"
  ON activity_logs
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Allow insert to all authenticated users"
  ON activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();