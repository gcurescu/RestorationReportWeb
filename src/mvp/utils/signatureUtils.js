/**
 * Utility functions for handling signature pads with high DPI support
 */

/**
 * Configure signature pad canvas for high DPI displays
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {SignaturePad} signaturePad - The SignaturePad instance
 */
export const configureSignaturePadForHighDPI = (canvas, signaturePad) => {
  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  
  // Get the display size
  const rect = canvas.getBoundingClientRect();
  
  // Set the actual size in memory (scaled for DPI)
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;
  
  // Scale the canvas back down using CSS
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  
  // Scale the drawing context so signatures look crisp
  const ctx = canvas.getContext('2d');
  ctx.scale(ratio, ratio);
  
  // Clear and re-initialize the signature pad
  signaturePad.clear();
  
  return ratio;
};

/**
 * Get high quality signature data URL
 * @param {SignaturePad} signaturePad - The SignaturePad instance
 * @param {string} format - Image format ('image/png' or 'image/jpeg')
 * @param {number} quality - JPEG quality (0-1)
 * @returns {string} Data URL of the signature
 */
export const getHighQualitySignature = (signaturePad, format = 'image/png', quality = 0.9) => {
  if (signaturePad.isEmpty()) {
    return null;
  }
  
  return signaturePad.toDataURL(format, quality);
};

/**
 * Initialize signature pad with optimal settings
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {object} options - Additional SignaturePad options
 * @returns {SignaturePad} Configured SignaturePad instance
 */
export const initializeSignaturePad = (canvas, options = {}) => {
  // This would require importing SignaturePad
  // For now, just return the configuration function
  return {
    configureForHighDPI: () => configureSignaturePadForHighDPI(canvas, null),
    ...options
  };
};

export default {
  configureSignaturePadForHighDPI,
  getHighQualitySignature,
  initializeSignaturePad
};
