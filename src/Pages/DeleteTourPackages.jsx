import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const DeleteTourPackages = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all packages on component mount
  useEffect(() => {
    fetchPackages();
  }, []);

  // Function to fetch all packages
  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}getallpackages`);
      setPackages(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching packages:", error);
      setIsLoading(false);
      alert("Failed to fetch packages");
    }
  };

  // Function to delete a package
  const handleDeletePackage = async (packageId) => {
    try {
      // Show deleting status
      alert("Deleting package...");

      // Send delete request
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}deletepackage`, {
        data: { packageId } // Send packageId in request body
      });

      // Check for successful deletion
      if (response.status === 202) {
        alert("Package deleted successfully");
        
        // Remove the deleted package from the local state
        setPackages(packages.filter(pkg => pkg._id !== packageId));
      } else {
        alert("Deletion failed");
      }
    } catch (error) {
      console.error("Error deleting package:", error);
      alert("Error deleting package");
    }
  };

  // Render loading state
  if (isLoading) {
    return <div className="p-4 text-center">Loading packages...</div>;
  }

  return (
    <div className="p-4">
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h2 className="text-2xl font-semibold leading-none tracking-tight">Delete Tour Packages</h2>
        </div>
        <div className="p-6 pt-0">
          {packages.length === 0 ? (
            <p className="text-center text-gray-500">No packages available</p>
          ) : (
            <div className="space-y-4">
              {packages.map((pkg) => (
                <div 
                  key={pkg._id} 
                  className="flex items-center p-3 border rounded-lg space-x-4"
                >
                  {/* Image */}
                  <img 
                    src={pkg.Image} 
                    alt={pkg.Title} 
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  
                  {/* Package Details */}
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg">{pkg.Title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{pkg.Description}</p>
                    
                    <div className="flex space-x-4 text-sm">
                      <span>
                        <strong>Available Date:</strong> {pkg.Availabedate}
                      </span>
                      <span>
                        <strong>Price:</strong> ₹{pkg.Price}
                      </span>
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  <button 
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-red-500 text-red-500 hover:bg-red-100 h-10 w-10 p-2"
                    onClick={() => handleDeletePackage(pkg._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteTourPackages;