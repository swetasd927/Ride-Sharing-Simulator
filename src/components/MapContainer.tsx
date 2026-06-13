import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRide } from '../hooks/RideContext';
import { pickupIcon, dropoffIcon, driverIcon } from '../utils/mapIcons';

export const MapContainer: React.FC = () => {
  const { driverCoords, trip } = useRide();
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);
  const pickupMarkerRef = useRef<L.Marker | null>(null);
  const dropoffMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  // 1. Initialize Map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Centered on Kathmandu coordinates
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false, // Custom position Zoom control later or hide for premium clean look
      }).setView([27.7172, 85.3240], 13);

      // Dark Mode Tile Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(mapRef.current);

      // Add Zoom control at bottom right instead of top left
      L.control.zoom({
        position: 'bottomright'
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 2. Synchronize Leaflet layers with application telemetry state
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // A. Driver coordinates mapping
    if (driverCoords) {
      if (!driverMarkerRef.current) {
        driverMarkerRef.current = L.marker(driverCoords, { icon: driverIcon }).addTo(map);
      } else {
        driverMarkerRef.current.setLatLng(driverCoords);
      }
    }

    // B. Pickup point marker mapping
    if (trip && trip.pickup && (trip.status === 'REQUESTING' || trip.status === 'ACCEPTED' || trip.status === 'ARRIVED' || trip.status === 'IN_PROGRESS')) {
      const pos: [number, number] = [trip.pickup.lat, trip.pickup.lng];
      if (!pickupMarkerRef.current) {
        pickupMarkerRef.current = L.marker(pos, { icon: pickupIcon }).addTo(map);
      } else {
        pickupMarkerRef.current.setLatLng(pos);
      }
    } else {
      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.remove();
        pickupMarkerRef.current = null;
      }
    }

    // C. Dropoff point marker mapping
    if (trip && trip.dropoff && (trip.status === 'REQUESTING' || trip.status === 'ACCEPTED' || trip.status === 'ARRIVED' || trip.status === 'IN_PROGRESS')) {
      const pos: [number, number] = [trip.dropoff.lat, trip.dropoff.lng];
      if (!dropoffMarkerRef.current) {
        dropoffMarkerRef.current = L.marker(pos, { icon: dropoffIcon }).addTo(map);
      } else {
        dropoffMarkerRef.current.setLatLng(pos);
      }
    } else {
      if (dropoffMarkerRef.current) {
        dropoffMarkerRef.current.remove();
        dropoffMarkerRef.current = null;
      }
    }

    // D. Path polyline mapping
    if (trip && trip.route && trip.route.length > 0 && (trip.status === 'ACCEPTED' || trip.status === 'IN_PROGRESS')) {
      if (!routePolylineRef.current) {
        routePolylineRef.current = L.polyline(trip.route, {
          color: '#3b82f6',
          weight: 4,
          opacity: 0.75,
          lineJoin: 'round',
        }).addTo(map);
      } else {
        routePolylineRef.current.setLatLngs(trip.route);
      }
    } else {
      if (routePolylineRef.current) {
        routePolylineRef.current.remove();
        routePolylineRef.current = null;
      }
    }
  }, [driverCoords, trip]);

  // 3. Autocenter and fit viewport bounds based on markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !trip) return;

    const coordsToBound: L.LatLngExpression[] = [driverCoords];
    
    if (trip.pickup && (trip.status === 'REQUESTING' || trip.status === 'ACCEPTED' || trip.status === 'ARRIVED')) {
      coordsToBound.push([trip.pickup.lat, trip.pickup.lng]);
    }
    if (trip.dropoff && (trip.status === 'REQUESTING' || trip.status === 'ACCEPTED' || trip.status === 'ARRIVED' || trip.status === 'IN_PROGRESS')) {
      coordsToBound.push([trip.dropoff.lat, trip.dropoff.lng]);
    }

    if (coordsToBound.length > 1) {
      const bounds = L.latLngBounds(coordsToBound);
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 15,
        animate: true,
        duration: 1.2,
      });
    }
  }, [trip?.tripId, trip?.status]);

  // 4. Automatically invalidate size on container width/height shift
  useEffect(() => {
    const map = mapRef.current;
    const container = mapContainerRef.current;
    if (!map || !container) return;

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl shadow-inner border border-slate-800 bg-slate-900">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Floating GPS/Kathmandu Location Badge */}
      <div className="absolute top-4 left-4 z-[500] px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide bg-slate-900/90 text-slate-300 border border-slate-700/80 shadow-md backdrop-blur-md flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        Kathmandu GPS Active
      </div>
    </div>
  );
};
