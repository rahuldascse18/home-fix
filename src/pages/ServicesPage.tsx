import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useServices } from '../contexts/ServiceContext';
import { Star, MapPin, Search, Filter, User } from 'lucide-react';

export default function ServicesPage() {
  const { services, categories } = useServices();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const locations = [...new Set(services.map(service => service.location))];

  const filteredServices = services
    .filter(service => {
      return (
        service.available &&
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === '' || service.category === selectedCategory) &&
        (selectedLocation === '' || service.location === selectedLocation)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">আমাদের সার্ভিসমূহ</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            আপনার প্রয়োজনীয় সার্ভিস খুঁজে নিন এবং দক্ষ কারিগর বুক করুন
          </p>
          <div className="mt-4 text-sm text-gray-500">
            মোট {filteredServices.length}টি সার্ভিস পাওয়া গেছে
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="সার্ভিস খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">সব ক্যাটেগরি</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">সব এলাকা</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="newest">নতুন আগে</option>
              <option value="price-low">কম দাম আগে</option>
              <option value="price-high">বেশি দাম আগে</option>
              <option value="rating">রেটিং অনুযায়ী</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedLocation('');
                setSortBy('newest');
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              রিসেট
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-2">
              <img 
                src={service.image_url} 
                alt={service.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {service.category}
                  </span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{service.rating}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{service.location}</span>
                  </div>
                  {service.provider && (
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-1" />
                      <span>{service.provider.name}</span>
                      {service.provider.verified && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          যাচাইকৃত
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-green-600">৳{service.price}</span>
                    <span className="text-sm text-gray-500 ml-1">থেকে শুরু</span>
                  </div>
                  <Link
                    to={`/book/${service.id}`}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    বুক করুন
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">কোনো সার্ভিস পাওয়া যায়নি</h3>
            <p className="text-gray-600 mb-4">অন্য কীওয়ার্ড দিয়ে খুঁজে দেখুন বা ফিল্টার পরিবর্তন করুন</p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• বিভিন্ন কীওয়ার্ড ব্যবহার করে দেখুন</p>
              <p>• ক্যাটেগরি বা এলাকা পরিবর্তন করুন</p>
              <p>• ফিল্টার রিসেট করে আবার চেষ্টা করুন</p>
            </div>
          </div>
        )}

        {/* Categories Section */}
        {categories.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">সার্ভিস ক্যাটেগরি</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map(category => {
                const categoryServiceCount = services.filter(s => s.category === category.name && s.available).length;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                      selectedCategory === category.name
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">
                      {category.icon === 'zap' && '⚡'}
                      {category.icon === 'droplets' && '💧'}
                      {category.icon === 'wind' && '❄️'}
                      {category.icon === 'sparkles' && '✨'}
                      {category.icon === 'paintbrush' && '🎨'}
                      {category.icon === 'hammer' && '🔨'}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{category.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{categoryServiceCount} সার্ভিস</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}