import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, type Service, type Booking, type Category } from '../lib/supabase'
import { useAuth } from './AuthContext'

interface ServiceContextType {
  services: Service[]
  bookings: Booking[]
  categories: Category[]
  loading: boolean
  fetchServices: () => Promise<void>
  fetchBookings: () => Promise<void>
  fetchCategories: () => Promise<void>
  createService: (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => Promise<{ error: Error | null }>
  updateService: (id: string, updates: Partial<Service>) => Promise<{ error: Error | null }>
  deleteService: (id: string) => Promise<{ error: Error | null }>
  createBooking: (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => Promise<{ error: Error | null }>
  updateBooking: (id: string, updates: Partial<Booking>) => Promise<{ error: Error | null }>
  cancelBooking: (id: string) => Promise<{ error: Error | null }>
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined)

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<Service[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const { user, session } = useAuth()

  useEffect(() => {
    fetchCategories()
    fetchServices()
    if (session && user) {
      fetchBookings()
    } else {
      console.log('No session, clearing data...')
      setBookings([])
      setLoading(false)
    }
  }, [user, session])

  const fetchServices = async () => {
    try {
      console.log('Fetching services...')
      
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          provider:users!services_provider_id_fkey(*)
        `)
        .eq('available', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching services:', error)
        throw error
      }

      console.log('Services fetched:', data?.length || 0)
      setServices(data || [])
    } catch (error) {
      console.error('Error in fetchServices:', error)
      setServices([])
    }
  }

  const fetchBookings = async () => {
    if (!user) {
      console.log('No user, skipping bookings fetch')
      return
    }

    try {
      console.log('Fetching bookings for user:', user.id, 'role:', user.role)
      
      let query = supabase
        .from('bookings')
        .select(`
          *,
          service:services(*),
          user:users!bookings_user_id_fkey(*),
          provider:users!bookings_provider_id_fkey(*)
        `)

      // Filter based on user role
      if (user.role === 'user') {
        query = query.eq('user_id', user.id)
      } else if (user.role === 'provider') {
        query = query.eq('provider_id', user.id)
      }
      // Admin can see all bookings (no filter)

      query = query.order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) {
        console.error('Error fetching bookings:', error)
        throw error
      }

      console.log('Bookings fetched:', data?.length || 0)
      setBookings(data || [])
    } catch (error) {
      console.error('Error in fetchBookings:', error)
      setBookings([])
    }
  }

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...')
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching categories:', error)
        throw error
      }

      console.log('Categories fetched:', data?.length || 0)
      setCategories(data || [])
    } catch (error) {
      console.error('Error in fetchCategories:', error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const createService = async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('services')
        .insert([service])
        .select()
        .single()

      if (error) throw error
      
      await fetchServices()
      return { error: null }
    } catch (error) {
      console.error('Error creating service:', error)
      return { error: error as Error }
    }
  }

  const updateService = async (id: string, updates: Partial<Service>) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      
      await fetchServices()
      return { error: null }
    } catch (error) {
      console.error('Error updating service:', error)
      return { error: error as Error }
    }
  }

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      await fetchServices()
      return { error: null }
    } catch (error) {
      console.error('Error deleting service:', error)
      return { error: error as Error }
    }
  }

  const createBooking = async (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const {error } = await supabase
        .from('bookings')
        .insert([booking])
        .select()
        .single()

      if (error) throw error
      
      await fetchBookings()
      return { error: null }
    } catch (error) {
      console.error('Error creating booking:', error)
      return { error: error as Error }
    }
  }

  const updateBooking = async (id: string, updates: Partial<Booking>) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      
      await fetchBookings()
      return { error: null }
    } catch (error) {
      console.error('Error updating booking:', error)
      return { error: error as Error }
    }
  }

  const cancelBooking = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
      
      await fetchBookings()
      return { error: null }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      return { error: error as Error }
    }
  }

  return (
    <ServiceContext.Provider value={{
      services,
      bookings,
      categories,
      loading,
      fetchServices,
      fetchBookings,
      fetchCategories,
      createService,
      updateService,
      deleteService,
      createBooking,
      updateBooking,
      cancelBooking,
    }}>
      {children}
    </ServiceContext.Provider>
  )
}

export function useServices() {
  const context = useContext(ServiceContext)
  if (context === undefined) {
    throw new Error('useServices must be used within a ServiceProvider')
  }
  return context
}