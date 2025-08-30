// Image storage utilities using IndexedDB via idb-keyval
import { set, get, del } from 'idb-keyval';
import { compressImage } from './utils/imageCompression';

/**
 * Generate a unique photo ID
 */
export const generatePhotoId = () => {
  return `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Convert a data URL to a Blob
 */
export const dataURLToBlob = (dataURL) => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

/**
 * Create a thumbnail from an image blob
 */
export const createThumbnail = async (blob, maxWidth = 200, maxHeight = 150) => {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      // Calculate thumbnail dimensions while maintaining aspect ratio
      const { width, height } = img;
      const aspectRatio = width / height;
      
      let thumbWidth, thumbHeight;
      if (aspectRatio > maxWidth / maxHeight) {
        thumbWidth = maxWidth;
        thumbHeight = maxWidth / aspectRatio;
      } else {
        thumbHeight = maxHeight;
        thumbWidth = maxHeight * aspectRatio;
      }
      
      canvas.width = thumbWidth;
      canvas.height = thumbHeight;
      
      ctx.drawImage(img, 0, 0, thumbWidth, thumbHeight);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    
    img.src = URL.createObjectURL(blob);
  });
};

/**
 * Save a photo blob to IndexedDB
 * @param {string} photoId - Unique photo identifier
 * @param {Blob} blob - The image blob to store
 * @returns {Promise<void>}
 */
export const savePhotoBlob = async (photoId, blob) => {
  try {
    await set(`photo_${photoId}`, blob);
  } catch (error) {
    console.error('Error saving photo blob:', error);
    throw new Error('Failed to save photo to storage');
  }
};

/**
 * Get a photo blob from IndexedDB
 * @param {string} photoId - Unique photo identifier
 * @returns {Promise<Blob|null>}
 */
export const getPhotoBlob = async (photoId) => {
  try {
    const blob = await get(`photo_${photoId}`);
    return blob || null;
  } catch (error) {
    console.error('Error getting photo blob:', error);
    return null;
  }
};

/**
 * Delete a photo from IndexedDB
 * @param {string} photoId - Unique photo identifier
 * @returns {Promise<void>}
 */
export const deletePhoto = async (photoId) => {
  try {
    await del(`photo_${photoId}`);
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw new Error('Failed to delete photo from storage');
  }
};

/**
 * Process an uploaded file and store it
 * @param {File} file - The uploaded file
 * @param {string} caption - Photo caption
 * @returns {Promise<object>} Photo metadata object
 */
export const processAndStorePhoto = async (file, caption) => {
  try {
    // Generate unique ID
    const photoId = generatePhotoId();
    const timeISO = new Date().toISOString();
    
    // Compress the image if needed
    const compressedBlob = await compressImage(file, {
      maxWidth: 2048,
      maxHeight: 2048,
      quality: 0.9
    });
    
    // Create thumbnail
    const thumbDataUrl = await createThumbnail(compressedBlob);
    
    // Store the full image blob
    await savePhotoBlob(photoId, compressedBlob);
    
    // Return metadata object (what gets stored in the job)
    return {
      id: photoId,
      caption,
      timeISO,
      thumbDataUrl,
      size: compressedBlob.size,
      type: compressedBlob.type
    };
  } catch (error) {
    console.error('Error processing and storing photo:', error);
    throw new Error('Failed to process and store photo');
  }
};

/**
 * Duplicate a photo (used when duplicating jobs)
 * @param {string} originalPhotoId - Original photo ID
 * @param {object} metadata - Original photo metadata
 * @returns {Promise<object>} New photo metadata object
 */
export const duplicatePhoto = async (originalPhotoId, metadata) => {
  try {
    const originalBlob = await getPhotoBlob(originalPhotoId);
    if (!originalBlob) {
      throw new Error('Original photo not found');
    }
    
    const newPhotoId = generatePhotoId();
    await savePhotoBlob(newPhotoId, originalBlob);
    
    return {
      ...metadata,
      id: newPhotoId
    };
  } catch (error) {
    console.error('Error duplicating photo:', error);
    throw new Error('Failed to duplicate photo');
  }
};

/**
 * Clean up orphaned photos (photos not referenced in any job)
 * @param {Array} referencedPhotoIds - Array of photo IDs that are still referenced
 * @returns {Promise<number>} Number of photos cleaned up
 */
export const cleanupOrphanedPhotos = async (referencedPhotoIds = []) => {
  // This is a more advanced feature that would require
  // enumerating all keys in IndexedDB and checking against references
  // For now, we'll implement a simple version that relies on manual cleanup
  console.log('Cleanup orphaned photos - manual cleanup required');
  return 0;
};
