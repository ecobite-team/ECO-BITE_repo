"use client";

import { useState, useEffect } from "react";
import CharityRouteMap from "../../components/CharityRouteMap";

export default function CharityBulkClaim() {
  const [availableFood, setAvailableFood] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await fetch('/api/food');
        const result = await response.json();
        const instock = result.data ? result.data.filter(item => item.quantity > 0) : [];
        setAvailableFood(instock);
      } catch (error) {
        console.error("Failed to load food:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, []);

  const handleToggle = (id) => {
    setSelectedItems((prev) => 
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id] 
    );
  };

  const handleBulkClaim = async () => {
    if (selectedItems.length === 0) return;

    try {
      const response = await fetch('/api/charity/bulk-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemIds: selectedItems, charityName: "BRACU Food Bank" })
      });

      if (response.ok) {
        alert(`Success! You claimed ${selectedItems.length} items.`);
        setAvailableFood((prev) => prev.filter(item => !selectedItems.includes(item._id)));
        setSelectedItems([]);
      } else {
        alert("Something went wrong with the bulk claim.");
      }
    } catch (error) {
      console.error("Bulk claim failed:", error);
    }
  };

  const totalUnitsSelected = availableFood
    .filter(item => selectedItems.includes(item._id))
    .reduce((sum, item) => sum + item.quantity, 0);

  const firstSelectedItem = availableFood.find(item => selectedItems.includes(item._id) && item.restaurantAddress);
  const destinationAddress = firstSelectedItem ? firstSelectedItem.restaurantAddress : null;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Charity Bulk Claim Portal</h1>
          <p className="text-gray-500 mt-2">Select surplus items you wish to rescue.</p>
        </div>

        {destinationAddress && <CharityRouteMap destinationAddress={destinationAddress} />}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Scanning for surplus food...</div>
          ) : (
            <>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100/50 text-gray-600 text-sm uppercase tracking-wider">
                    <th className="p-4 w-12 text-center">✓</th>
                    <th className="p-4 font-semibold">Item Name</th>
                    <th className="p-4 font-semibold">Restaurant</th>
                    <th className="p-4 font-semibold">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {availableFood.map((item) => (
                    <tr 
                      key={item._id} 
                      className={`transition-colors cursor-pointer hover:bg-gray-50 ${selectedItems.includes(item._id) ? 'bg-green-50/50' : ''}`}
                      onClick={() => handleToggle(item._id)}
                    >
                      <td className="p-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedItems.includes(item._id)}
                          readOnly 
                          className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-4 font-medium text-gray-900 capitalize">{item.name}</td>
                      <td className="p-4 text-gray-500 text-sm">
                        {item.restaurantName || "Unknown"} <br/>
                        <span className="text-xs text-gray-400">{item.restaurantAddress}</span>
                      </td>
                      <td className="p-4 text-gray-600">{item.quantity} units</td>
                    </tr>
                  ))}
                  {availableFood.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500">No surplus food available at the moment.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="bg-gray-100 p-4 border-t flex justify-between items-center">
                <span className="text-gray-600 font-medium">
                  Total Units to Rescue: <span className="text-gray-900 font-bold text-xl">{totalUnitsSelected}</span>
                </span>
                <button 
                  onClick={handleBulkClaim}
                  disabled={selectedItems.length === 0}
                  className={`px-6 py-3 rounded-md font-bold transition ${
                    selectedItems.length > 0 
                      ? 'bg-green-600 text-white hover:bg-green-700 shadow-md' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  CLAIM ITEMS
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}