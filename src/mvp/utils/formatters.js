import dayjs from 'dayjs';

/**
 * Formatting utilities for restoration reports
 */

/**
 * Format date for display
 * @param {string} isoString - ISO date string
 * @param {string} format - dayjs format string (default: 'MM/DD/YYYY')
 * @returns {string} Formatted date
 */
export const formatDate = (isoString, format = 'MM/DD/YYYY') => {
  if (!isoString) return '';
  return dayjs(isoString).format(format);
};

/**
 * Format date and time for display
 * @param {string} isoString - ISO datetime string
 * @param {string} format - dayjs format string (default: 'MM/DD/YYYY h:mm A')
 * @returns {string} Formatted datetime
 */
export const formatDateTime = (isoString, format = 'MM/DD/YYYY h:mm A') => {
  if (!isoString) return '';
  return dayjs(isoString).format(format);
};

/**
 * Format time only
 * @param {string} isoString - ISO datetime string
 * @param {string} format - dayjs format string (default: 'h:mm A')
 * @returns {string} Formatted time
 */
export const formatTime = (isoString, format = 'h:mm A') => {
  if (!isoString) return '';
  return dayjs(isoString).format(format);
};

/**
 * Format energy consumption with proper units and rounding
 * @param {number} kwh - Energy in kilowatt hours
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted energy with units
 */
export const formatEnergy = (kwh, decimals = 1) => {
  if (!kwh && kwh !== 0) return '0.0 kWh';
  return `${kwh.toFixed(decimals)} kWh`;
};

/**
 * Format power with proper units and rounding
 * @param {number} kw - Power in kilowatts
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted power with units
 */
export const formatPower = (kw, decimals = 1) => {
  if (!kw && kw !== 0) return '0.0 kW';
  return `${kw.toFixed(decimals)} kW`;
};

/**
 * Format days with proper pluralization
 * @param {number} days - Number of days
 * @returns {string} Formatted days
 */
export const formatDays = (days) => {
  if (!days && days !== 0) return '0 days';
  return days === 1 ? `${days} day` : `${days} days`;
};

/**
 * Format temperature
 * @param {number} temp - Temperature in Fahrenheit
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted temperature with unit
 */
export const formatTemperature = (temp, decimals = 1) => {
  if (temp === null || temp === undefined) return '-- °F';
  return `${temp.toFixed(decimals)}°F`;
};

/**
 * Format relative humidity
 * @param {number} rh - Relative humidity percentage
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted RH with unit
 */
export const formatRH = (rh, decimals = 1) => {
  if (rh === null || rh === undefined) return '-- %';
  return `${rh.toFixed(decimals)}%`;
};

/**
 * Format grains per pound
 * @param {number} gpp - Grains per pound
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted GPP with unit
 */
export const formatGPP = (gpp, decimals = 1) => {
  if (gpp === null || gpp === undefined) return '-- GPP';
  return `${gpp.toFixed(decimals)} GPP`;
};

/**
 * Format square footage
 * @param {number} sqft - Square footage
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted square footage with unit
 */
export const formatSquareFeet = (sqft, decimals = 0) => {
  if (!sqft && sqft !== 0) return '0 sq ft';
  return `${sqft.toFixed(decimals)} sq ft`;
};

/**
 * Format cubic feet
 * @param {number} cuft - Cubic feet
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted cubic feet with unit
 */
export const formatCubicFeet = (cuft, decimals = 0) => {
  if (!cuft && cuft !== 0) return '0 cu ft';
  return `${cuft.toFixed(decimals)} cu ft`;
};

/**
 * Format phone number
 * @param {string} phone - Phone number string
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone; // Return as-is if format doesn't match expected patterns
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length (default: 100)
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength - 3) + '...';
};
