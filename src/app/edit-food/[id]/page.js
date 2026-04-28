"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditFoodPage() {
  const router = useRouter();
  const params = useParams(); // Safely pulls the ID from the URL
  const id = params?.id;

  const [formData, setFormData] = useState({
    name: "", quantity: "", originalPrice: "", discountedPrice: "", isVegan: false, isHalal: false, expiryTime: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchSingleItem = async () => {
      try {
        const response = await fetch('/api/food');
        const result = await response.json();
        
        const item = result.data.find(f => f._id === id);

        if (item) {
          // Format the MongoDB Date so the HTML input doesn't crash
          let formattedDate = "";
          if (item.expiryTime) {
            formattedDate = new Date(item.expiryTime).toISOString().slice(0, 16);
          }

          setFormData({
            name: item.name,
            quantity: item.quantity,
            originalPrice: item.originalPrice,
            discountedPrice: item.discountedPrice,
            isVegan: item.isVegan || false,
            isHalal: item.isHalal || false,
            expiryTime: formattedDate
          });
        }
      } catch (error) {
        console.error("Failed to load item:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSingleItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // We send the ID in both the URL and the Body to ensure it hits whichever PUT route you saved!
      const response = await fetch(`/api/food?id=${id}`, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...formData })
      });

      if (response.ok) {
        alert("Listing Updated Successfully!");
        router.push('/dashboard'); 
      } else {
        alert("Failed to update listing.");
      }
    } catch (error) {
      console.error("Error submitting edit:", error);
    }
  };

  if (loading) return <div className="min-h-screen p-8 text-center text-gray-500">Loading editor...</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Food Listing</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-green-500 focus:border-green-500" required />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-green-500 focus:border-green-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Orig. Price ($)</label>
              <input type="number" step="0.01" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-green-500 focus:border-green-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount Price ($)</label>
              <input type="number" step="0.01" name="discountedPrice" value={formData.discountedPrice} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-green-500 focus:border-green-500" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Expiry / Closing Time</label>
            <input type="datetime-local" name="expiryTime" value={formData.expiryTime} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-green-500 focus:border-green-500" required />
          </div>

          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <input type="checkbox" name="isVegan" checked={formData.isVegan} onChange={handleChange} className="w-4 h-4 text-green-600 rounded" />
              Vegan
            </label>
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <input type="checkbox" name="isHalal" checked={formData.isHalal} onChange={handleChange} className="w-4 h-4 text-green-600 rounded" />
              Halal
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <button type="submit" className="flex-1 bg-green-600 text-white font-bold py-3 rounded-md hover:bg-green-700 transition">Save Changes</button>
            <button type="button" onClick={() => router.push('/dashboard')} className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-md hover:bg-gray-300 transition">Cancel</button>
          </div>
        </form>
      </div>
    </main>
  );
}