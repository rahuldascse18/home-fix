import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, UserPlus, Mail, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'provider',
    location: '',
    profession: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showOTPForm, setShowOTPForm] = useState(false)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [registrationEmail, setRegistrationEmail] = useState('')

  const { signUp, verifyOTP, resendOTP } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('পাসওয়ার্ড মিলছে না')
      return
    }

    if (formData.password.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে')
      return
    }

    if (!formData.name.trim()) {
      setError('নাম লিখুন')
      return
    }

    if (!formData.email.trim()) {
      setError('ইমেইল লিখুন')
      return
    }

    if (!formData.phone.trim()) {
      setError('ফোন নম্বর লিখুন')
      return
    }

    if (!formData.location.trim()) {
      setError('এলাকা লিখুন')
      return
    }

    if (formData.role === 'provider' && !formData.profession.trim()) {
      setError('পেশা/দক্ষতা লিখুন')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log('Starting registration process...')
      
      const { error } = await signUp(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone,
        role: formData.role,
        location: formData.location,
        profession: formData.role === 'provider' ? formData.profession : undefined,
      })

      if (error) {
        console.error('Registration error:', error)
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          setError('এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে')
        } else if (error.message.includes('Invalid email')) {
          setError('সঠিক ইমেইল ঠিকানা দিন')
        } else if (error.message.includes('Password')) {
          setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে')
        } else {
          setError('রেজিস্ট্রেশনে সমস্যা হয়েছে। আবার চেষ্টা করুন।')
        }
      } else {
        console.log('Registration successful, showing OTP form')
        setRegistrationEmail(formData.email)
        setSuccess('রেজিস্ট্রেশন সফল! আপনার ইমেইলে OTP কোড পাঠানো হয়েছে।')
        setShowOTPForm(true)
      }
    } catch (err) {
      console.error('Registration catch error:', err)
      setError('রেজিস্ট্রেশনে সমস্যা হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (otp.length !== 6) {
      setError('৬ সংখ্যার OTP কোড লিখুন')
      return
    }

    setLoading(true)
    setError('')

    try {
      console.log('Verifying OTP for email:', registrationEmail)
      
      const { error } = await verifyOTP(registrationEmail, otp)

      if (error) {
        console.error('OTP verification error:', error)
        if (error.message.includes('expired')) {
          setError('OTP কোডের মেয়াদ শেষ। নতুন কোড চান।')
        } else if (error.message.includes('invalid') || error.message.includes('Invalid')) {
          setError('OTP কোড ভুল। আবার চেষ্টা করুন।')
        } else if (error.message.includes('Token has expired')) {
          setError('OTP কোডের মেয়াদ শেষ। নতুন কোড চান।')
        } else {
          setError('OTP যাচাইয়ে সমস্যা হয়েছে। আবার চেষ্টা করুন।')
        }
      } else {
        console.log('OTP verification successful')
        setSuccess('OTP যাচাই সফল! আপনার অ্যাকাউন্ট সক্রিয় হয়েছে।')
        
        // Wait a moment then redirect to login
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }
    } catch (err) {
      console.error('OTP verification catch error:', err)
      setError('OTP যাচাইয়ে সমস্যা হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setLoading(true)
    setError('')
    
    try {
      const { error } = await resendOTP(registrationEmail)
      
      if (error) {
        setError('OTP পুনরায় পাঠাতে সমস্যা হয়েছে')
      } else {
        setSuccess('নতুন OTP কোড আপনার ইমেইলে পাঠানো হয়েছে')
        setOtp('')
      }
    } catch (error) {
      setError('OTP পুনরায় পাঠাতে সমস্যা হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToRegistration = () => {
    setShowOTPForm(false)
    setOtp('')
    setError('')
    setSuccess('')
    setRegistrationEmail('')
  }

  if (showOTPForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <Mail className="mx-auto h-12 w-12 text-green-600" />
              <h2 className="mt-4 text-3xl font-bold text-gray-900">
                ইমেইল যাচাই করুন
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                আপনার অ্যাকাউন্ট সক্রিয় করতে OTP কোড লিখুন
              </p>
              <p className="mt-1 text-xs text-blue-600 break-all">
                ইমেইল: {registrationEmail}
              </p>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  আপনার ইমেইল ইনবক্স চেক করুন। OTP কোড পেতে কয়েক মিনিট সময় লাগতে পারে।
                </p>
              </div>
            </div>

            {success && (
              <div className="mt-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                {success}
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}

            <form className="mt-8" onSubmit={handleOTPSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OTP কোড (৬ সংখ্যা)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 text-center text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 tracking-widest"
                  placeholder="123456"
                  disabled={loading}
                  autoFocus
                />
                <p className="mt-1 text-xs text-gray-500">
                  আপনার ইমেইলে পাঠানো ৬ সংখ্যার কোড লিখুন
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'যাচাই হচ্ছে...' : 'যাচাই করুন'}
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-green-600 hover:text-green-500 text-sm disabled:opacity-50 flex items-center justify-center mx-auto"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  নতুন OTP কোড চান
                </button>
              </div>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleBackToRegistration}
                  disabled={loading}
                  className="text-gray-600 hover:text-gray-800 text-sm disabled:opacity-50"
                >
                  পূর্বের পেজে ফিরে যান
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <UserPlus className="mx-auto h-12 w-12 text-green-600" />
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              রেজিস্টার করুন
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              নতুন অ্যাকাউন্ট তৈরি করুন
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ব্যবহারকারীর ধরন
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'provider' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loading}
              >
                <option value="user">সাধারণ ব্যবহারকারী</option>
                <option value="provider">সার্ভিস প্রদানকারী</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                নাম *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="আপনার পূর্ণ নাম"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ইমেইল *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="আপনার ইমেইল"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ফোন নম্বর *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="+880 1XXXXXXXXX"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                এলাকা *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="ঢাকা, চট্টগ্রাম, সিলেট"
                disabled={loading}
              />
            </div>

            {formData.role === 'provider' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  পেশা/দক্ষতা *
                </label>
                <input
                  type="text"
                  required
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="ইলেকট্রিশিয়ান, প্লাম্বার, ইত্যাদি"
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                পাসওয়ার্ড *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                  placeholder="আপনার পাসওয়ার্ড"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                পাসওয়ার্ড নিশ্চিত করুন *
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="পাসওয়ার্ড আবার লিখুন"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}

            {success && !showOTPForm && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'রেজিস্টার হচ্ছে...' : 'রেজিস্টার করুন'}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
                <Link to="/login" className="text-green-600 hover:text-green-500 font-medium">
                  লগইন করুন
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}