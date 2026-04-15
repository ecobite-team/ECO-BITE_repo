"use client";

import { useState, useEffect } from "react";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const result = await response.json();
        setOrders(result.data || []);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // MEMBER 4'S MODULE 2 FEATURE: Consumer Impact Analytics
  const completedOrders = orders.filter(o => o.status === 'Completed');
  const totalMealsSaved = completedOrders.length;
  const co2Reduced = totalMealsSaved * 2.5; // Average 2.5kg CO2 saved per meal
  const totalMoneySaved = totalMealsSaved * 8.50; // Estimated $8.50 average savings per rescue

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Impact Dashboard</h1>
        
        {/* Module 2 Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
            <p className="text-gray-500 text-sm font-medium">Meals Rescued</p>
            <p className="text-4xl font-black text-gray-800">{totalMealsSaved}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm font-medium">Estimated CO₂ Reduced</p>
            <p className="text-4xl font-black text-gray-800">{co2Reduced} <span className="text-lg">kg</span></p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm font-medium">Money Saved</p>
            <p className="text-4xl font-black text-gray-800">${totalMoneySaved.toFixed(2)}</p>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">My Orders</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading your history...</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders.map((order) => (
                <div key={order._id} className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 capitalize">{order.foodName}</h3>
                    <p className="text-sm text-gray-500">Pickup Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{order.pickupCode}</span></p>
                    
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <div className="p-8 text-center text-gray-500">No orders yet. Go rescue some food!</div>}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}