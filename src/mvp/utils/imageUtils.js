/**
 * Utility functions for handling photo EXIF orientation
 * Helps fix rotated images from mobile cameras
 */

/**
 * Fix image orientation based on EXIF data
 * @param {File} file - The image file
 * @param {number} maxWidth - Maximum width for the corrected image (default: 1920)
 * @param {number} maxHeight - Maximum height for the corrected image (default: 1920)
 * @returns {Promise<string>} Data URL of the corrected image
 */
export const fixImageOrientation = (file, maxWidth = 1920, maxHeight = 1920) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate dimensions maintaining aspect ratio
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        
        if (width > height) {
          width = maxWidth;
          height = width / aspectRatio;
        } else {
          height = maxHeight;
          width = height * aspectRatio;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw the image with proper orientation
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to data URL
      const dataURL = canvas.toDataURL('image/jpeg', 0.9);
      resolve(dataURL);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    
    // Create object URL to load the image
    const objectURL = URL.createObjectURL(file);
    img.src = objectURL;
    
    // Clean up object URL after loading
    img.onload = () => {
      URL.revokeObjectURL(objectURL);
      img.onload(); // Call the original onload
    };
  });
};

/**
 * Process uploaded image files to fix orientation and resize
 * @param {FileList|Array} files - Array of image files
 * @param {object} options - Processing options
 * @returns {Promise<Array>} Array of processed image data URLs
 */
export const processImageFiles = async (files, options = {}) => {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.9
  } = options;
  
  const processedImages = [];
  
  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      continue;
    }
    
    try {
      const dataURL = await fixImageOrientation(file, maxWidth, maxHeight);
      processedImages.push({
        file: dataURL,
        originalName: file.name,
        timeISO: new Date().toISOString(),
        caption: ''
      });
    } catch (error) {
      console.error('Failed to process image:', file.name, error);
    }
  }
  
  return processedImages;
};

/**
 * Create thumbnail from image data URL
 * @param {string} dataURL - Image data URL
 * @param {number} size - Thumbnail size (width and height)
 * @returns {Promise<string>} Thumbnail data URL
 */
export const createThumbnail = (dataURL, size = 150) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = size;
      canvas.height = size;
      
      // Calculate crop area for square thumbnail
      const minDimension = Math.min(img.width, img.height);
      const x = (img.width - minDimension) / 2;
      const y = (img.height - minDimension) / 2;
      
      // Draw cropped image
      ctx.drawImage(
        img,
        x, y, minDimension, minDimension, // Source rectangle
        0, 0, size, size // Destination rectangle
      );
      
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    
    img.onerror = () => reject(new Error('Failed to create thumbnail'));
    img.src = dataURL;
  });
};

export default {
  fixImageOrientation,
  processImageFiles,
  createThumbnail
};
