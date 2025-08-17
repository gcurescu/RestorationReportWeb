/**
 * Calculator utilities for restoration report calculations
 */

/**
 * Calculate recommended dehumidifier capacity based on class of water and volume
 * @param {number} classOfWater - Class of water (1-4)
 * @param {number} volumeFt3 - Volume in cubic feet
 * @returns {number} Recommended pints per day
 */
export const calculateDehuPintsPerDay = (classOfWater, volumeFt3) => {
  // Rule of thumb calculations based on industry standards
  const baseRate = {
    1: 0.05,  // Clean water - 0.05 pints per cubic foot
    2: 0.08,  // Gray water - 0.08 pints per cubic foot
    3: 0.12,  // Black water - 0.12 pints per cubic foot
    4: 0.15,  // Specialty drying - 0.15 pints per cubic foot
  };

  const rate = baseRate[classOfWater] || baseRate[1];
  return Math.round(volumeFt3 * rate);
};

/**
 * Calculate recommended air mover count based on floor area
 * @param {number} floorFt2 - Floor area in square feet
 * @param {number} insetsOrOffsets - Number of insets or offsets (default 0)
 * @returns {number} Recommended number of air movers
 */
export const calculateAirMovers = (floorFt2, insetsOrOffsets = 0) => {
  // Industry standard: 1 air mover per 150-200 sq ft, adjusted for complexity
  const baseMovers = Math.ceil(floorFt2 / 175);
  const adjustmentForComplexity = Math.ceil(insetsOrOffsets / 3); // Add 1 mover per 3 insets/offsets
  
  return Math.max(1, baseMovers + adjustmentForComplexity);
};

/**
 * Calculate energy consumption for equipment
 * @param {number} powerKw - Power rating in kilowatts
 * @param {number} hours - Hours of operation
 * @returns {number} Energy consumption in kWh
 */
export const calculateEnergyConsumption = (powerKw, hours) => {
  return Math.round((powerKw * hours) * 100) / 100; // Round to 2 decimal places
};

/**
 * Calculate days between two dates
 * @param {string} startISO - Start date in ISO format
 * @param {string} endISO - End date in ISO format (optional, defaults to now)
 * @returns {number} Number of days
 */
export const calculateDaysBetween = (startISO, endISO = null) => {
  const startDate = new Date(startISO);
  const endDate = endISO ? new Date(endISO) : new Date();
  
  const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
};

/**
 * Calculate totals for equipment arrays
 * @param {Array} equipment - Array of equipment objects
 * @param {string} energyField - Field name for energy (default 'energyKwh')
 * @returns {number} Total energy consumption
 */
export const calculateEquipmentTotal = (equipment, energyField = 'energyKwh') => {
  return equipment.reduce((total, item) => {
    return total + (parseFloat(item[energyField]) || 0);
  }, 0);
};
