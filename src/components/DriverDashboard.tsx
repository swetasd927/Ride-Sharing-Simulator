import React from 'react';
import { useRide } from '../hooks/RideContext';
import { Power, Car, Star, Navigation, CheckCircle, AlertCircle, X, ChevronRight } from 'lucide-react';

export const DriverDashboard: React.FC = () => {
  const {
    trip,
    driverOnline,
    setDriverOnline,
    driverCoords,
    acceptRide,
    rejectRide,
    resetRide,
    arriveAtPickup,
    startTrip,
    completeTrip,
    cancelTrip,
  } = useRide();

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header and Toggle */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-100">Driver Dashboard</h2>
            <p className="text-xs text-slate-400">Manage dispatch & trip executions</p>
          </div>
        </div>

        {/* Online/Offline Toggle */}
        <button
          onClick={() => setDriverOnline(!driverOnline)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow ${
            driverOnline
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          {driverOnline ? 'Online' : 'Offline'}
        </button>
      </div>

      {/* Driver Info Card */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
            DN
          </div>
          <div>
            <div className="text-sm font-bold text-slate-200">driver_namlo</div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <span>Nexon EV Taxi</span>
              <span className="text-slate-600">•</span>
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="font-semibold text-slate-300">4.9</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            Current Location
          </div>
          <div className="text-xs font-mono text-blue-400">
            {driverCoords[0].toFixed(4)}, {driverCoords[1].toFixed(4)}
          </div>
        </div>
      </div>

      {/* Offline Alert Box */}
      {!driverOnline && (
        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl p-6 text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
            <Power className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-300">You are Offline</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-[200px] mx-auto">
              Toggle your status to Online to begin receiving ride requests in Kathmandu.
            </p>
          </div>
        </div>
      )}

      {/* Online, Idle State */}
      {driverOnline && (!trip || trip.status === 'IDLE') && (
        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl p-6 text-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-300">Waiting for requests...</h3>
            <p className="text-xs text-slate-500 mt-1">
              Open the Rider panel in split-screen or a side tab to request a trip.
            </p>
          </div>
        </div>
      )}

      {/* Incoming Request Alert (Pulsing overlay/panel) */}
      {driverOnline && trip && trip.status === 'REQUESTING' && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 animate-pulse flex flex-col gap-4 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertCircle className="w-4 h-4" />
            Incoming Ride Request!
          </div>

          <div className="flex flex-col gap-2.5 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
              <div>
                <div className="font-semibold text-slate-400">Pickup:</div>
                <div className="font-medium text-slate-200">{trip.pickup?.address}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0"></span>
              <div>
                <div className="font-semibold text-slate-400">Dropoff:</div>
                <div className="font-medium text-slate-200">{trip.dropoff?.address}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs py-2 border-t border-slate-800 text-slate-400">
            <span>Est. Fare: <strong className="text-amber-400 font-bold text-sm">NPR {trip.price}</strong></span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={rejectRide}
              className="flex-1 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Decline
            </button>
            <button
              onClick={() => acceptRide('driver_namlo')}
              className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-[0_0_10px_rgba(37,99,235,0.2)] flex items-center justify-center gap-1"
            >
              <Navigation className="w-3.5 h-3.5" />
              Accept
            </button>
          </div>
        </div>
      )}

      {/* Active Trip Driver Actions */}
      {driverOnline && trip && trip.status !== 'IDLE' && trip.status !== 'REQUESTING' && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Job Details
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Rider ID: {trip.riderId.substring(6)}
            </span>
          </div>

          <div className="flex flex-col gap-2.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="truncate text-slate-300">From: {trip.pickup?.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span className="truncate text-slate-300">To: {trip.dropoff?.address}</span>
            </div>
          </div>

          {/* Action Step-by-Step Buttons */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
            {trip.status === 'ACCEPTED' && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={arriveAtPickup}
                  className="w-full py-2.5 rounded-lg font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Arrived at Pickup Location
                </button>
                <p className="text-[10px] text-center text-slate-500">
                  Or use the Simulator panel to automatically drive to pickup!
                </p>
              </div>
            )}

            {trip.status === 'ARRIVED' && (
              <button
                onClick={startTrip}
                className="w-full py-2.5 rounded-lg font-bold text-sm bg-purple-600 hover:bg-purple-500 text-white transition-colors flex items-center justify-center gap-2"
              >
                <ChevronRight className="w-4 h-4" />
                Start Ride (Rider Onboard)
              </button>
            )}

            {trip.status === 'IN_PROGRESS' && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={completeTrip}
                  className="w-full py-2.5 rounded-lg font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete Trip (Collect NPR {trip.price})
                </button>
                <p className="text-[10px] text-center text-slate-500">
                  Or use the Simulator panel to automatically drive to destination!
                </p>
              </div>
            )}

            {(trip.status === 'COMPLETED' || trip.status === 'CANCELLED' || trip.status === 'REJECTED') && (
              <div className="flex flex-col gap-2">
                <div className="text-center py-2 text-xs">
                  <span className="text-slate-400">Trip has been resolved (State: </span>
                  <strong className={trip.status === 'COMPLETED' ? 'text-emerald-400' : 'text-rose-400'}>
                    {trip.status}
                  </strong>
                  <span className="text-slate-400">)</span>
                </div>
                <button
                  onClick={resetRide}
                  className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  Clear Simulation State
                </button>
              </div>
            )}

            {/* Cancel job button */}
            {trip.status !== 'COMPLETED' && trip.status !== 'CANCELLED' && trip.status !== 'REJECTED' && (
              <button
                onClick={cancelTrip}
                className="w-full mt-2 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20 transition-colors"
              >
                Cancel / Reject Job
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
