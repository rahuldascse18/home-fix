import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('Attempting login with:', formData.email)
      
      const { error } = await signIn(formData.email, formData.password)
      
      if (error) {
        console.error('Login error:', error)
        if (error.message.includes('Invalid login credentials')) {
          setError('ইমেইল বা পাসওয়ার্ড ভুল')
        } else if (error.message.includes('Email not confirmed')) {
          setError('আপনার ইমেইল যাচাই করুন')
        } else {
          setError('লগইনে সমস্যা হয়েছে। আবার চেষ্টা করুন।')
        }
      } else {
        console.log('Login successful, redirecting...')
        // Wait a moment for the auth state to update
        setTimeout(() => {
          navigate('/')
        }, 100)
      }
    } catch (err) {
      console.error('Login catch error:', err)
      setError('লগইনে সমস্যা হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <LogIn className="mx-auto h-12 w-12 text-green-600" />
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              লগইন করুন
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              আপনার অ্যাকাউন্টে প্রবেশ করুন
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ইমেইল
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="আপনার ইমেইল লিখুন"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                  placeholder="আপনার পাসওয়ার্ড লিখুন"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                অ্যাকাউন্ট নেই?{' '}
                <Link to="/register" className="text-green-600 hover:text-green-500 font-medium">
                  রেজিস্টার করুন
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}