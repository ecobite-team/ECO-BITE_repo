// MEMBER 2'S FEATURE: Quick Analytics Calculations
const totalItems = inventory.length;
const totalMealsSaved = inventory.reduce((total, item) => total + item.quantity, 0);
const potentialRevenue = inventory.reduce((total, item) => total + (item.discountedPrice * item.quantity), 0);

{/* MEMBER 2'S FEATURE: Impact Analytics Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
    <p className="text-gray-500 text-sm font-medium">Active Listings</p>
    <p className="text-3xl font-bold text-gray-800">{totalItems}</p>
  </div>
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 border-l-4 border-l-green-500">
    <p className="text-gray-500 text-sm font-medium">Potential Revenue</p>
    <p className="text-3xl font-bold text-gray-800">${potentialRevenue}</p>
  </div>
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 border-l-4 border-l-emerald-500">
    <p className="text-gray-500 text-sm font-medium">Est. Meals Saved</p>
    <p className="text-3xl font-bold text-gray-800">{totalMealsSaved}</p>
  </div>
</div>
