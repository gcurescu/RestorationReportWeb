/**
 * Test utilities for calculator functions
 * Validates equipment recommendations and calculations
 */

import {
  calculateDehuPintsPerDay,
  calculateAirMovers,
  calculateEnergyConsumption,
  calculateDaysBetween
} from '../utils/calculators';

describe('Calculator Functions', () => {
  describe('calculateDehuPintsPerDay', () => {
    it('should calculate dehumidifier capacity for small area', () => {
      const area = 500; // sq ft
      const severity = 'moderate';
      const result = calculateDehuPintsPerDay(area, severity);
      
      expect(result).toBeGreaterThan(0);
      expect(typeof result).toBe('number');
    });

    it('should increase capacity for higher severity', () => {
      const area = 1000;
      const moderate = calculateDehuPintsPerDay(area, 'moderate');
      const severe = calculateDehuPintsPerDay(area, 'severe');
      
      expect(severe).toBeGreaterThan(moderate);
    });

    it('should handle edge cases', () => {
      expect(calculateDehuPintsPerDay(0, 'light')).toBe(0);
      expect(calculateDehuPintsPerDay(100, 'light')).toBeGreaterThan(0);
    });
  });

  describe('calculateAirMovers', () => {
    it('should calculate air movers for room dimensions', () => {
      const length = 20;
      const width = 15;
      const height = 8;
      const severity = 'moderate';
      
      const result = calculateAirMovers(length, width, height, severity);
      
      expect(result.count).toBeGreaterThan(0);
      expect(result.cfm).toBeGreaterThan(0);
      expect(typeof result.count).toBe('number');
      expect(typeof result.cfm).toBe('number');
    });

    it('should increase air movers for severe damage', () => {
      const dims = [20, 15, 8];
      const moderate = calculateAirMovers(...dims, 'moderate');
      const severe = calculateAirMovers(...dims, 'severe');
      
      expect(severe.count).toBeGreaterThanOrEqual(moderate.count);
      expect(severe.cfm).toBeGreaterThanOrEqual(moderate.cfm);
    });

    it('should handle small rooms', () => {
      const result = calculateAirMovers(8, 10, 8, 'light');
      expect(result.count).toBeGreaterThan(0);
    });
  });

  describe('calculateEnergyConsumption', () => {
    it('should calculate daily energy consumption', () => {
      const equipment = [
        { type: 'dehumidifier', power: 650, quantity: 2 },
        { type: 'airMover', power: 180, quantity: 4 }
      ];
      
      const result = calculateEnergyConsumption(equipment);
      
      expect(result.dailyKwh).toBeGreaterThan(0);
      expect(result.monthlyCost).toBeGreaterThan(0);
      expect(typeof result.dailyKwh).toBe('number');
      expect(typeof result.monthlyCost).toBe('number');
    });

    it('should handle empty equipment array', () => {
      const result = calculateEnergyConsumption([]);
      expect(result.dailyKwh).toBe(0);
      expect(result.monthlyCost).toBe(0);
    });

    it('should calculate correctly for single equipment', () => {
      const equipment = [{ type: 'dehumidifier', power: 650, quantity: 1 }];
      const result = calculateEnergyConsumption(equipment);
      
      // 650W * 24h = 15.6 kWh per day
      expect(result.dailyKwh).toBeCloseTo(15.6, 1);
    });
  });

  describe('calculateDaysBetween', () => {
    it('should calculate days between two dates', () => {
      const date1 = '2024-01-01';
      const date2 = '2024-01-08';
      
      const result = calculateDaysBetween(date1, date2);
      expect(result).toBe(7);
    });

    it('should handle same dates', () => {
      const date = '2024-01-01';
      const result = calculateDaysBetween(date, date);
      expect(result).toBe(0);
    });

    it('should handle reverse order dates', () => {
      const date1 = '2024-01-08';
      const date2 = '2024-01-01';
      
      const result = calculateDaysBetween(date1, date2);
      expect(result).toBe(7); // Should return absolute difference
    });

    it('should handle Date objects', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-05');
      
      const result = calculateDaysBetween(date1, date2);
      expect(result).toBe(4);
    });
  });
});
