import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  User, 
  Mail, 
  Phone, 
  Users, 
  MessageCircle, 
  CheckCircle, 
  ArrowRight 
} from 'lucide-react';
import Invoice from './Invoice';

const BookingPage = () => {
  // Use useLocation to access the passed state
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the tour package from location state, with a fallback
  const tourPackage = location.state?.tourPackage || {
    id: null,
    title: "Select a Tour Package",
    price: 0,
    description: "No package selected. Please go back and choose a tour."
  };

  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    travelers: 1,
    specialRequests: 'None',
    packageId: tourPackage.id
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!bookingDetails.name.trim()) newErrors.name = "Name is required";
    if (!bookingDetails.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(bookingDetails.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!bookingDetails.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(bookingDetails.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (bookingDetails.travelers < 1) {
      newErrors.travelers = "At least 1 traveler is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;

    // Prevent multiple submissions
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      // Prepare booking data
      const bookingData = {
        ...bookingDetails,
        totalPrice: totalCost
      };

      // Submit booking to backend
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}createbooking`, bookingData);
      
      if(response.status === 201) {
        setSubmitSuccess(true);
        setBookingResponse(response.data);
      }
    
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCost = tourPackage.price * bookingDetails.travelers;

  // If no tour package is selected, show an error message
  if (!location.state?.tourPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-4">No Tour Package Selected</h2>
          <p className="text-red-500">Please go back and select a tour package to book.</p>
        </div>
      </div>
    );
  }

  // If booking is successful, show the invoice
  if (submitSuccess) {
    return (
      <Invoice 
        bookingData={bookingDetails} 
        tourPackage={tourPackage} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Tour Details */}
        <div className="md:w-1/2 bg-blue-600 text-white p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4">{tourPackage.title}</h2>
            <p className="text-white/80 mb-4">{tourPackage.description}</p>
            <div className="mb-6 space-y-3">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6" />
                <span>Travelers: {bookingDetails.travelers}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6" />
                <span>Per Person Price: ₹{tourPackage.price.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">Total Cost</span>
              <span className="text-2xl font-bold">
                ₹{totalCost.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Booking Form */}
        <div className="md:w-1/2 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Book Your Adventure
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <div className="relative">
                <input 
                  type="text" 
                  name="name"
                  placeholder="Full Name"
                  value={bookingDetails.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 
                    ${errors.name ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email Input */}
            <div>
              <div className="relative">
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email Address"
                  value={bookingDetails.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 
                    ${errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone Input */}
            <div>
              <div className="relative">
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="Phone Number"
                  value={bookingDetails.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 
                    ${errors.phone ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Number of Travelers */}
            <div>
              <div className="relative">
                <input 
                  type="number" 
                  name="travelers"
                  min="1"
                  placeholder="Number of Travelers"
                  value={bookingDetails.travelers}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 
                    ${errors.travelers ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
                />
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.travelers && <p className="text-red-500 text-sm mt-1">{errors.travelers}</p>}
            </div>

            {/* Special Requests */}
            <div>
              <div className="relative">
                <textarea 
                  name="specialRequests"
                  placeholder="Special Requests (Optional)"
                  value={bookingDetails.specialRequests}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none h-24"
                />
                <MessageCircle className="absolute left-3 top-4 text-gray-400" />
              </div>
            </div>

            {/* Confirm Booking Button */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full text-white py-3 rounded-lg 
              transition duration-300 flex items-center 
              justify-center space-x-2 group
              ${isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              <span>{isSubmitting ? 'Submitting...' : 'Confirm Booking'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;