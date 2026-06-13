export interface PresetLocation {
  name: string;
  lat: number;
  lng: number;
}

export const KATHMANDU_PRESETS: PresetLocation[] = [
  { name: 'Thamel', lat: 27.7150, lng: 85.3120 },
  { name: 'Durbar Marg', lat: 27.7100, lng: 85.3180 },
  { name: 'Patan Durbar Square', lat: 27.6730, lng: 85.3250 },
  { name: 'Boudhanath Stupa', lat: 27.7215, lng: 85.3620 },
  { name: 'Tribhuvan International Airport', lat: 27.6980, lng: 85.3590 },
  { name: 'Swayambhunath (Monkey Temple)', lat: 27.7150, lng: 85.2900 },
  { name: 'Balaju Water Garden', lat: 27.7310, lng: 85.3010 },
  { name: 'Koteshwor', lat: 27.6790, lng: 85.3490 }
];

export function generateRoute(start: [number, number], end: [number, number]): [number, number][] {
  const steps = 25;
  const route: [number, number][] = [];
  
  for (let i = 0; i <= steps; i++) {
    const ratio = i / steps;
    const lat = start[0] + (end[0] - start[0]) * ratio;
    const lng = start[1] + (end[1] - start[1]) * ratio;
    
    // Add small grid-like offsets to mimic city street turns
    if (i > 0 && i < steps) {
      const isEven = i % 2 === 0;
      const deviation = 0.0008 * Math.sin(ratio * Math.PI);
      if (isEven) {
        route.push([lat + deviation, lng]);
      } else {
        route.push([lat, lng + deviation]);
      }
    } else {
      route.push([lat, lng]);
    }
  }
  
  return route;
}

// Estimate price based on distance
export function estimatePrice(start: [number, number], end: [number, number]): number {
  const dx = (start[0] - end[0]) * 111; // 1 degree lat ~ 111km
  const dy = (start[1] - end[1]) * 111 * Math.cos(start[0] * Math.PI / 180);
  const distanceKm = Math.sqrt(dx * dx + dy * dy);
  
  // Base rate 80 NPR + 25 NPR per km
  const baseRate = 80;
  const ratePerKm = 25;
  const total = baseRate + distanceKm * ratePerKm;
  return Math.round(total);
}
