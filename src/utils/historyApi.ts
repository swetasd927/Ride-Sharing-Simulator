import type { TripHistoryRecord } from './types';

const isCustomEndpoint = !!import.meta.env.VITE_API_ENDPOINT;
const API_ENDPOINT = (import.meta.env.VITE_API_ENDPOINT as string) || 'https://jsonplaceholder.typicode.com/posts';

export async function saveTripToHistory(
  record: Omit<TripHistoryRecord, 'id' | 'timestamp'>
): Promise<TripHistoryRecord> {
  const newRecord: TripHistoryRecord = {
    ...record,
    id: 'trip_' + Math.random().toString(36).substring(2, 11),
    timestamp: new Date().toISOString(),
  };

  // 1. Always persist in localStorage to guarantee functional local simulation
  const localHistory = getLocalHistory();
  localHistory.unshift(newRecord);
  localStorage.setItem('local_ride_history', JSON.stringify(localHistory));

  // 2. Fire the asynchronous REST POST to preserve the transaction log externally
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRecord),
    });
    
    if (response.ok) {
      console.log('Preserved transaction log in external mock REST API.');
    } else {
      console.warn(`REST API responded with status ${response.status}. Using localStorage fallback.`);
    }
  } catch (err) {
    console.warn(
      'REST API HTTP Request failed (likely due to CORS, rate limits, or network). Using localStorage fallback.',
      err
    );
  }

  return newRecord;
}

export async function fetchTripHistory(): Promise<TripHistoryRecord[]> {
  const local = getLocalHistory();

  // If the user hasn't configured a custom REST endpoint, load from local storage
  // to avoid fetching unrelated placeholder items or facing 404s on expired default mocks
  if (!isCustomEndpoint) {
    return local;
  }

  try {
    const response = await fetch(API_ENDPOINT);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        // Merge REST results and local storage logs to ensure maximum visibility
        const combined = [...data, ...local];
        const seen = new Set<string>();
        return combined.filter((item) => {
          if (!item.id || seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        });
      }
    }
  } catch (err) {
    console.warn('Could not fetch trip history from external REST API. Loading localStorage logs.', err);
  }

  return local;
}

function getLocalHistory(): TripHistoryRecord[] {
  const data = localStorage.getItem('local_ride_history');
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}
