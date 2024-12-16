import React, { useState, useEffect } from 'react';
import Storefile from './InputFile';
import { Getfileurl } from './InputFile';
import axios from 'axios';

const CreatePackage = () => {
  const [packageDetails, setPackageDetails] = useState({
    title: '',
    description: '',
    price: '',
    availableDates: '',
    image: ''
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState({});
  const [imageurl, setImageurl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // State to store success message

  // Update packageDetails when imageurl changes
  useEffect(() => {
    if (imageurl) {
      setPackageDetails(prev => ({
        ...prev,
        image: imageurl
      }));
      // Clear any previous image-related errors
      setError(prev => {
        const { image, ...rest } = prev;
        return rest;
      });
    }
  }, [imageurl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPackageDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (file) => {
    if (file) {
      setIsUploading(true);
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      try {
        const ImageId = await Storefile(file);
        const dataurl = await Getfileurl(ImageId);
        
        setImageurl(dataurl);
      } catch (error) {
        console.error('Image upload error:', error);
        // Handle upload error
        setError(prev => ({
          ...prev,
          image: 'Failed to upload image'
        }));
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
  
    // Basic validation
    const newErrors = {};
    if (!packageDetails.title.trim()) newErrors.title = 'Title is required';
    if (!packageDetails.description.trim()) newErrors.description = 'Description is required';
    if (!packageDetails.price) newErrors.price = 'Price is required';
    if (!packageDetails.availableDates) newErrors.availableDates = 'Available dates are required';
    if (!packageDetails.image) newErrors.image = 'Image is required';
  
    // If there are errors, set them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    // Log the package details (replace with actual submission logic)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}`, // Assuming your backend endpoint
        packageDetails
      );
      
      
      // If successful, set the success message
      if (response.status === 201) {
        setSuccessMessage('Package created successfully!');
      }
    } catch (error) {
      console.error('Package creation failed:', error);
      setError(prev => ({
        ...prev,
        submit: 'Failed to create package'
      }));
    }

    // Reset form after submission
    setPackageDetails({
      title: '',
      description: '',
      price: '',
      availableDates: '',
      image: ''
    });
    setImagePreview(null);
    setImageurl('');
    setError({});
  };

  const ImageUploader = () => {
    const fileInputRef = React.useRef(null);

    const triggerFileInput = () => {
      fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        handleImageUpload(file);
      }
    };

    return (
      <div className="w-full">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <div 
          onClick={triggerFileInput}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition"
        >
          {imagePreview ? (
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-12 h-12 text-gray-400"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              <p className="text-gray-500 mt-2">Upload Tour Package Image</p>
            </>
          )}
        </div>
        {error.image && (
          <p className="text-red-500 text-sm mt-1">{error.image}</p>
        )}
        {isUploading && (
          <p className="text-blue-500 text-sm mt-1">Uploading image...</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Create Tour Package
        </h1>
        
        {successMessage && (
          <div className="bg-green-500 text-white text-center py-2 mb-4 rounded-md">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Tour Package Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={packageDetails.title}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border ${error.title ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {error.title && <p className="text-red-500 text-sm mt-1">{error.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={packageDetails.description}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border ${error.description ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {error.description && <p className="text-red-500 text-sm mt-1">{error.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price (₹)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={packageDetails.price}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border ${error.price ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {error.price && <p className="text-red-500 text-sm mt-1">{error.price}</p>}
            </div>

            <div>
              <label htmlFor="availableDates" className="block text-sm font-medium text-gray-700">
                Available Dates
              </label>
              <input
                type="text"
                id="availableDates"
                name="availableDates"
                value={packageDetails.availableDates}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border ${error.availableDates ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {error.availableDates && <p className="text-red-500 text-sm mt-1">{error.availableDates}</p>}
            </div>
          </div>

          <ImageUploader />

          <div>
            <button 
              type="submit" 
              className="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Create Package
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePackage;
