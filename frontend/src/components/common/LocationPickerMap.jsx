import React, { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const GOOGLE_MAPS_API_KEY = "AIzaSyBUfh9lqcFGgqNMC7FCyfvaEL8h9USr8vk";

const LocationPickerMap = ({ initialLat, initialLng, onLocationChange }) => {
    const mapRef = useRef(null);
    const googleMapRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Ensure Google Maps Script is loaded
        const checkForMaps = () => {
            // Check for places library specifically since we use Autocomplete
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
        if (isLoaded && mapRef.current && !googleMapRef.current) {
            // Initialize Map
            const defaultPos = { lat: initialLat || 37.7749, lng: initialLng || -122.4194 };

            googleMapRef.current = new window.google.maps.Map(mapRef.current, {
                center: defaultPos,
                zoom: 15,
                disableDefaultUI: true, // Clean look
                zoomControl: true,
                styles: [ // Dark Mode Style
                    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                    {
                        featureType: "administrative.locality",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#d59563" }],
                    },
                    {
                        featureType: "poi",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#d59563" }],
                    },
                    {
                        featureType: "poi.park",
                        elementType: "geometry",
                        stylers: [{ color: "#263c3f" }],
                    },
                    {
                        featureType: "poi.park",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#6b9a76" }],
                    },
                    {
                        featureType: "road",
                        elementType: "geometry",
                        stylers: [{ color: "#38414e" }],
                    },
                    {
                        featureType: "road",
                        elementType: "geometry.stroke",
                        stylers: [{ color: "#212a37" }],
                    },
                    {
                        featureType: "road",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#9ca5b3" }],
                    },
                    {
                        featureType: "road.highway",
                        elementType: "geometry",
                        stylers: [{ color: "#746855" }],
                    },
                    {
                        featureType: "road.highway",
                        elementType: "geometry.stroke",
                        stylers: [{ color: "#1f2835" }],
                    },
                    {
                        featureType: "road.highway",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#f3d19c" }],
                    },
                    {
                        featureType: "water",
                        elementType: "geometry",
                        stylers: [{ color: "#17263c" }],
                    },
                    {
                        featureType: "water",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#515c6d" }],
                    },
                    {
                        featureType: "water",
                        elementType: "labels.text.stroke",
                        stylers: [{ color: "#17263c" }],
                    },
                ],
            });

            // Listen for idle event (when panning stops)
            googleMapRef.current.addListener("idle", () => {
                const center = googleMapRef.current.getCenter();
                const lat = center.lat();
                const lng = center.lng();
                if (onLocationChange) {
                    onLocationChange(lat, lng);
                }
            });
        }
    }, [isLoaded, initialLat, initialLng, onLocationChange]);

    return (
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-border-light">
            {!isLoaded && (
                <div className="absolute inset-0 bg-secondary flex items-center justify-center text-text-muted">
                    Loading Map...
                </div>
            )}

            <div ref={mapRef} className="w-full h-full" />

            {/* Fixed Center Pin (Uber Style) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-4 pointer-events-none z-10 flex flex-col items-center">
                <FaMapMarkerAlt className="text-4xl text-red-500 drop-shadow-lg" />
                <div className="w-2 h-2 bg-primary/50 rounded-full mt-1 blur-[1px]"></div>
            </div>

            {/* Helper Text */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary/80 backdrop-blur text-text-main px-3 py-1 rounded-full text-xs font-bold shadow-lg pointer-events-none z-10 whitespace-nowrap">
                Move map to refine location
            </div>
        </div>
    );
};

export default LocationPickerMap;
