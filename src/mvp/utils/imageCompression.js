// Image compression utilities
// Compress images client-side to reduce storage and bandwidth usage

/**
 * Compress an image file/blob to reduce size
 * @param {File|Blob} file - The image file to compress
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width in pixels (default: 2048)
 * @param {number} options.maxHeight - Maximum height in pixels (default: 2048)  
 * @param {number} options.quality - JPEG quality 0-1 (default: 0.9)
 * @param {string} options.format - Output format 'image/jpeg' or 'image/png' (auto-detect)
 * @returns {Promise<Blob>} Compressed image blob
 */
export const compressImage = (file, options = {}) => {
  const {
    maxWidth = 2048,
    maxHeight = 2048,
    quality = 0.9,
    format = null // Auto-detect format
  } = options;

  return new Promise((resolve, reject) => {
    // Handle non-image files
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        
        if (width > height) {
          width = Math.min(width, maxWidth);
          height = width / aspectRatio;
        } else {
          height = Math.min(height, maxHeight);
          width = height * aspectRatio;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      // Determine output format
      let outputFormat = format;
      if (!outputFormat) {
        // Use JPEG for photos, PNG for graphics with transparency
        outputFormat = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      }

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Only use compressed version if it's actually smaller
            resolve(blob.size < file.size ? blob : file);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        outputFormat,
        outputFormat === 'image/jpeg' ? quality : 1.0
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Load the image
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Get image dimensions without loading the full image
 * @param {File|Blob} file - The image file
 * @returns {Promise<{width: number, height: number}>}
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(img.src);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Calculate the compressed file size estimate
 * @param {File} file - Original file
 * @param {Object} options - Compression options (same as compressImage)
 * @returns {Promise<number>} Estimated compressed size in bytes
 */
export const estimateCompressedSize = async (file, options = {}) => {
  try {
    const compressed = await compressImage(file, options);
    return compressed.size;
  } catch (error) {
    console.error('Error estimating compressed size:', error);
    return file.size; // Return original size on error
  }
};