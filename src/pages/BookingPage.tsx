import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useServices } from '../contexts/ServiceContext';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, MapPin, CreditCard, Star, User, ArrowLeft } from 'lucide-react';

export default function BookingPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { services } = useServices();
  const { user } = useAuth();

  const service = services.find(s => s.id === serviceId);
  
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    address: '',
    notes: '',
    paymentMethod: 'bkash'
  });
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">সার্ভিস পাওয়া যায়নি</h2>
          <p className="text-gray-600 mb-4">আপনি যে সার্ভিসটি খুঁজছেন তা আর উপলব্ধ নেই।</p>
          <button
            onClick={() => navigate('/services')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            সব সার্ভিস দেখুন
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!bookingData.date || !bookingData.time || !bookingData.address.trim()) {
      alert('সব তথ্য পূরণ করুন');
      return;
    }

    // Check if date is not in the past
    const selectedDate = new Date(bookingData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      alert('অতীতের তারিখ নির্বাচন করা যাবে না');
      return;
    }

    setShowPayment(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // const { error } = await createBooking({
      //   service_id: service.id,
      //   user_id: user.id,
      //   provider_id: service.provider_id,
      //   date: bookingData.date,
      //   time: bookingData.time,
      //   address: bookingData.address,
      //   notes: bookingData.notes,
      //   status: 'pending',
      //   total_amount: service.price,
      //   payment_method: bookingData.paymentMethod,
      //   payment_status: 'pending'
      // });

      // if (error) {
      //   throw error;
      // }

      // // Simulate payment processing
      // await new Promise(resolve => setTimeout(resolve, 2000));
      
      // alert('বুকিং সফল হয়েছে! আপনার ড্যাশবোর্ডে যান।');
      // navigate('/user-dashboard');

      const paymentPayload = {
        service_id: service.id,
        user_id: user.id,
        provider_id: service.provider_id,
        date: bookingData.date,
        time: bookingData.time,
        address: bookingData.address,
        notes: bookingData.notes,
        status: 'pending',
        total_amount: service.price,
        payment_method: bookingData.paymentMethod,
        payment_status: 'completed'
      };

      console.log(paymentPayload);
      const response = await fetch('https://home-fix-server-nine.vercel.app/api/pay',{
        method :'POST',
        headers: {
           'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentPayload),
      });

      const data = await response.json();

      if(response.ok && data.url){
        window.location.href =  data.url;
      } else {
        throw new Error(data.error || 'Failed to initiate payment.');
      }

    } catch (error: any) {
      console.error('Booking error:', error);
      alert('বুকিংয়ে সমস্যা হয়েছে: ' + (error.message || 'অজানা সমস্যা'));
    } finally {
      setLoading(false);
    }
  };

  if (showPayment) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <CreditCard className="mx-auto h-12 w-12 text-green-600" />
              <h2 className="mt-4 text-3xl font-bold text-gray-900">পেমেন্ট করুন</h2>
              <p className="mt-2 text-gray-600">আপনার বুকিং নিশ্চিত করতে পেমেন্ট সম্পন্ন করুন</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">বুকিং সারাংশ</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>সার্ভিস:</span>
                  <span className="font-medium">{service.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>প্রদানকারী:</span>
                  <span>{service.provider?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>তারিখ:</span>
                  <span>{new Date(bookingData.date).toLocaleDateString('bn-BD')}</span>
                </div>
                <div className="flex justify-between">
                  <span>সময়:</span>
                  <span>{bookingData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>ঠিকানা:</span>
                  <span className="text-right max-w-xs">{bookingData.address}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>মোট:</span>
                  <span className="text-green-600">৳{service.price}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  পেমেন্ট পদ্ধতি নির্বাচন করুন
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    bookingData.paymentMethod === 'bkash' ? 'border-pink-500 bg-pink-50' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bkash"
                      checked={bookingData.paymentMethod === 'bkash'}
                      onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-600 mb-2">bKash</div>
                      <p className="text-sm text-gray-600">মোবাইল ব্যাংকিং</p>
                    </div>
                  </label>

                  <label className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    bookingData.paymentMethod === 'nagad' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="nagad"
                      checked={bookingData.paymentMethod === 'nagad'}
                      onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-2">Nagad</div>
                      <p className="text-sm text-gray-600">ডিজিটাল পেমেন্ট</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  মোবাইল নাম্বার
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="+880 1XXXXXXXXX"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'প্রসেসিং...' : `৳${service.price} পেমেন্ট করুন`}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowPayment(false)}
                className="text-gray-600 hover:text-gray-800 flex items-center justify-center mx-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                পূর্বের পেজে ফিরে যান
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/services')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            সব সার্ভিসে ফিরে যান
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Details */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img 
              src={service.image_url} 
              alt={service.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {service.category}
                </span>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{service.rating}</span>
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h1>
              <p className="text-gray-600 mb-6">{service.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3" />
                  <span>{service.location}</span>
                </div>
                {service.provider && (
                  <div className="flex items-center text-gray-600">
                    <User className="w-5 h-5 mr-3" />
                    <div>
                      <span className="font-medium">{service.provider.name}</span>
                      {service.provider.verified && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          যাচাইকৃত
                        </span>
                      )}
                      <p className="text-sm text-gray-500">{service.provider.profession}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-green-600">৳{service.price}</span>
                  <span className="text-sm text-gray-500">থেকে শুরু</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">বুকিং করুন</h2>
            
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  তারিখ নির্বাচন করুন *
                </label>
                <input
                  type="date"
                  required
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline w-4 h-4 mr-2" />
                  সময় নির্বাচন করুন *
                </label>
                <select
                  required
                  value={bookingData.time}
                  onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">সময় নির্বাচন করুন</option>
                  <option value="09:00">সকাল ৯:০০</option>
                  <option value="10:00">সকাল ১০:০০</option>
                  <option value="11:00">সকাল ১১:০০</option>
                  <option value="14:00">দুপুর ২:০০</option>
                  <option value="15:00">বিকাল ৩:০০</option>
                  <option value="16:00">বিকাল ৪:০০</option>
                  <option value="17:00">বিকাল ৫:০০</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-2" />
                  সম্পূর্ণ ঠিকানা *
                </label>
                <textarea
                  required
                  value={bookingData.address}
                  onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="বাড়ির নম্বর, রাস্তার নাম, এলাকা, জেলা"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  অতিরিক্ত তথ্য (ঐচ্ছিক)
                </label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="বিশেষ নির্দেশনা বা প্রয়োজনীয় তথ্য"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">সার্ভিস চার্জ:</span>
                  <span className="font-semibold">৳{service.price}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>মোট:</span>
                  <span className="text-green-600">৳{service.price}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              >
                পেমেন্টে এগিয়ে যান
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}