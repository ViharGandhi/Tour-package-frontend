import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PlusCircle,
    Edit,
    Trash2,
    PackagePlus,
    PackageSearch,
    PackageX,
    BookOpen  // Adding a booking-related icon
} from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const adminActions = [
        {
            title: 'Create Package',
            description: 'Add a new tour package to the system',
            icon: PackagePlus,
            route: '/admin/create',
            bgColor: 'bg-green-100',
            textColor: 'text-green-600',
            hoverColor: 'hover:bg-green-200'
        },
        {
            title: 'Update Package',
            description: 'Modify existing tour package details',
            icon: PackageSearch,
            route: '/admin/update',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-600',
            hoverColor: 'hover:bg-blue-200'
        },
        {
            title: 'Delete Package',
            description: 'Remove a tour package from the system',
            icon: PackageX,
            route: '/admin/delete',
            bgColor: 'bg-red-100',
            textColor: 'text-red-600',
            hoverColor: 'hover:bg-red-200'
        },
        {
            title: 'View Bookings',
            description: 'Check and manage all tour bookings',
            icon: BookOpen,
            route: '/admin/bookings',
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-600',
            hoverColor: 'hover:bg-purple-200'
        }
    ];

    const handleNavigation = (route) => {
        navigate(route);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-blue-800 mb-12">
                    Admin Dashboard
                </h1>
                <div className="grid md:grid-cols-3 gap-8">
                    {adminActions.map((action, index) => (
                        <div
                            key={index}
                            onClick={() => handleNavigation(action.route)}
                            className={`
                                ${action.bgColor}
                                ${action.hoverColor}
                                rounded-2xl p-6
                                shadow-lg
                                cursor-pointer
                                transform
                                transition-all
                                duration-300
                                hover:scale-105
                                hover:shadow-xl
                            `}
                        >
                            <div className="flex flex-col items-center">
                                <action.icon
                                    className={`w-16 h-16 mb-4 ${action.textColor}`}
                                />
                                <h2 className={`text-2xl font-semibold mb-2 ${action.textColor}`}>
                                    {action.title}
                                </h2>
                                <p className="text-center text-gray-600">
                                    {action.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;