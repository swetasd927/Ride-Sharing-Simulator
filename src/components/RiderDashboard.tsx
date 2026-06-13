import React, { useState } from 'react';
import { useRide } from '../hooks/RideContext';
import { KATHMANDU_PRESETS, type PresetLocation } from '../utils/mockRouting';

import { MapPin, Coins, Navigation, Compass, History, X, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

export const RiderDashboard: React.FC = () => {
  const {
    trip,
    requestRide,
    cancelTrip,
    history,
    isLoadingHistory,
    refreshHistory,
  } = useRide();

  const [pickupPreset, setPickupPreset] = useState<string>('Thamel');
  const [dropoffPreset, setDropoffPreset] = useState<string>('Tribhuvan International Airport');

  const getPresetCoords = (name: string): PresetLocation => {
    return KATHMANDU_PRESETS.find((p) => p.name === name) || KATHMANDU_PRESETS[0];
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const pickup = getPresetCoords(pickupPreset);
    const dropoff = getPresetCoords(dropoffPreset);

    requestRide(
      { lat: pickup.lat, lng: pickup.lng, address: pickup.name },
      { lat: dropoff.lat, lng: dropoff.lng, address: dropoff.name }
    );
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Title block */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-100">Rider Dashboard</h2>
          <p className="text-xs text-slate-400">Request rides and track travel logs</p>
        </div>
      </div>

      {/* Booking Form (Only show when idle or terminal status) */}
      {(!trip || trip.status === 'IDLE') && (
        <form onSubmit={handleBooking} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Pickup Location (Kathmandu)
            </label>
            <select
              value={pickupPreset}
              onChange={(e) => setPickupPreset(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-200 transition-colors"
            >
              {KATHMANDU_PRESETS.map((preset) => (
                <option key={`pickup-${preset.name}`} value={preset.name} disabled={preset.name === dropoffPreset}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              Dropoff Location (Kathmandu)
            </label>
            <select
              value={dropoffPreset}
              onChange={(e) => setDropoffPreset(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:border-rose-500 text-slate-200 transition-colors"
            >
              {KATHMANDU_PRESETS.map((preset) => (
                <option key={`dropoff-${preset.name}`} value={preset.name} disabled={preset.name === pickupPreset}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 rounded-lg font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            Request Ride Now
          </button>
        </form>
      )}

      {/* Active Trip States */}
      {trip && trip.status !== 'IDLE' && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Trip Status
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                trip.status === 'REQUESTING'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : trip.status === 'ACCEPTED'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : trip.status === 'ARRIVED'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : trip.status === 'IN_PROGRESS'
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {trip.status}
            </span>
          </div>

          {/* Status Message Text */}
          <div className="flex items-start gap-3">
            {trip.status === 'REQUESTING' && (
              <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center gap-2 text-sm text-amber-400 font-semibold">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  Finding a Driver...
                </div>
                <p className="text-xs text-slate-400">
                  Broadcasting your request to drivers near {trip.pickup?.address}.
                </p>
              </div>
            )}

            {trip.status === 'ACCEPTED' && (
              <div className="flex flex-col gap-1 w-full">
                <div className="text-sm text-blue-400 font-semibold flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 animate-pulse" />
                  Driver Accepted!
                </div>
                <p className="text-xs text-slate-400">
                  Driver <code className="text-blue-300 font-mono">{trip.driverId}</code> is heading to {trip.pickup?.address}.
                </p>
              </div>
            )}

            {trip.status === 'ARRIVED' && (
              <div className="flex flex-col gap-1 w-full">
                <div className="text-sm text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 animate-bounce" />
                  Driver Arrived!
                </div>
                <p className="text-xs text-slate-400">
                  Your driver has arrived at {trip.pickup?.address} and is waiting for you.
                </p>
              </div>
            )}

            {trip.status === 'IN_PROGRESS' && (
              <div className="flex flex-col gap-1 w-full">
                <div className="text-sm text-purple-400 font-semibold flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  On Trip to Destination
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Currently transit to {trip.dropoff?.address}.
                </p>
              </div>
            )}

            {(trip.status === 'COMPLETED' || trip.status === 'CANCELLED') && (
              <div className="flex flex-col gap-1 w-full">
                <div
                  className={`text-sm font-semibold flex items-center gap-1.5 ${
                    trip.status === 'COMPLETED' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {trip.status === 'COMPLETED' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  Ride {trip.status === 'COMPLETED' ? 'Finished' : 'Cancelled'}
                </div>
                <p className="text-xs text-slate-400">
                  {trip.status === 'COMPLETED'
                    ? `Thank you for riding! Trip cost NPR ${trip.price}.`
                    : 'This ride request was cancelled.'}
                </p>
              </div>
            )}
          </div>

          {/* Details Row */}
          <div className="flex items-center justify-between text-xs py-2 border-t border-b border-slate-800 text-slate-400">
            <span className="flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-slate-500" />
              Est. Fare: <strong className="text-slate-300">NPR {trip.price}</strong>
            </span>
            <span>
              Route steps: <strong className="text-slate-300">{trip.route.length}</strong>
            </span>
          </div>

          {/* Cancel button */}
          {(trip.status === 'REQUESTING' ||
            trip.status === 'ACCEPTED' ||
            trip.status === 'ARRIVED') && (
            <button
              onClick={cancelTrip}
              className="w-full py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              Cancel Trip Request
            </button>
          )}
        </div>
      )}

      {/* History logs panel */}
      <div className="flex-1 flex flex-col gap-2 min-h-0 mt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-slate-500" />
            Ride History (REST API Registry)
          </h3>
          <button
            onClick={refreshHistory}
            className="text-[10px] text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${isLoadingHistory ? 'animate-spin' : ''}`} />
            Sync
          </button>
        </div>

        {/* List of records */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 min-h-[140px]">
          {history.length === 0 ? (
            <div className="h-full flex items-center justify-center border border-dashed border-slate-800 rounded-xl p-6 text-center text-xs text-slate-600">
              No recorded rides yet
            </div>
          ) : (
            history.map((record) => (
              <div
                key={record.id}
                className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs flex flex-col gap-1.5 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between font-medium">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                      record.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {record.status}
                  </span>
                  <span className="text-slate-500 font-mono text-[9px]">
                    {new Date(record.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5 text-slate-300">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="truncate">{record.pickupAddress}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    <span className="truncate">{record.dropoffAddress}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-800/60 text-[10px]">
                  <span>Fare: <strong className="text-slate-300">NPR {record.price}</strong></span>
                  <span>ID: <code className="text-slate-400 font-mono">{record.id.substring(5)}</code></span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
