"use client";

import { useState } from "react";

export default function FoodPage() {
  // MOCK DATA: Placeholder data so the UI team can build filters and favorites 
  // before the backend Database API is finished!
  const [foods, setFoods] = useState([
    {
      _id: "mock-1",
      name: "Blueberry Muffins",
      restaurantName: "Downtown Bakery",
      originalPrice: 15,
      discountedPrice: 5,
      quantity: 12,
      isVegan: true,
      isHalal: true
    },
    {
      _id: "mock-2",
      name: "Spicy Chicken Wrap",
      restaurantName: "City Deli",
      originalPrice: 12,
      discountedPrice: 6,
      quantity: 4,
      isVegan: false,
      isHalal: true
    },
    {
      _id: "mock-3",
      name: "Bacon Cheeseburger",
      restaurantName: "Burger Joint",
      originalPrice: 18,
      discountedPrice: 9,
      quantity: 0, // Sold out!
      isVegan: false,
      isHalal: false
    }
  ]);

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Surplus Food</h1>
        
        {/* Placeholder for Member 2's Filter Buttons */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {foods.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500 relative">
              
              {/* Placeholder for Member 4's Watchlist Heart */}

              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-gray-800 capitalize pr-8">{item.name}</h2>
              </div>
              
              <div className="flex flex-col items-start mb-2">
                <span className="text-sm text-gray-500">{item.restaurantName || "Local Partner"}</span>
              </div>

              <div className="flex flex-col items-end">
                <div>
                  <span className="line-through text-gray-400 mr-2">${item.originalPrice}</span> 
                  <span className="text-green-600 font-bold text-xl">${item.discountedPrice}</span>
                </div>
              </div>

              {/* Temporary tags so Member 2 can see their filters working */}
              <div className="mt-4 flex gap-2">
                {item.isVegan && <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Vegan</span>}
                {item.isHalal && <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Halal</span>}
              </div>

              <button 
                disabled={item.quantity <= 0} 
                className={`w-full mt-6 font-semibold py-2 rounded transition ${
                  item.quantity > 0 
                    ? "bg-gray-900 text-white hover:bg-gray-800" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {item.quantity > 0 ? "Reserve Now" : "Sold Out"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}