import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useServices } from '../contexts/ServiceContext';
import { Users, Calendar, DollarSign, Settings, TrendingUp, Shield } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { services, bookings, loading } = useServices();
  const [activeTab, setActiveTab] = useState('overview');

  const totalUsers = 150; // Mock data - in real app, fetch from users table
  const totalProviders = 75; // Mock data
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum, booking) => sum + Number(booking.total_amount), 0);

  const recentBookings = bookings.slice(-5);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Shield className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold">অ্যাডমিন ড্যাশবোর্ড</h1>
              <p className="opacity-90">স্বাগতম, {user?.name}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                <p className="text-gray-600">মোট ব্যবহারকারী</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Settings className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{totalProviders}</p>
                <p className="text-gray-600">সার্ভিস প্রদানকারী</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
                <p className="text-gray-600">মোট বুকিং</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">৳{totalRevenue}</p>
                <p className="text-gray-600">মোট রেভিনিউ</p>
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
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ওভারভিউ
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'services'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                সার্ভিস ম্যানেজমেন্ট
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ব্যবহারকারী ম্যানেজমেন্ট
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">সাম্প্রতিক কার্যক্রম</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Bookings */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">সাম্প্রতিক বুকিং</h3>
                    <div className="space-y-3">
                      {recentBookings.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">কোনো বুকিং নেই</p>
                      ) : (
                        recentBookings.map(booking => (
                          <div key={booking.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">বুকিং #{booking.id.slice(-8)}</p>
                              <p className="text-sm text-gray-600">{booking.date} • {booking.time}</p>
                            </div>
                            <span className="text-green-600 font-semibold">৳{booking.total_amount}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Platform Stats */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">প্ল্যাটফর্ম পরিসংখ্যান</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">সক্রিয় সার্ভিস</span>
                        <span className="font-semibold">{services.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">সম্পন্ন বুকিং</span>
                        <span className="font-semibold">
                          {bookings.filter(b => b.status === 'completed').length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">গড় রেটিং</span>
                        <span className="font-semibold">4.7 ⭐</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">মাসিক বৃদ্ধি</span>
                        <span className="font-semibold text-green-600">+15%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">সার্ভিস ম্যানেজমেন্ট</h2>
                
                {services.length === 0 ? (
                  <div className="text-center py-12">
                    <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">কোনো সার্ভিস নেই</p>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            সার্ভিস
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ক্যাটেগরি
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            মূল্য
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            রেটিং
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            অবস্থা
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {services.map(service => (
                          <tr key={service.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img className="h-10 w-10 rounded-lg object-cover" src={service.image_url} alt="" />
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{service.title}</div>
                                  <div className="text-sm text-gray-500">{service.provider?.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {service.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ৳{service.price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {service.rating} ⭐
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                service.available 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {service.available ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">ব্যবহারকারী ম্যানেজমেন্ট</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6 text-center">
                    <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">সাধারণ ব্যবহারকারী</h3>
                    <p className="text-3xl font-bold text-blue-600 mb-2">{totalUsers}</p>
                    <p className="text-sm text-gray-600">নিবন্ধিত ব্যবহারকারী</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-6 text-center">
                    <Settings className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">প্রদানকারী</h3>
                    <p className="text-3xl font-bold text-green-600 mb-2">{totalProviders}</p>
                    <p className="text-sm text-gray-600">সার্ভিস প্রদানকারী</p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-6 text-center">
                    <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">মাসিক বৃদ্ধি</h3>
                    <p className="text-3xl font-bold text-purple-600 mb-2">+15%</p>
                    <p className="text-sm text-gray-600">নতুন রেজিস্ট্রেশন</p>
                  </div>
                </div>

                <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">সাম্প্রতিক কার্যক্রম</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">নতুন ব্যবহারকারী রেজিস্টার হয়েছেন</span>
                      <span className="text-sm text-gray-500">২ মিনিট আগে</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">নতুন সার্ভিস প্রদানকারী যোগ দিয়েছেন</span>
                      <span className="text-sm text-gray-500">১৫ মিনিট আগে</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">একটি বুকিং সম্পন্ন হয়েছে</span>
                      <span className="text-sm text-gray-500">৩০ মিনিট আগে</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}