"use client";

import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '300px' };
const defaultCenter = { lat: 23.780, lng: 90.407 }; 

export default function CharityRouteMap({ destinationAddress }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  });

  const [directions, setDirections] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isLoaded || !destinationAddress) return;

    setDirections(null);
    setRouteInfo(null);
    setError(false);

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: "Kha 224, Bir Uttam Rafiqul Islam Ave, Dhaka 1212", // Default BRACU HQ
        destination: destinationAddress,
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
  }, [isLoaded, destinationAddress]);

  if (!isLoaded) return <div className="p-4 bg-gray-50 text-center rounded-xl text-sm mb-6">Loading Route Map...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h3 className="font-bold text-gray-800">📍 Live Pickup Route</h3>
        {routeInfo && (
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
            🚗 {routeInfo.duration} ({routeInfo.distance})
          </span>
        )}
      </div>
      
      {error ? (
        <div className="p-8 text-center text-gray-500">Could not calculate a valid driving route.</div>
      ) : (
        <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={12} options={{ disableDefaultUI: true }}>
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      )}
    </div>
  );
}