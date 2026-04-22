"use client";

import { useState, useEffect } from "react";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);



  // AI Recipe States
  const [aiRecipe, setAiRecipe] = useState(null);
  const [generating, setGenerating] = useState(false);  

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

  // --- NEW: GAMIFICATION MATH ---
  const ecoPoints = totalMealsSaved * 100;
  
  let badge = "🌱 Seedling";
  if (ecoPoints >= 500) badge = "🌿 Earth Defender";
  if (ecoPoints >= 1000) badge = "🌳 Food Waste Hero";

  const pointsToNextReward = 500 - (ecoPoints % 500);
  const rewardsAvailable = Math.floor(ecoPoints / 500);
  const progressPercentage = (ecoPoints % 500) / 5; // Turns 0-500 into 0-100%

  const generateMagicRecipe = async () => {
    setGenerating(true);
    setAiRecipe(null);
    try {
      const foodNames = completedOrders.map(order => order.foodName);
      
      const response = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: foodNames })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        alert(`API Error: ${result.error}`);
      } else {
        setAiRecipe(result.recipe);
      }
    } catch (error) {
      console.error("Recipe generation failed:", error);
    } finally {
      setGenerating(false);
    }
  };

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
        {/* Gamification & Rewards Board */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-400 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="w-full md:w-1/2">
            <p className="text-gray-500 text-sm font-medium">Current Rank: <span className="font-bold text-gray-800">{badge}</span></p>
            <h2 className="text-4xl font-black text-yellow-500 my-1">
              {ecoPoints} <span className="text-lg text-gray-400 font-medium tracking-normal">Eco-Points</span>
            </h2>
            <p className="text-xs text-gray-500">
              {pointsToNextReward} points until your next free meal reward!
            </p>
          </div>
          
          <div className="w-full md:w-1/2 bg-gray-50 p-4 rounded-lg border border-gray-100">
             <div className="flex justify-between text-xs font-bold text-gray-400 mb-1">
               <span>Reward Progress</span>
               <span>{ecoPoints % 500} / 500</span>
             </div>
             {/* The Progress Bar */}
             <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                <div 
                  className="bg-yellow-400 h-3 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
             </div>
             
             <button
               disabled={rewardsAvailable === 0}
               className={`w-full py-2 rounded-md font-bold transition shadow-sm ${
                 rewardsAvailable > 0 
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
               }`}
               onClick={() => alert("🎉 Voucher Claimed! Check your student email for the QR code.")}
             >
               Redeem Voucher ({rewardsAvailable} Available)
             </button>
          </div>
        </div>
        {/* Magic AI Recipe Generator */}
        {completedOrders.length > 0 && (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-md p-6 mb-8 text-white">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  ✨ Gemini Magic Recipe Maker
                </h2>
                <p className="text-purple-100 text-sm mt-1">Stuck with random rescued ingredients? Let AI cook for you.</p>
              </div>
              <button 
                onClick={generateMagicRecipe}
                disabled={generating}
                className="bg-white text-purple-700 font-bold px-4 py-2 rounded-md hover:bg-gray-100 transition shadow-sm disabled:opacity-50"
              >
                {generating ? "Cooking..." : "Generate Recipe"}
              </button>
            </div>
            
            {aiRecipe && (
              <div className="bg-white/10 p-4 rounded-lg border border-white/20 text-sm leading-relaxed whitespace-pre-wrap">
                {aiRecipe}
              </div>
            )}
          </div>
        )}

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