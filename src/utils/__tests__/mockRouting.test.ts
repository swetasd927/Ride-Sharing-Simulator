import { describe, it, expect } from 'vitest';
import { KATHMANDU_PRESETS, generateRoute, estimatePrice } from '../mockRouting';

describe('mockRouting utils', () => {
  describe('KATHMANDU_PRESETS', () => {
    it('should contain preset locations in Kathmandu', () => {
      expect(KATHMANDU_PRESETS).toBeInstanceOf(Array);
      expect(KATHMANDU_PRESETS.length).toBeGreaterThan(0);
      
      const firstPreset = KATHMANDU_PRESETS[0];
      expect(firstPreset).toHaveProperty('name');
      expect(firstPreset).toHaveProperty('lat');
      expect(firstPreset).toHaveProperty('lng');
      expect(typeof firstPreset.name).toBe('string');
      expect(typeof firstPreset.lat).toBe('number');
      expect(typeof firstPreset.lng).toBe('number');
    });

    it('should have Thamel as a preset location', () => {
      const thamel = KATHMANDU_PRESETS.find(p => p.name === 'Thamel');
      expect(thamel).toBeDefined();
      expect(thamel?.lat).toBeCloseTo(27.7150, 4);
      expect(thamel?.lng).toBeCloseTo(85.3120, 4);
    });
  });

  describe('generateRoute', () => {
    it('should generate a route with exactly 26 steps', () => {
      const start: [number, number] = [27.7150, 85.3120]; // Thamel
      const end: [number, number] = [27.7100, 85.3180]; // Durbar Marg
      
      const route = generateRoute(start, end);
      expect(route).toBeInstanceOf(Array);
      expect(route).toHaveLength(26);
    });

    it('should start at the start location and end at the end location', () => {
      const start: [number, number] = [27.7150, 85.3120];
      const end: [number, number] = [27.6730, 85.3250];
      
      const route = generateRoute(start, end);
      expect(route[0]).toEqual(start);
      expect(route[route.length - 1]).toEqual(end);
    });

    it('should contain numeric coordinates at each step', () => {
      const start: [number, number] = [27.7150, 85.3120];
      const end: [number, number] = [27.7100, 85.3180];
      
      const route = generateRoute(start, end);
      route.forEach(step => {
        expect(step).toHaveLength(2);
        expect(typeof step[0]).toBe('number');
        expect(typeof step[1]).toBe('number');
      });
    });
  });

  describe('estimatePrice', () => {
    it('should return a base rate when start and end are the same', () => {
      const start: [number, number] = [27.7150, 85.3120];
      const price = estimatePrice(start, start);
      expect(price).toBe(80); // baseRate
    });

    it('should estimate higher price for longer distances', () => {
      const thamel: [number, number] = [27.7150, 85.3120];
      const durbarMarg: [number, number] = [27.7100, 85.3180];
      const airport: [number, number] = [27.6980, 85.3590];

      const shortPrice = estimatePrice(thamel, durbarMarg);
      const longPrice = estimatePrice(thamel, airport);

      expect(shortPrice).toBeGreaterThan(80);
      expect(longPrice).toBeGreaterThan(shortPrice);
    });
  });
});
