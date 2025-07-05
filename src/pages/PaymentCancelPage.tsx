import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ban, Home, ArrowLeft } from 'lucide-react';

export default function PaymentCancelPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate('/');
    }, 8000);

    return () => {
      clearInterval(countdownTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="bg-white max-w-xl w-full p-8 md:p-12 rounded-2xl shadow-lg text-center">
          <div className="mx-auto mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 text-yellow-600">
              <Ban size={40} />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">পেমেন্ট বাতিল হয়েছে</h1>
          <p className="text-gray-600 text-lg mb-6">
            আপনি পেমেন্ট প্রক্রিয়া বাতিল করেছেন। চাইলে আবার চেষ্টা করতে পারেন।
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
            <Link
              to="/"
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
            >
              <Home className="inline-block mr-2" size={18} />
              হোমে ফিরে যান
            </Link>

            <Link
              to="/services"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              <ArrowLeft className="inline-block mr-2" size={18} />
              অন্য সার্ভিস দেখুন
            </Link>
          </div>

          <p className="text-sm text-gray-400 mt-8">
            স্বয়ংক্রিয়ভাবে হোমপেজে রিডাইরেক্ট হবে {countdown} সেকেন্ডে...
          </p>
        </div>
      </main>
    </div>
  );
}
