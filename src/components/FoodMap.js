"use client";

import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '400px' };

// Defaulting to BRAC University (Badda)
const defaultCenter = { lat: 23.780, lng: 90.407 }; 
const bracuAddress = "Kha 224, Bir Uttam Rafiqul Islam Ave, Dhaka 1212";

export default function FoodMap({ foods }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  });

  const [selectedAddress, setSelectedAddress] = useState("");
  const [directions, setDirections] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [error, setError] = useState(false);

  // 1. Extract unique restaurant locations from the active food listings
  const uniqueLocations = [];
  const seenAddresses = new Set();
  
  // Safety check: Ensure foods exists before looping
  if (foods && foods.length > 0) {
    foods.forEach(item => {
      if (item.restaurantAddress && !seenAddresses.has(item.restaurantAddress)) {
        seenAddresses.add(item.restaurantAddress);
        uniqueLocations.push({ name: item.restaurantName, address: item.restaurantAddress });
      }
    });
  }

  // 2. The Routing Engine
  useEffect(() => {
    if (!isLoaded || !selectedAddress) return;

    setDirections(null);
    setRouteInfo(null);
    setError(false);

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: bracuAddress,
        destination: selectedAddress,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          setRouteInfo({
            distance: result.routes[0].legs[0].distance.text,
            duration: result.routes[0].legs[0].duration.text,
          });
        } else {
          console.error("Directions request failed");
          setError(true);
        }
      }
    );
  }, [isLoaded, selectedAddress]);

  if (!isLoaded) return <div className="p-4 bg-gray-50 text-center rounded-xl border mb-8">Loading Google Maps...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      {/* Map Controls & Info Bar */}
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 whitespace-nowrap">
          📍 Find Nearest Food
        </h3>
        
        <select 
          value={selectedAddress} 
          onChange={(e) => setSelectedAddress(e.target.value)}
          className="p-2 border border-gray-300 rounded-md text-sm w-full focus:ring-green-500 focus:border-green-500 text-gray-800"
        >
          <option value="">Select a restaurant to see your route...</option>
          {uniqueLocations.map((loc, idx) => (
            <option key={idx} value={loc.address}>
              {loc.name} ({loc.address})
            </option>
          ))}
        </select>

        {routeInfo && (
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-2 rounded-full border border-blue-200 whitespace-nowrap">
            🚗 {routeInfo.duration} ({routeInfo.distance})
          </span>
        )}
      </div>
      
      {/* The Map Canvas */}
      {error ? (
        <div className="p-12 text-center text-gray-500 bg-gray-50">
          <p className="font-medium text-lg">Route Calculation Failed</p>
          <p className="text-sm mt-2">Could not find a valid driving route to this address from campus.</p>
        </div>
      ) : (
        <GoogleMap 
          mapContainerStyle={containerStyle} 
          center={defaultCenter} 
          zoom={selectedAddress ? 14 : 12} 
          options={{ disableDefaultUI: true, gestureHandling: 'cooperative' }}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      )}
    </div>
  );
}