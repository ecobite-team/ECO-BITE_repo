"use client"; 

import { useState, useEffect } from "react";

export default function AddFoodPage() {
  // 1. Grab the logged-in user from the browser's memory
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("ecoBiteUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // 2. The Form Memory Bank (State)
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    originalPrice: "",
    discountedPrice: "",
    isVegan: false,
    isHalal: false,
    expiryTime: "",
  });

  // 3. The universal updater function
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, 
    }));
  };

  // 4. The Submit Button logic
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    try {
      const response = await fetch('/api/food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData,
          // Now it actually knows who the currentUser is!
          restaurantId: currentUser?.id,
          restaurantName: currentUser?.name || "Unknown Restaurant",
          restaurantAddress: currentUser?.address || "Unknown Location"
        })
      });

      if (response.ok) {
        alert("Success! Sent to MongoDB.");
        setFormData({
          name: "", quantity: "", originalPrice: "", discountedPrice: "", isVegan: false, isHalal: false
        });
      } else {
        alert("Uh oh. Something went wrong on the server.");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 flex justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md mt-10 h-fit">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">List Surplus Food</h1>
        
        {/* Notice we added onSubmit here */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Food Item Name</label>
            <input 
              type="text" 
              name="name" // MUST match the state variable name
              value={formData.name} // Binds to memory
              onChange={handleChange} // Updates memory on every keystroke
              placeholder="e.g., Blueberry Muffins" 
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              required
            />
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity Available</label>
            <input 
              type="number" 
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="e.g., 5" 
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              required
            />
          </div>

          {/* Price Inputs */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Original Price ($)</label>
              <input 
                type="number" 
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="0.00" 
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Discounted Price ($)</label>
              <input 
                type="number" 
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleChange}
                placeholder="0.00" 
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 border-green-500 text-gray-900"
                required
              />
            </div>
          </div>

          {/* Dietary Checkboxes */}
          <div className="flex gap-6 pt-2">
            <label className="flex items-center space-x-2 text-gray-700">
              <input 
                type="checkbox" 
                name="isVegan"
                checked={formData.isVegan}
                onChange={handleChange}
                className="rounded text-green-600" 
              />
              <span>Vegan</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-700">
              <input 
                type="checkbox" 
                name="isHalal"
                checked={formData.isHalal}
                onChange={handleChange}
                className="rounded text-green-600" 
              />
              <span>Halal</span>
            </label>
          </div>
          
          {/* NEW: Expiry Time Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Expiry / Closing Time</label>
            <input 
              type="datetime-local" 
              name="expiryTime"
              value={formData.expiryTime}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              required
            />
          </div>
          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition mt-4"
          >
            Post to Eco-Bite
          </button>
        </form>
      </div>
    </main>
  );
}