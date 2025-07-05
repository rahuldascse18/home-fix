import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useServices } from '../contexts/ServiceContext';
import { Star, MapPin, Shield, Users, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const { services } = useServices();

  const featuredServices = services.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              বাংলাদেশের সবচেয়ে <br />
              <span className="text-yellow-300">বিশ্বস্ত হোম সার্ভিস</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              আপনার বাড়ির যে কোনো সমস্যার জন্য দক্ষ ও অভিজ্ঞ কারিগর খুঁজে নিন। 
              সহজ, নিরাপদ ও সাশ্রয়ী মূল্যে।
            </p>
            
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/register"
                  className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg"
                >
                  আজই যোগ দিন
                </Link>
                <Link
                  to="/services"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-green-600 transition-all"
                >
                  সার্ভিস দেখুন
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">১০,০০০+</h3>
              <p className="text-gray-600">সন্তুষ্ট গ্রাহক</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">৫,০০০+</h3>
              <p className="text-gray-600">সম্পন্ন সার্ভিস</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">৯৮%</h3>
              <p className="text-gray-600">সন্তুষ্টির হার</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">জনপ্রিয় সার্ভিস</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              আমাদের সবচেয়ে চাহিদাপূর্ণ সার্ভিসগুলো দেখুন
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-2">
                <img 
                  src={service.image_url} 
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{service.rating}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {service.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">৳{service.price}</span>
                    <Link
                      to={`/book/${service.id}`}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      বুক করুন
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              সব সার্ভিস দেখুন
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">কিভাবে কাজ করে</h2>
            <p className="text-xl text-gray-600">মাত্র ৩টি সহজ ধাপে সার্ভিস নিন</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                ১
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">সার্ভিস নির্বাচন করুন</h3>
              <p className="text-gray-600">আপনার প্রয়োজনীয় সার্ভিস খুঁজে নিন এবং বুক করুন</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                ২
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">সময় ও ঠিকানা দিন</h3>
              <p className="text-gray-600">আপনার সুবিধামত সময় ও ঠিকানা নির্ধারণ করুন</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                ৩
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">সার্ভিস উপভোগ করুন</h3>
              <p className="text-gray-600">দক্ষ কারিগর আপনার কাজ সম্পন্ন করবেন</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">আজই শুরু করুন</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            বাংলাদেশের সবচেয়ে বিশ্বস্ত হোম সার্ভিস প্ল্যাটফর্মে যোগ দিন
          </p>
          {!user && (
            <Link
              to="/register"
              className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg"
            >
              ফ্রি রেজিস্টার করুন
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}