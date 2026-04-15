"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; 
import { useRouter } from "next/navigation";

export default function RestaurantDashboard() {
  const router = useRouter();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- THE BOUNCER ---
  useEffect(() => {
    const savedUser = localStorage.getItem("ecoBiteUser");
    const user = savedUser ? JSON.parse(savedUser) : null;

    if (!user || user.role !== "restaurant") {
      alert("Access Denied: Restaurant Partners Only.");
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('/api/food');
        const result = await response.json();
        setInventory(result.data || []);
      } catch (error) {
        console.error("Failed to load inventory:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  // MEMBER 2'S FEATURE: Quick Analytics Calculations
  const totalItems = inventory.length;
  const totalMealsSaved = inventory.reduce((total, item) => total + item.quantity, 0);
  const potentialRevenue = inventory.reduce((total, item) => total + ((item.dynamicPrice || item.discountedPrice) * item.quantity), 0);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const response = await fetch(`/api/food?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setInventory((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert("Failed to delete the item.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Restaurant Dashboard</h1>
          <div className="flex gap-4">
            <Link href="/verify" className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition font-medium shadow-sm border border-gray-700">
              Verify Pickup Code
            </Link>
            <Link href="/add-food" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition font-medium shadow-sm">
              + Add New Listing
            </Link>
          </div>
        </div>

        {/* MEMBER 2'S FEATURE: Impact Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
            <p className="text-gray-500 text-sm font-medium">Active Listings</p>
            <p className="text-3xl font-bold text-gray-800">{totalItems}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 border-l-4 border-l-green-500">
            <p className="text-gray-500 text-sm font-medium">Potential Revenue</p>
            <p className="text-3xl font-bold text-gray-800">${potentialRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 border-l-4 border-l-emerald-500">
            <p className="text-gray-500 text-sm font-medium">Est. Meals Saved</p>
            <p className="text-3xl font-bold text-gray-800">{totalMealsSaved}</p>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Current Inventory</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-gray-500">Loading inventory data...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                  <th className="p-4 font-medium">Item Name</th>
                  <th className="p-4 font-medium">Quantity</th>
                  <th className="p-4 font-medium">Price (Orig / Disc)</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-800 capitalize">{item.name}</td>
                    <td className="p-4 text-gray-600">{item.quantity} units</td>
                    <td className="p-4 text-gray-600">
                      <span className="line-through text-gray-400 mr-2">${item.originalPrice}</span> 
                      <span className="text-green-600 font-medium">${item.dynamicPrice || item.discountedPrice}</span>
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <Link href={`/edit-food/${item._id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</Link>
                      <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
                {inventory.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      No active listings. Click "Add New Listing" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}