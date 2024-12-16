import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit2 } from 'lucide-react';

const UpdateTourPackages = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

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

  // Function to handle edit of a package
  const handleEditPackage = (pkg) => {
    setEditingPackage({ ...pkg });
  };

  // Function to update package
  const handleUpdatePackage = async () => {
    try {
      // Validate input
      if (!editingPackage.Title || !editingPackage.Description || !editingPackage.Price) {
        alert("Please fill all required fields");
        return;
      }

      // Send update request
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}updatepackage`, editingPackage);

      // Check for successful update
      if (response.status === 200) {
        alert("Package updated successfully");
        
        // Update local state
        setPackages(packages.map(pkg => 
          pkg._id === editingPackage._id ? editingPackage : pkg
        ));

        // Close editing mode
        setEditingPackage(null);
      } else {
        alert("Update failed");
      }
    } catch (error) {
      console.error("Error updating package:", error);
      alert("Error updating package");
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
          <h2 className="text-2xl font-semibold leading-none tracking-tight">Update Tour Packages</h2>
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
                  
                  {/* Package Details or Edit Form */}
                  {editingPackage && editingPackage._id === pkg._id ? (
                    <div className="flex-grow space-y-2">
                      <input
                        type="text"
                        value={editingPackage.Title}
                        onChange={(e) => setEditingPackage({...editingPackage, Title: e.target.value})}
                        className="w-full p-2 border rounded"
                        placeholder="Package Title"
                      />
                      <textarea
                        value={editingPackage.Description}
                        onChange={(e) => setEditingPackage({...editingPackage, Description: e.target.value})}
                        className="w-full p-2 border rounded"
                        placeholder="Package Description"
                        rows={3}
                      />
                      <div className="flex space-x-4">
                        <input
                          type="text"
                          value={editingPackage.Availabedate}
                          onChange={(e) => setEditingPackage({...editingPackage, Availabedate: e.target.value})}
                          className="w-full p-2 border rounded"
                          placeholder="Available Date"
                        />
                        <input
                          type="number"
                          value={editingPackage.Price}
                          onChange={(e) => setEditingPackage({...editingPackage, Price: e.target.value})}
                          className="w-full p-2 border rounded"
                          placeholder="Price"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdatePackage}
                          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingPackage(null)}
                          className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
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
                  )}
                  
                  {/* Edit Button */}
                  {!editingPackage && (
                    <button 
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-blue-500 text-blue-500 hover:bg-blue-100 h-10 w-10 p-2"
                      onClick={() => handleEditPackage(pkg)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateTourPackages;