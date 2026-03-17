"use client";

import { useState, useEffect } from "react";
import FoodMap from '../../components/FoodMap';

export default function FoodPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  
  // NEW: The Favorites Memory Bank
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // 1. Fetch the food from the database
    const fetchFood = async () => {
      try {
        const response = await fetch('/api/food');
        const result = await response.json();
        setFoods(result.data);
      } catch (error) {
        console.error("Failed to load food:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFood();

    // 2. Load any saved favorites from the browser's local storage
    const savedFavs = localStorage.getItem("ecoBiteFavorites");
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }
  }, []);

  // NEW: The Heart Toggle Function
  const toggleFavorite = (id) => {
    let newFavs;
    if (favorites.includes(id)) {
      newFavs = favorites.filter(favId => favId !== id); // Remove it
    } else {
      newFavs = [...favorites, id]; // Add it
    }
    
    setFavorites(newFavs);
    localStorage.setItem("ecoBiteFavorites", JSON.stringify(newFavs)); // Save to browser!
  };

  const handleReserve = async (foodId, foodName) => {
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodId, foodName })
      });
      const result = await response.json();

      if (response.ok) {
        alert(`Success! Your pickup code for ${foodName} is: ${result.data.pickupCode}\n\nShow this to the restaurant.`);
        setFoods((prev) => 
          prev.map((item) => item._id === foodId ? { ...item, quantity: item.quantity - 1 } : item)
        );
      } else {
        alert(result.error || "Failed to reserve.");
      }
    } catch (error) {
      console.error("Reservation error:", error);
    }
  };

  // UPDATED: The Filter Logic now includes the Watchlist!
  const displayedFoods = foods.filter((item) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Vegan") return item.isVegan === true;
    if (activeFilter === "Halal") return item.isHalal === true;
    if (activeFilter === "Favorites") return favorites.includes(item._id); // Only show hearted items!
    return true;
  });

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Surplus Food</h1>
        
        {!loading && <FoodMap foods={displayedFoods} />}

        {/* UPDATED: We added 'Favorites' to our array of buttons */}
        <div className="flex gap-4 mb-8">
          {["All", "Vegan", "Halal", "Favorites"].map((filterType) => (
            <button
              key={filterType}
              className={`px-4 py-2 rounded-full font-medium transition ${
                activeFilter === filterType 
                  ? "bg-green-600 text-white shadow-md" 
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setActiveFilter(filterType)}
            >
              {filterType === "Favorites" ? "❤️ Watchlist" : filterType}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-500 text-lg">Loading delicious food...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {displayedFoods.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500 relative">
                
                {/* NEW: The Clickable Heart in the top right corner */}
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-800 capitalize pr-8">{item.name}</h2>
                  <button 
                    onClick={() => toggleFavorite(item._id)}
                    className="absolute top-4 right-4 text-2xl hover:scale-110 transition-transform focus:outline-none"
                    title="Add to Watchlist"
                  >
                    {favorites.includes(item._id) ? "❤️" : "🤍"}
                  </button>
                </div>
                
                <div className="flex flex-col items-start mb-2">
                  <span className="text-sm text-gray-500">{item.restaurantName || "Local Partner"}</span>
                </div>

                <div className="flex flex-col items-end">
                  <div>
                    <span className="line-through text-gray-400 mr-2">${item.originalPrice}</span> 
                    <span className="text-green-600 font-bold text-xl">${item.dynamicPrice || item.discountedPrice}</span>
                  </div>
                  
                  {item.isSurgeDiscounted && (
                    <span className="text-xs font-bold text-white bg-red-500 px-2 py-1 rounded animate-pulse mt-1">
                      ⚡ Expiry Price Drop! ({item.hoursLeft}h left)
                    </span>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  {item.isVegan && <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Vegan</span>}
                  {item.isHalal && <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Halal</span>}
                </div>

                <button 
                  onClick={() => handleReserve(item._id, item.name)}
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

            {displayedFoods.length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 text-lg">
                  {activeFilter === "Favorites" 
                    ? "Your watchlist is empty. Click the heart icons to save your favorite meals!" 
                    : "No food matches this dietary filter."}
                </p>
              </div>
            )}

          </div>
        )}
      </div>
    </main>
  );
}