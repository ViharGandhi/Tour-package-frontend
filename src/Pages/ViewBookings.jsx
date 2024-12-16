import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, User, Mail, Users, DollarSign, FileText } from 'lucide-react';

const ViewBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}viewbookings`);
                setBookings(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch bookings');
                setLoading(false);
                console.error('Error fetching bookings:', err);
            }
        };

        fetchBookings();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
                <div className="text-2xl text-blue-800 font-semibold">Loading Bookings...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
                <div className="text-2xl text-red-600 font-semibold">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-blue-800 mb-12 flex items-center justify-center">
                    <BookOpen className="mr-4 w-12 h-12" /> View Bookings
                </h1>

                {bookings.length === 0 ? (
                    <div className="text-center text-gray-600 text-2xl">
                        No bookings found.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bookings.map((booking) => (
                            <div 
                                key={booking._id} 
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-100"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <User className="mr-3 text-blue-600" />
                                        <span className="font-semibold text-gray-800">{booking.Name}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="mr-3 text-green-600" />
                                        <span className="text-gray-700">{booking.Email}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="mr-3 text-purple-600" />
                                        <span className="text-gray-700">
                                            Travelers: {booking.Travelers}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <DollarSign className="mr-3 text-green-700" />
                                        <span className="font-bold text-green-800">
                                            Total Cost: ₹{booking.Totalcost.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <FileText className="mr-3 text-gray-500" />
                                        <span className="text-gray-600">
                                            Special Requests: {booking.SpecialRequest || 'None'}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <BookOpen className="mr-3 text-blue-500" />
                                        <span className="text-gray-700">
                                            Package ID: {booking.PackageId}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewBookings;