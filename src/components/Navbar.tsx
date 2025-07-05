import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Home, User, LogOut, Settings, Shield } from 'lucide-react'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const getDashboardLink = () => {
    if (!user) return '/'
    
    switch (user.role) {
      case 'admin':
        return '/admin-dashboard'
      case 'provider':
        return '/provider-dashboard'
      default:
        return '/user-dashboard'
    }
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              HomeFix BD
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition-colors">
              হোম
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-green-600 transition-colors">
              সার্ভিস
            </Link>
            {user && (
              <Link 
                to={getDashboardLink()} 
                className="text-gray-700 hover:text-green-600 transition-colors flex items-center"
              >
                {user.role === 'admin' ? (
                  <Shield className="h-4 w-4 mr-1" />
                ) : user.role === 'provider' ? (
                  <Settings className="h-4 w-4 mr-1" />
                ) : (
                  <User className="h-4 w-4 mr-1" />
                )}
                ড্যাশবোর্ড
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {user.role === 'admin' && <Shield className="h-4 w-4 text-purple-600 mr-1" />}
                    {user.role === 'provider' && <Settings className="h-4 w-4 text-blue-600 mr-1" />}
                    {user.role === 'user' && <User className="h-4 w-4 text-green-600 mr-1" />}
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  </div>
                  {!user.verified && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      অযাচাইকৃত
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>লগআউট</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  লগইন
                </Link>
                <Link
                  to="/register"
                  className="border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
                >
                  রেজিস্টার
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}