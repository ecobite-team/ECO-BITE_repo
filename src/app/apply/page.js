"use client";

import { useState } from "react";
import Link from "next/link";

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    type: "restaurant", // Defaults to restaurant
    name: "",
    contactInfo: "", 
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Application failed. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md text-center border-t-4 border-green-600">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Received!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for applying to join Eco-Bite. Our admins will review your request shortly. 
            Once approved, you will gain access to your dashboard.
          </p>
          <Link href="/" className="bg-gray-100 text-gray-800 px-6 py-2 rounded-md font-bold hover:bg-gray-200 transition">
            Return to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border-t-4 border-green-600">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Partner with Eco-Bite</h1>
        <p className="text-gray-500 mb-6 text-sm">Join our mission to reduce food waste.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Dropdown to select type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">I am a...</label>
            <select 
              className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value, contactInfo: "" })}
            >
              <option value="restaurant">Restaurant / Cafe / Grocery</option>
              <option value="charity">Registered Charity / Food Bank</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Organization Name</label>
            <input 
              type="text" 
              required
              placeholder={formData.type === 'restaurant' ? "e.g., Downtown Bakery" : "e.g., City Food Rescue"}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:ring-green-500 focus:border-green-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {formData.type === 'restaurant' ? "Physical Address" : "Contact Email"}
            </label>
            <input 
              type={formData.type === 'restaurant' ? "text" : "email"} 
              required
              placeholder={formData.type === 'restaurant' ? "123 Main St..." : "contact@charity.org"}
              value={formData.contactInfo}
              onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
              className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:ring-green-500 focus:border-green-500 text-gray-900"
            />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-md hover:bg-green-700 transition mt-6">
            Submit Application
          </button>
        </form>
      </div>
    </main>
  );
}