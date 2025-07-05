/*
  # Initial Schema for HomeFix Bangladesh Platform

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches auth.users id
      - `email` (text, unique)
      - `name` (text)
      - `phone` (text)
      - `role` (enum: user, provider, admin)
      - `location` (text)
      - `profession` (text, nullable)
      - `verified` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `icon` (text)
      - `created_at` (timestamp)

    - `services`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `price` (numeric)
      - `category` (text)
      - `provider_id` (uuid, foreign key)
      - `location` (text)
      - `rating` (numeric, default 0)
      - `image_url` (text)
      - `available` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `bookings`
      - `id` (uuid, primary key)
      - `service_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `provider_id` (uuid, foreign key)
      - `date` (date)
      - `time` (text)
      - `address` (text)
      - `notes` (text, nullable)
      - `status` (enum: pending, confirmed, completed, cancelled)
      - `total_amount` (numeric)
      - `payment_method` (text, nullable)
      - `payment_status` (enum: pending, completed, failed)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'provider', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  location text,
  profession text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  category text NOT NULL,
  provider_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location text NOT NULL,
  rating numeric DEFAULT 0,
  image_url text NOT NULL,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL,
  time text NOT NULL,
  address text NOT NULL,
  notes text,
  status booking_status DEFAULT 'pending',
  total_amount numeric NOT NULL,
  payment_method text,
  payment_status payment_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anyone can insert user data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for categories table
CREATE POLICY "Anyone can read categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for services table
CREATE POLICY "Anyone can read available services"
  ON services
  FOR SELECT
  TO authenticated
  USING (available = true);

CREATE POLICY "Providers can manage own services"
  ON services
  FOR ALL
  TO authenticated
  USING (provider_id = auth.uid());

CREATE POLICY "Admins can manage all services"
  ON services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for bookings table
CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Providers can read their bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (provider_id = auth.uid());

CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Providers can update their bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (provider_id = auth.uid());

CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert sample categories
INSERT INTO categories (name, description, icon) VALUES
  ('ইলেকট্রিক্যাল', 'বাসা-বাড়ির সকল ধরনের ইলেকট্রিক্যাল সমস্যার সমাধান', 'zap'),
  ('প্লাম্বিং', 'পানির পাইপ, বাথরুম, কিচেনের সকল প্লাম্বিং সমস্যার সমাধান', 'droplets'),
  ('এসি সার্ভিস', 'এয়ার কন্ডিশনার সার্ভিসিং, গ্যাস চার্জ, মেরামত ও রক্ষণাবেক্ষণ', 'wind'),
  ('ক্লিনিং', 'সম্পূর্ণ বাড়ি পরিষ্কার করা, ডিপ ক্লিনিং সার্ভিস', 'sparkles'),
  ('পেইন্টিং', 'দেয়াল পেইন্টিং, রং করা, ওয়াল ডিজাইন ও ডেকোরেশন', 'paintbrush'),
  ('কার্পেন্টার', 'আসবাবপত্র মেরামত, কাঠের কাজ, দরজা-জানালা মেরামত', 'hammer');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();