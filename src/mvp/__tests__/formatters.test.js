/**
 * Test utilities for formatter functions
 * Validates consistent data formatting across application
 */

import {
  formatDate,
  formatDateTime,
  formatEnergy,
  formatTemperature,
  formatRH,
  formatGPP
} from '../utils/formatters';

describe('Formatter Functions', () => {
  describe('formatDate', () => {
    it('should format date string to MM/DD/YYYY', () => {
      const result = formatDate('2024-01-15');
      expect(result).toBe('01/15/2024');
    });

    it('should handle Date objects', () => {
      const date = new Date('2024-12-25');
      const result = formatDate(date);
      expect(result).toBe('12/25/2024');
    });

    it('should handle null/undefined', () => {
      expect(formatDate(null)).toBe('--');
      expect(formatDate(undefined)).toBe('--');
      expect(formatDate('')).toBe('--');
    });

    it('should handle invalid dates', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('--');
    });
  });

  describe('formatDateTime', () => {
    it('should format date with time', () => {
      const result = formatDateTime('2024-01-15T14:30:00Z');
      expect(result).toMatch(/01\/15\/2024.*2:30.*PM/);
    });

    it('should handle Date objects', () => {
      const date = new Date('2024-01-15T09:15:00Z');
      const result = formatDateTime(date);
      expect(result).toContain('01/15/2024');
      expect(result).toContain('AM');
    });

    it('should handle null/undefined', () => {
      expect(formatDateTime(null)).toBe('--');
      expect(formatDateTime(undefined)).toBe('--');
    });
  });

  describe('formatEnergy', () => {
    it('should format energy with kWh unit', () => {
      expect(formatEnergy(15.6)).toBe('15.6 kWh');
      expect(formatEnergy(0)).toBe('0 kWh');
    });

    it('should round to 1 decimal place', () => {
      expect(formatEnergy(15.678)).toBe('15.7 kWh');
      expect(formatEnergy(15.634)).toBe('15.6 kWh');
    });

    it('should handle null/undefined', () => {
      expect(formatEnergy(null)).toBe('-- kWh');
      expect(formatEnergy(undefined)).toBe('-- kWh');
    });
  });

  describe('formatTemperature', () => {
    it('should format temperature with °F unit', () => {
      expect(formatTemperature(72)).toBe('72°F');
      expect(formatTemperature(98.6)).toBe('98.6°F');
    });

    it('should round to 1 decimal place', () => {
      expect(formatTemperature(72.34)).toBe('72.3°F');
      expect(formatTemperature(72.36)).toBe('72.4°F');
    });

    it('should handle negative temperatures', () => {
      expect(formatTemperature(-10)).toBe('-10°F');
    });

    it('should handle null/undefined', () => {
      expect(formatTemperature(null)).toBe('--°F');
      expect(formatTemperature(undefined)).toBe('--°F');
    });
  });

  describe('formatRH', () => {
    it('should format relative humidity with % unit', () => {
      expect(formatRH(45)).toBe('45%');
      expect(formatRH(67.8)).toBe('67.8%');
    });

    it('should round to 1 decimal place', () => {
      expect(formatRH(45.67)).toBe('45.7%');
      expect(formatRH(45.63)).toBe('45.6%');
    });

    it('should handle edge values', () => {
      expect(formatRH(0)).toBe('0%');
      expect(formatRH(100)).toBe('100%');
    });

    it('should handle null/undefined', () => {
      expect(formatRH(null)).toBe('--%');
      expect(formatRH(undefined)).toBe('--%');
    });
  });

  describe('formatGPP', () => {
    it('should format grains per pound', () => {
      expect(formatGPP(85)).toBe('85 GPP');
      expect(formatGPP(67.5)).toBe('67.5 GPP');
    });

    it('should round to 1 decimal place', () => {
      expect(formatGPP(85.67)).toBe('85.7 GPP');
      expect(formatGPP(85.63)).toBe('85.6 GPP');
    });

    it('should handle decimal values', () => {
      expect(formatGPP(0.5)).toBe('0.5 GPP');
    });

    it('should handle null/undefined', () => {
      expect(formatGPP(null)).toBe('-- GPP');
      expect(formatGPP(undefined)).toBe('-- GPP');
    });
  });

  describe('Edge cases and consistency', () => {
    it('should handle zero values consistently', () => {
      expect(formatEnergy(0)).toBe('0 kWh');
      expect(formatTemperature(0)).toBe('0°F');
      expect(formatRH(0)).toBe('0%');
      expect(formatGPP(0)).toBe('0 GPP');
    });

    it('should handle string numbers', () => {
      expect(formatTemperature('72')).toBe('72°F');
      expect(formatRH('45')).toBe('45%');
    });

    it('should handle NaN gracefully', () => {
      expect(formatTemperature(NaN)).toBe('--°F');
      expect(formatRH(NaN)).toBe('--%');
    });
  });
});
