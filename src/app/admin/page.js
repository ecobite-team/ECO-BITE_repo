"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // NEW: We need this to kick people out!

export default function AdminPanel() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  

  // --- 1. THE BOUNCER (SECURITY) ---
  useEffect(() => {
    // Check their ID badge!
    const savedUser = localStorage.getItem("ecoBiteUser");
    const user = savedUser ? JSON.parse(savedUser) : null;

    if (!user || user.role !== "admin") {
      alert("Access Denied: Admins Only.");
      router.push('/login'); // Kick them to the login page!
    }
  }, [router]);

  // --- 2. DATA FETCHING ---
  // --- 2. DATA FETCHING ---
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch('/api/admin/applications');
        const result = await response.json();
        
        // THE SAFETY NET: Prevents the .map() function from crashing the table
        setApplications(result.data || []); 
        
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const handleVerify = async (id, orgType, action) => {
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId: id, orgType, action }) 
      });

      if (response.ok) {
        setApplications((prev) => 
          prev.map((org) => 
            org._id === id ? { ...org, status: action === 'Approve' ? 'Approved' : 'Rejected' } : org
          )
        );
      }
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 border-b pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Platform Admin</h1>
            <p className="text-gray-500 mt-2">Manage partner verifications and access.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading registry...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100/50 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Organization Name</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Contact / Location</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((org) => {
                  const currentStatus = org.status || "Pending"; 

                  return (
                    <tr key={org._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{org.name}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          org.orgType === 'Restaurant' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {org.orgType}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 text-sm">{org.contact}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          currentStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                          currentStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {currentStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {currentStatus === "Pending" ? (
                          <>
                            <button 
                              onClick={() => handleVerify(org._id, org.orgType, 'Approve')}
                              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleVerify(org._id, org.orgType, 'Reject')}
                              className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 transition"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-sm text-gray-400 italic">Action Complete</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}