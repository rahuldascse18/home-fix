import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useServices } from '../contexts/ServiceContext';
import { Calendar, Clock, MapPin, Star, User, CreditCard, Search, Filter } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const { bookings, services, loading } = useServices();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookingFilter, setBookingFilter] = useState('all');

  const userBookings = bookings.filter(booking => booking.user_id === user?.id);

  const filteredBookings = userBookings.filter(booking => {
    if (bookingFilter === 'all') return true;
    return booking.status === bookingFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'অপেক্ষমাণ';
      case 'confirmed': return 'নিশ্চিত';
      case 'completed': return 'সম্পন্ন';
      case 'cancelled': return 'বাতিল';
      default: return status;
    }
  };

  const totalSpent = userBookings
    .filter(booking => booking.status === 'completed')
    .reduce((sum, booking) => sum + Number(booking.total_amount), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <User className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold">ব্যবহারকারী ড্যাশবোর্ড</h1>
                <p className="opacity-90">স্বাগতম, {user?.name}</p>
                <p className="text-sm opacity-75">{user?.location}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-75">মোট খরচ</p>
              <p className="text-3xl font-bold">৳{totalSpent}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{userBookings.length}</p>
                <p className="text-gray-600">মোট বুকিং</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {userBookings.filter(b => b.status === 'pending').length}
                </p>
                <p className="text-gray-600">অপেক্ষমাণ</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {userBookings.filter(b => b.status === 'completed').length}
                </p>
                <p className="text-gray-600">সম্পন্ন</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {userBookings.filter(b => b.status === 'confirmed').length}
                </p>
                <p className="text-gray-600">নিশ্চিত</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ওভারভিউ
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                আমার বুকিং
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'services'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                সার্ভিস খুঁজুন
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                প্রোফাইল
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">ড্যাশবোর্ড ওভারভিউ</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Bookings */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">সাম্প্রতিক বুকিং</h3>
                    <div className="space-y-3">
                      {userBookings.slice(-3).length === 0 ? (
                        <p className="text-gray-500 text-center py-4">কোনো বুকিং নেই</p>
                      ) : (
                        userBookings.slice(-3).map(booking => (
                          <div key={booking.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">
                                {booking.service?.title || 'সার্ভিস'}
                              </p>
                              <p className="text-sm text-gray-600">{booking.date} • {booking.time}</p>
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                                {getStatusText(booking.status)}
                              </span>
                            </div>
                            <span className="text-green-600 font-semibold">৳{booking.total_amount}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">আপনার পরিসংখ্যান</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">মোট বুকিং</span>
                        <span className="font-semibold">{userBookings.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">সম্পন্ন সার্ভিস</span>
                        <span className="font-semibold">
                          {userBookings.filter(b => b.status === 'completed').length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">মোট খরচ</span>
                        <span className="font-semibold text-green-600">৳{totalSpent}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">গড় খরচ</span>
                        <span className="font-semibold">
                          ৳{userBookings.length > 0 ? Math.round(totalSpent / userBookings.length) : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">আমার বুকিংসমূহ</h2>
                  <select
                    value={bookingFilter}
                    onChange={(e) => setBookingFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">সব বুকিং</option>
                    <option value="pending">অপেক্ষমাণ</option>
                    <option value="confirmed">নিশ্চিত</option>
                    <option value="completed">সম্পন্ন</option>
                    <option value="cancelled">বাতিল</option>
                  </select>
                </div>
                
                {filteredBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">
                      {bookingFilter === 'all' ? 'এখনো কোনো বুকিং নেই' : `কোনো ${getStatusText(bookingFilter)} বুকিং নেই`}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">সার্ভিস পেজে গিয়ে বুকিং করুন</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBookings.map(booking => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
                          <span className="text-lg font-semibold text-green-600">৳{booking.total_amount}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>{booking.date}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>{booking.time}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-start text-gray-600">
                              <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                              <span className="text-sm">{booking.address}</span>
                            </div>
                          </div>
                        </div>

                        {booking.service && (
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">সার্ভিস বিবরণ</h4>
                            <div className="flex items-center space-x-4">
                              <img 
                                src={booking.service.image_url} 
                                alt={booking.service.title}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-900">{booking.service.title}</p>
                                <p className="text-sm text-gray-600">{booking.service.category}</p>
                                {booking.service.provider && (
                                  <p className="text-sm text-gray-500">
                                    প্রদানকারী: {booking.service.provider.name}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {booking.notes && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <strong>নোট:</strong> {booking.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">উপলব্ধ সার্ভিসমূহ</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.slice(0, 6).map(service => (
                    <div key={service.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all">
                      <img 
                        src={service.image_url} 
                        alt={service.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                            {service.category}
                          </span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">{service.rating}</span>
                          </div>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-green-600">৳{service.price}</span>
                          <a
                            href={`/book/${service.id}`}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                          >
                            বুক করুন
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <a
                    href="/services"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    সব সার্ভিস দেখুন
                  </a>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">প্রোফাইল তথ্য</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">নাম</label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ইমেইল</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ফোন</label>
                    <input
                      type="tel"
                      value={user?.phone || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">এলাকা</label>
                    <input
                      type="text"
                      value={user?.location || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${user?.verified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm font-medium">
                      {user?.verified ? 'যাচাইকৃত অ্যাকাউন্ট' : 'অযাচাইকৃত অ্যাকাউন্ট'}
                    </span>
                  </div>
                  {!user?.verified && (
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
                      যাচাই করুন
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}