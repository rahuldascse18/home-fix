import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useServices } from '../contexts/ServiceContext';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, DollarSign, Plus, Settings } from 'lucide-react';
import ServiceForm from '../components/ServiceForm';
import ServiceCard from '../components/ServiceCard';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const { bookings, services, updateBooking, loading } = useServices();
  const [activeTab, setActiveTab] = useState('overview');
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const providerBookings = bookings.filter(booking => booking.provider_id === user?.id);
  const providerServices = services.filter(service => service.provider_id === user?.id);

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    try {
      await updateBooking(bookingId, { status });
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const handleEditService = (service: any) => {
    setEditingService(service);
    setShowServiceForm(true);
  };

  const handleCloseServiceForm = () => {
    setShowServiceForm(false);
    setEditingService(null);
  };

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

  const totalEarnings = providerBookings
    .filter(booking => booking.status === 'completed')
    .reduce((sum, booking) => sum + Number(booking.total_amount), 0);

  const pendingBookings = providerBookings.filter(booking => booking.status === 'pending').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Settings className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold">প্রদানকারী ড্যাশবোর্ড</h1>
                <p className="opacity-90">স্বাগতম, {user?.name}</p>
                <p className="text-sm opacity-75">{user?.profession} • {user?.location}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-75">মোট আয়</p>
              <p className="text-3xl font-bold">৳{totalEarnings}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{pendingBookings}</p>
                <p className="text-gray-600">নতুন বুকিং</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {providerBookings.filter(b => b.status === 'completed').length}
                </p>
                <p className="text-gray-600">সম্পন্ন কাজ</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{providerServices.length}</p>
                <p className="text-gray-600">মোট সার্ভিস</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">৳{totalEarnings}</p>
                <p className="text-gray-600">মোট আয়</p>
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
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ওভারভিউ
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'services'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                আমার সার্ভিস
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                বুকিং ম্যানেজমেন্ট
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
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
                      {providerBookings.slice(-3).length === 0 ? (
                        <p className="text-gray-500 text-center py-4">কোনো বুকিং নেই</p>
                      ) : (
                        providerBookings.slice(-3).map(booking => (
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

                  {/* Service Performance */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">সার্ভিস পারফরমেন্স</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">সক্রিয় সার্ভিস</span>
                        <span className="font-semibold">{providerServices.filter(s => s.available).length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">সম্পন্ন বুকিং</span>
                        <span className="font-semibold">
                          {providerBookings.filter(b => b.status === 'completed').length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">গড় রেটিং</span>
                        <span className="font-semibold">
                          {providerServices.length > 0 
                            ? (providerServices.reduce((sum, s) => sum + s.rating, 0) / providerServices.length).toFixed(1)
                            : '0.0'
                          } ⭐
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">এই মাসের আয়</span>
                        <span className="font-semibold text-green-600">৳{totalEarnings}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">আমার সার্ভিসমূহ</h2>
                  <button
                    onClick={() => setShowServiceForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    নতুন সার্ভিস যোগ করুন
                  </button>
                </div>
                
                {providerServices.length === 0 ? (
                  <div className="text-center py-12">
                    <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">এখনো কোনো সার্ভিস যোগ করেননি</p>
                    <p className="text-sm text-gray-400 mt-2">নতুন সার্ভিস যোগ করে আয় শুরু করুন</p>
                    <button
                      onClick={() => setShowServiceForm(true)}
                      className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      প্রথম সার্ভিস যোগ করুন
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {providerServices.map(service => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        onEdit={handleEditService}
                        showActions={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">বুকিং অনুরোধসমূহ</h2>
                
                {providerBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">এখনো কোনো বুকিং নেই</p>
                    <p className="text-sm text-gray-400 mt-2">গ্রাহকরা আপনার সার্ভিস বুক করলে এখানে দেখাবে</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {providerBookings.map(booking => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
                          <span className="text-lg font-bold text-green-600">৳{booking.total_amount}</span>
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

                        {booking.user && (
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">গ্রাহকের তথ্য</h4>
                            <p className="text-sm text-gray-600">নাম: {booking.user.name}</p>
                            <p className="text-sm text-gray-600">ফোন: {booking.user.phone}</p>
                            <p className="text-sm text-gray-600">ইমেইল: {booking.user.email}</p>
                          </div>
                        )}

                        {booking.notes && (
                          <div className="bg-blue-50 rounded-lg p-4 mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">বিশেষ নির্দেশনা</h4>
                            <p className="text-sm text-gray-600">{booking.notes}</p>
                          </div>
                        )}

                        {booking.status === 'pending' && (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              গ্রহণ করুন
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              বাতিল করুন
                            </button>
                          </div>
                        )}

                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'completed')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            কাজ সম্পন্ন হয়েছে
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">পেশা</label>
                    <input
                      type="text"
                      value={user?.profession || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">এলাকা</label>
                    <input
                      type="text"
                      value={user?.location || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${user?.verified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm font-medium">
                      {user?.verified ? 'যাচাইকৃত প্রদানকারী' : 'অযাচাইকৃত প্রদানকারী'}
                    </span>
                  </div>
                  {!user?.verified && (
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                      যাচাই করুন
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Service Form Modal */}
      {showServiceForm && (
        <ServiceForm
          onClose={handleCloseServiceForm}
          service={editingService}
          isEdit={!!editingService}
        />
      )}
    </div>
  );
}