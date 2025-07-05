import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, User, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useServices } from '../contexts/ServiceContext';

interface ServiceCardProps {
  service: any;
  onEdit?: (service: any) => void;
  showActions?: boolean;
}

export default function ServiceCard({ service, onEdit, showActions = false }: ServiceCardProps) {
  const { user } = useAuth();
  const { updateService, deleteService } = useServices();

  const handleToggleAvailability = async () => {
    try {
      await updateService(service.id, { available: !service.available });
    } catch (error) {
      console.error('Error toggling service availability:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই সার্ভিসটি মুছে ফেলতে চান?')) {
      try {
        await deleteService(service.id);
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 ${!service.available ? 'opacity-75' : ''}`}>
      <div className="relative">
        <img 
          src={service.image_url} 
          alt={service.title}
          className="w-full h-48 object-cover"
        />
        {!service.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              অনুপলব্ধ
            </span>
          </div>
        )}
      </div>
      
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
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-green-600">৳{service.price}</span>
            <span className="text-sm text-gray-500 ml-1">থেকে শুরু</span>
          </div>
          
          {showActions && user?.id === service.provider_id ? (
            <div className="flex space-x-2">
              <button
                onClick={handleToggleAvailability}
                className={`p-2 rounded-lg transition-colors ${
                  service.available 
                    ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
                title={service.available ? 'অনুপলব্ধ করুন' : 'উপলব্ধ করুন'}
              >
                {service.available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => onEdit?.(service)}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                title="সম্পাদনা করুন"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                title="মুছে ফেলুন"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            service.available && (
              <Link
                to={`/book/${service.id}`}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                বুক করুন
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}