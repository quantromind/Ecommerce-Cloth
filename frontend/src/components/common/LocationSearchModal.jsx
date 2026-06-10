import React, { useEffect, useRef, useState } from 'react';
import { FaCrosshairs, FaTimes } from 'react-icons/fa';

const GOOGLE_MAPS_API_KEY = "AIzaSyBUfh9lqcFGgqNMC7FCyfvaEL8h9USr8vk";

const LocationSearchModal = ({ onClose, onDetectLocation, onLocationSelect }) => {
    const inputRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Ensure Google Maps Script is loaded
        const checkForMaps = () => {
            if (window.google && window.google.maps && window.google.maps.places) {
                setIsLoaded(true);
                return true;
            }
            return false;
        };

        if (!checkForMaps()) {
            // Check if script is already added to avoid duplicates
            const existingScript = document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`);
            if (existingScript) {
                existingScript.addEventListener('load', () => setIsLoaded(true));
            } else {
                const script = document.createElement("script");
                script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
                script.async = true;
                script.defer = true;
                script.onload = () => setIsLoaded(true);
                document.head.appendChild(script);
            }
        }
    }, []);

    useEffect(() => {
        if (isLoaded && inputRef.current) {
            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
                types: ['geocode'], // Favor addresses
            });

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (place.geometry && place.geometry.location) {
                    const lat = place.geometry.location.lat();
                    const lng = place.geometry.location.lng();

                    // Call parent handler
                    onLocationSelect(lat, lng);
                }
            });
        }
    }, [isLoaded, onLocationSelect]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white text-black w-full max-w-md rounded-xl shadow-2xl overflow-hidden relative">

                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-800">Change Location</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <FaTimes />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="flex flex-col md:flex-row items-center gap-4">

                        {/* Detect Button */}
                        <button
                            onClick={onDetectLocation}
                            className="w-full md:w-auto flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition transform active:scale-[0.98]"
                        >
                            <FaCrosshairs /> Detect my location
                        </button>

                        {/* OR Divider */}
                        <div className="flex items-center gap-2 w-full md:w-auto text-gray-400 font-medium text-xs uppercase">
                            <span className="h-[1px] bg-gray-200 flex-1 md:hidden"></span>
                            OR
                            <span className="h-[1px] bg-gray-200 flex-1 md:hidden"></span>
                        </div>

                        {/* Search Input */}
                        <div className="relative flex-1 w-full">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search delivery location"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LocationSearchModal;
