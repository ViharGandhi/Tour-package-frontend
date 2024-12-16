import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Calendar, 
  MapPin, 
  Coins, 
  Plane, 
  Compass, 
  Star 
} from 'lucide-react';

const TourPackagesHome = () => {
  const navigate = useNavigate();
  const [tourPackages, setTourPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTourPackages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}getallpackages`);
        
        const formattedPackages = response.data.map(pkg => ({
          id: pkg._id,
          title: pkg.Title,
          description: pkg.Description,
          price: parseInt(pkg.Price),
          availableDates: [pkg.Availabedate],
          image: pkg.Image,
          rating: 4.7, 
          location: pkg.Title 
        }));

        setTourPackages(formattedPackages);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch tour packages');
        setIsLoading(false);
        console.error('Error fetching tour packages:', err);
      }
    };

    fetchTourPackages();
  }, []);

  const handleBookNow = (tour) => {
    navigate('/booking', { state: { tourPackage: tour } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Plane className="w-12 h-12 mx-auto animate-bounce text-blue-600" />
          <p className="mt-4 text-gray-600">Loading tour packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-50 p-8 rounded-lg">
          <p className="text-red-600 font-semibold">{error}</p>
          <p className="text-gray-600 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <div className="inline-block bg-blue-100 px-4 py-2 rounded-full mb-4">
          <div className="flex items-center text-blue-800 space-x-2">
            <Plane className="w-5 h-5" />
            <span className="text-sm font-medium">Explore the World</span>
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Unforgettable Travel Experiences
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover extraordinary destinations that create lasting memories. Our carefully curated tour packages offer something for every traveler.
        </p>
      </div>

      {/* Tour Packages Grid */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {tourPackages.length === 0 ? (
          <div className="col-span-full text-center text-gray-600">
            No tour packages available
          </div>
        ) : (
          tourPackages.map((tour) => (
            <div 
              key={tour.id} 
              className="bg-white group rounded-2xl shadow-lg overflow-hidden 
              transition duration-300 transform hover:-translate-y-4 hover:shadow-2xl 
              border border-gray-100 relative"
            >
              {/* Location Badge */}
              <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm 
              rounded-full px-3 py-1 text-sm font-semibold text-gray-800 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                {tour.location}
              </div>

              {/* Package Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={tour.image} 
                  alt={tour.title} 
                  className="w-full h-64 object-cover transition duration-300 
                  group-hover:scale-110 brightness-90 group-hover:brightness-100"
                />
                <div className="absolute bottom-0 left-0 right-0 h-1/2 
                bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              {/* Package Details */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {tour.title}
                  </h2>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-5 h-5 fill-current mr-1" />
                    <span className="font-semibold">{tour.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 line-clamp-3">
                  {tour.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <Coins className="w-5 h-5 mx-auto mb-2 text-blue-600" />
                    <span className="block font-semibold text-blue-800">
                      ₹{tour.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-gray-600">Per Person</span>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <Calendar className="w-5 h-5 mx-auto mb-2 text-green-600" />
                    <span className="block font-semibold text-green-800">
                      {tour.availableDates[0]}
                    </span>
                    <span className="text-xs text-gray-600">Next Available</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleBookNow(tour)}
                  className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg 
                  hover:bg-blue-700 transition duration-300 flex items-center 
                  justify-center space-x-2 group"
                >
                  <Compass className="w-5 h-5 group-hover:animate-spin-slow" />
                  <span>Book Now</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TourPackagesHome;