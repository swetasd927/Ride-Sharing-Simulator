import L from 'leaflet';

export const pickupIcon = L.divIcon({
  className: 'custom-pin-icon',
  html: `
    <div class="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse">
      <div class="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export const dropoffIcon = L.divIcon({
  className: 'custom-pin-icon',
  html: `
    <div class="flex items-center justify-center w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.4)]">
      <div class="w-4 h-4 rounded-full bg-rose-500 border-2 border-white"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export const driverIcon = L.divIcon({
  className: 'custom-pin-icon',
  html: `
    <div class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]">
      <div class="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white shadow-md">
        <!-- SVG for Car icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 12h14"/></svg>
      </div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});
