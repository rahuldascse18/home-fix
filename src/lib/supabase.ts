import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: 'user' | 'provider' | 'admin'
  location?: string
  profession?: string
  verified: boolean
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  title: string
  description: string
  price: number
  category: string
  provider_id: string
  location: string
  rating: number
  image_url: string
  available: boolean
  created_at: string
  updated_at: string
  provider?: User
}

export interface Booking {
  id: string
  service_id: string
  user_id: string
  provider_id: string
  date: string
  time: string
  address: string
  notes?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  total_amount: number
  payment_method?: string
  payment_status: 'pending' | 'completed' | 'failed'
  created_at: string
  updated_at: string
  service?: Service
  user?: User
  provider?: User
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  created_at: string
}