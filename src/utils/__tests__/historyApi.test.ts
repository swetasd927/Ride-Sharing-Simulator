import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveTripToHistory, fetchTripHistory } from '../historyApi';

// Mock supabaseClient to prevent actual DB operations during tests
vi.mock('../supabaseClient', () => ({
  isSupabaseConfigured: false,
  supabase: null,
}));

describe('historyApi utils', () => {
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
    
    // Mock localStorage
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => mockStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStorage[key];
      }),
      clear: vi.fn(() => {
        mockStorage = {};
      }),
    });

    // Mock fetch
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve([]),
      } as Response)
    ));
  });

  const sampleRecord = {
    tripId: 'test_trip_123',
    riderId: 'rider_abc',
    driverId: 'driver_xyz',
    pickupAddress: 'Thamel',
    dropoffAddress: 'Durbar Marg',
    price: 150,
    status: 'COMPLETED' as const,
    durationMinutes: 12,
  };

  describe('saveTripToHistory', () => {
    it('should save the trip to localStorage', async () => {
      const saved = await saveTripToHistory(sampleRecord);
      
      expect(saved.id).toBeDefined();
      expect(saved.timestamp).toBeDefined();
      expect(saved.tripId).toBe(sampleRecord.tripId);
      
      const storedData = localStorage.getItem('local_ride_history');
      expect(storedData).not.toBeNull();
      
      const parsed = JSON.parse(storedData!);
      expect(parsed).toBeInstanceOf(Array);
      expect(parsed[0].tripId).toBe(sampleRecord.tripId);
    });

    it('should make an external API POST request to save history', async () => {
      await saveTripToHistory(sampleRecord);
      
      expect(fetch).toHaveBeenCalledTimes(1);
      const [url, options] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
      expect(url).toBe('https://jsonplaceholder.typicode.com/posts');
      expect(options.method).toBe('POST');
      
      const body = JSON.parse(options.body as string);
      expect(body.tripId).toBe(sampleRecord.tripId);
    });
  });

  describe('fetchTripHistory', () => {
    it('should fetch history from localStorage when remote API has no data', async () => {
      // Setup: Save a trip first
      await saveTripToHistory(sampleRecord);
      
      // Clear fetch call count
      vi.mocked(fetch).mockClear();
      
      const history = await fetchTripHistory();
      expect(history).toHaveLength(1);
      expect(history[0].tripId).toBe(sampleRecord.tripId);
    });

    it('should return empty array if no history exists anywhere', async () => {
      const history = await fetchTripHistory();
      expect(history).toEqual([]);
    });
  });
});
