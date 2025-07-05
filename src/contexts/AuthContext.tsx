import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, type User } from '../lib/supabase' // Update with your actual import
import type { AuthError, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<{ error: Error | null }>
  verifyOTP: (email: string, otp: string) => Promise<{ error: Error | null }>
  resendOTP: (email: string) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      setLoading(true)

      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)

      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setSession(session)
          if (session?.user) {
            await fetchUserProfile(session.user.id)
          } else {
            setUser(null)
            setLoading(false)
          }
        }
      )

      return () => {
        subscription.unsubscribe()
      }
    }

    init()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error, status } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && status === 406) {
        console.warn('User profile not found. This might be a new user whose profile creation is pending or failed.')
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (authUser) {
          setUser({
            id: authUser.id,
            email: authUser.email,
            ...authUser.user_metadata,
          } as User)
        }
      } else if (error) {
        throw error
      }

      if (data) {
        setUser(data)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            role: userData.role,
            location: userData.location,
            profession: userData.profession
          }
        }
      })

      if (error) return { error }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            email: data.user.email,
            ...userData,
            verified: false,
          }])

        if (profileError) {
          console.error('Error creating user profile after signup:', profileError)
          return { error: new Error('User created, but profile insertion failed.') as AuthError }
        }
      }

      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { error: new Error('No user logged in') }

    try {
      const { error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (error) throw error

      await fetchUserProfile(user.id)

      return { error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { error: error as Error }
    }
  }

  const verifyOTP = async (email: string, otp: string) => {
    try {
      const { data: { session }, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      })
      if (error) return { error: new Error(error.message) }

      if (session?.user) {
        await supabase.from('users').update({ verified: true }).eq('id', session.user.id)
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const resendOTP = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email })
      if (error) return { error: new Error(error.message) }
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
      verifyOTP,
      resendOTP,
    }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
