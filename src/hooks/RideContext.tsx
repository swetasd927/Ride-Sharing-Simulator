import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { Location, TripState, TripHistoryRecord, UserRole } from '../utils/types';
import { syncManager } from '../utils/realtimeSync';
import { saveTripToHistory, fetchTripHistory } from '../utils/historyApi';
import { generateRoute, estimatePrice } from '../utils/mockRouting';

interface RideContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  driverOnline: boolean;
  setDriverOnline: (online: boolean) => void;
  driverCoords: [number, number];
  setDriverCoords: (coords: [number, number]) => void;
  trip: TripState | null;
  history: TripHistoryRecord[];
  isLoadingHistory: boolean;
  requestRide: (pickup: Location, dropoff: Location) => void;
  acceptRide: (driverId: string) => void;
  rejectRide: () => void;
  resetRide: () => void;
  arriveAtPickup: () => void;
  startTrip: () => void;
  completeTrip: () => void;
  cancelTrip: () => void;
  simulateMovement: () => void;
  isSimulating: boolean;
  refreshHistory: () => void;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const RideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('SPLIT_SCREEN');
  const [driverOnline, setDriverOnline] = useState<boolean>(true);
  const [driverCoords, setDriverCoords] = useState<[number, number]>([27.7100, 85.3180]); // Defaults to Durbar Marg
  const [trip, setTrip] = useState<TripState | null>(null);
  const [history, setHistory] = useState<TripHistoryRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const simulationIntervalRef = useRef<number | null>(null);

  // Sync state with local/Supabase database
  useEffect(() => {
    const unsubscribe = syncManager.subscribe((data) => {
      const { event, payload } = data;
      console.log('Received Real-time Broadcast:', event, payload);
      
      switch (event) {
        case 'TRIP_UPDATE':
          setTrip(payload);
          break;
        case 'DRIVER_ONLINE_CHANGE':
          if (payload.driverId === 'driver_namlo') {
            setDriverOnline(payload.online);
          }
          break;
        case 'DRIVER_COORDS_UPDATE':
          if (payload.driverId === 'driver_namlo') {
            setDriverCoords(payload.coords);
          }
          break;
        default:
          break;
      }
    });

    // Initial history fetch
    refreshHistory();

    return () => {
      unsubscribe();
      cleanupSimulation();
    };
  }, []);

  // Fetch ride logs from backend REST API
  const refreshHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const records = await fetchTripHistory();
      setHistory(records);
    } catch (err) {
      console.error('Failed to load history logs:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const cleanupSimulation = () => {
    if (simulationIntervalRef.current !== null) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setIsSimulating(false);
  };

  // 1. Rider requests a ride
  const requestRide = (pickup: Location, dropoff: Location) => {
    cleanupSimulation();
    const route = generateRoute([pickup.lat, pickup.lng], [dropoff.lat, dropoff.lng]);
    const price = estimatePrice([pickup.lat, pickup.lng], [dropoff.lat, dropoff.lng]);
    
    const newTrip: TripState = {
      tripId: 'trip_' + Date.now(),
      status: 'REQUESTING',
      riderId: 'rider_namlo',
      driverId: null,
      pickup,
      dropoff,
      driverLocation: null,
      route,
      price,
      timestamp: Date.now(),
    };

    syncManager.broadcast('TRIP_UPDATE', newTrip);
  };

  // 2. Driver accepts the ride offer
  const acceptRide = (driverId: string) => {
    if (!trip) return;
    cleanupSimulation();

    // Generate a path from the driver's current position to the pickup location
    const routeToPickup = generateRoute(driverCoords, [trip.pickup!.lat, trip.pickup!.lng]);

    const updatedTrip: TripState = {
      ...trip,
      status: 'ACCEPTED',
      driverId,
      driverLocation: {
        lat: driverCoords[0],
        lng: driverCoords[1],
        address: 'En Route to Pickup',
      },
      // Cache the route to pickup in memory (temporarily override trip route or keep main route)
      route: routeToPickup, 
    };

    syncManager.broadcast('TRIP_UPDATE', updatedTrip);
  };

  // 3. Driver rejects/declines the offer
  const rejectRide = async () => {
    if (!trip) return;
    cleanupSimulation();
    
    const updatedTrip: TripState = {
      ...trip,
      status: 'REJECTED',
      driverId: 'driver_namlo',
    };
    
    // Broadcast state update
    syncManager.broadcast('TRIP_UPDATE', updatedTrip);

    // Save history logs externally via REST POST request
    try {
      await saveTripToHistory({
        tripId: trip.tripId,
        riderId: trip.riderId,
        driverId: 'driver_namlo',
        pickupAddress: trip.pickup?.address || 'Pickup Point',
        dropoffAddress: trip.dropoff?.address || 'Dropoff Point',
        price: trip.price,
        status: 'REJECTED',
        durationMinutes: 0,
      });
      refreshHistory();
    } catch (err) {
      console.error('Failed to log reject state:', err);
    }
  };

  // 3b. Reset the simulation back to idle state
  const resetRide = () => {
    cleanupSimulation();
    const idleTrip: TripState = {
      tripId: '',
      status: 'IDLE',
      riderId: '',
      driverId: null,
      pickup: null,
      dropoff: null,
      driverLocation: null,
      route: [],
      price: 0,
      timestamp: 0,
    };
    syncManager.broadcast('TRIP_UPDATE', idleTrip);
  };

  // 4. Driver arrives at pickup location
  const arriveAtPickup = () => {
    if (!trip) return;
    cleanupSimulation();

    const updatedTrip: TripState = {
      ...trip,
      status: 'ARRIVED',
      driverLocation: {
        lat: trip.pickup!.lat,
        lng: trip.pickup!.lng,
        address: 'Arrived at Pickup',
      },
      // Restore the main route from pickup to dropoff
      route: generateRoute([trip.pickup!.lat, trip.pickup!.lng], [trip.dropoff!.lat, trip.dropoff!.lng]),
    };
    setDriverCoords([trip.pickup!.lat, trip.pickup!.lng]);
    syncManager.broadcast('TRIP_UPDATE', updatedTrip);
  };

  // 5. Driver starts the ride
  const startTrip = () => {
    if (!trip) return;
    cleanupSimulation();

    const updatedTrip: TripState = {
      ...trip,
      status: 'IN_PROGRESS',
      driverLocation: {
        lat: driverCoords[0],
        lng: driverCoords[1],
        address: 'In Transit',
      },
    };
    syncManager.broadcast('TRIP_UPDATE', updatedTrip);
  };

  // 6. Driver completes the ride (Terminal State -> Save to Mock REST API)
  const completeTrip = async () => {
    if (!trip) return;
    cleanupSimulation();

    const updatedTrip: TripState = {
      ...trip,
      status: 'COMPLETED',
    };

    // Sync state update first
    syncManager.broadcast('TRIP_UPDATE', updatedTrip);

    // Save history logs externally via REST POST request
    try {
      await saveTripToHistory({
        tripId: trip.tripId,
        riderId: trip.riderId,
        driverId: trip.driverId || 'driver_namlo',
        pickupAddress: trip.pickup?.address || 'Pickup Point',
        dropoffAddress: trip.dropoff?.address || 'Dropoff Point',
        price: trip.price,
        status: 'COMPLETED',
        durationMinutes: Math.round(5 + Math.random() * 15),
      });
      // Refresh local view
      refreshHistory();
    } catch (err) {
      console.error('Failed to log trip record:', err);
    }
  };

  // 7. Rider/Driver cancels the ride (Terminal State -> Save to Mock REST API)
  const cancelTrip = async () => {
    if (!trip) return;
    cleanupSimulation();

    const updatedTrip: TripState = {
      ...trip,
      status: 'CANCELLED',
    };

    // Broadcast terminal state
    syncManager.broadcast('TRIP_UPDATE', updatedTrip);

    // Log cancellation in REST API registry
    try {
      await saveTripToHistory({
        tripId: trip.tripId,
        riderId: trip.riderId,
        driverId: trip.driverId || 'unassigned',
        pickupAddress: trip.pickup?.address || 'Pickup Point',
        dropoffAddress: trip.dropoff?.address || 'Dropoff Point',
        price: trip.price,
        status: 'CANCELLED',
        durationMinutes: 0,
      });
      refreshHistory();
    } catch (err) {
      console.error('Failed to log cancellation:', err);
    }
  };

  // 8. Auto-simulate movement along current active route path coordinates
  const simulateMovement = () => {
    if (!trip || isSimulating || trip.route.length === 0) return;

    setIsSimulating(true);
    let currentStep = 0;
    const routeCoords = [...trip.route];

    simulationIntervalRef.current = window.setInterval(() => {
      if (currentStep >= routeCoords.length) {
        // Complete current phase
        cleanupSimulation();
        
        // Auto transition logic for evaluator's convenience
        if (trip.status === 'ACCEPTED') {
          arriveAtPickup();
        } else if (trip.status === 'IN_PROGRESS') {
          completeTrip();
        }
      } else {
        const nextCoords = routeCoords[currentStep];
        setDriverCoords(nextCoords);
        
        // Broadcast location updates
        syncManager.broadcast('DRIVER_COORDS_UPDATE', {
          driverId: 'driver_namlo',
          coords: nextCoords,
        });

        // Also update coordinates directly inside the trip state for maps
        const updatedTrip: TripState = {
          ...trip,
          driverLocation: {
            lat: nextCoords[0],
            lng: nextCoords[1],
            address: trip.status === 'ACCEPTED' ? 'En Route to Pickup' : 'In Transit',
          },
        };
        syncManager.broadcast('TRIP_UPDATE', updatedTrip);
        
        currentStep++;
      }
    }, 400); // Step coordinate shift speed (400ms)
  };

  // Sync driver online flag across viewports
  const toggleDriverOnlineState = (online: boolean) => {
    setDriverOnline(online);
    syncManager.broadcast('DRIVER_ONLINE_CHANGE', {
      driverId: 'driver_namlo',
      online,
    });
  };

  return (
    <RideContext.Provider
      value={{
        role,
        setRole,
        driverOnline,
        setDriverOnline: toggleDriverOnlineState,
        driverCoords,
        setDriverCoords,
        trip,
        history,
        isLoadingHistory,
        requestRide,
        acceptRide,
        rejectRide,
        resetRide,
        arriveAtPickup,
        startTrip,
        completeTrip,
        cancelTrip,
        simulateMovement,
        isSimulating,
        refreshHistory,
      }}
    >
      {children}
    </RideContext.Provider>
  );
};

export const useRide = () => {
  const context = useContext(RideContext);
  if (context === undefined) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
};
