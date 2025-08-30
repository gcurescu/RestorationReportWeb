// Storage utilities for MVP jobs
import { saveImage, getImage, deleteImage } from '../lib/imageStore';

const JOBS_KEY = 'rr_jobs';

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

// Helper to extract and store large data to IndexedDB
const processJobForStorage = async (job) => {
  const processedJob = { ...job };
  
  // Process general photos
  if (processedJob.photos) {
    const processedPhotos = [];
    for (const photo of processedJob.photos) {
      if (photo.file && typeof photo.file === 'string' && photo.file.startsWith('data:')) {
        // Save image data to IndexedDB and keep metadata
        const imageId = generateId();
        await saveImage(imageId, photo.file, {
          name: photo.name,
          timestamp: photo.timestamp || new Date().toISOString(),
          type: 'job-photo'
        });
        processedPhotos.push({
          ...photo,
          id: imageId,
          file: null // Remove the large base64 data
        });
      } else {
        processedPhotos.push(photo);
      }
    }
    processedJob.photos = processedPhotos;
  }
  
  // Process signatures
  if (processedJob.signature && typeof processedJob.signature === 'string' && processedJob.signature.startsWith('data:')) {
    const signatureId = generateId();
    await saveImage(signatureId, processedJob.signature, {
      type: 'signature',
      timestamp: new Date().toISOString()
    });
    processedJob.signature = signatureId;
  }
  
  // Process floor plan
  if (processedJob.floorPlan && typeof processedJob.floorPlan === 'string' && processedJob.floorPlan.startsWith('data:')) {
    const floorPlanId = generateId();
    await saveImage(floorPlanId, processedJob.floorPlan, {
      type: 'floor-plan',
      timestamp: new Date().toISOString()
    });
    processedJob.floorPlan = floorPlanId;
  }
  
  // Process room photos
  if (processedJob.rooms) {
    for (let roomIndex = 0; roomIndex < processedJob.rooms.length; roomIndex++) {
      const room = processedJob.rooms[roomIndex];
      if (room.photos) {
        const processedRoomPhotos = [];
        for (const photo of room.photos) {
          if (photo.file && typeof photo.file === 'string' && photo.file.startsWith('data:')) {
            const imageId = generateId();
            await saveImage(imageId, photo.file, {
              name: photo.name,
              timestamp: photo.timestamp || new Date().toISOString(),
              type: 'room-photo',
              roomName: room.name
            });
            processedRoomPhotos.push({
              ...photo,
              id: imageId,
              file: null
            });
          } else {
            processedRoomPhotos.push(photo);
          }
        }
        processedJob.rooms[roomIndex] = { ...room, photos: processedRoomPhotos };
      }
    }
  }
  
  return processedJob;
};

// Helper to restore job data from IndexedDB
const restoreJobFromStorage = async (job) => {
  const restoredJob = { ...job };
  
  // Restore general photos
  if (restoredJob.photos) {
    const restoredPhotos = [];
    for (const photo of restoredJob.photos) {
      if (photo.id && !photo.file) {
        try {
          const imageData = await getImage(photo.id);
          if (imageData) {
            restoredPhotos.push({
              ...photo,
              file: imageData.data
            });
          } else {
            restoredPhotos.push(photo); // Keep metadata even if image not found
          }
        } catch (error) {
          console.error(`Error restoring photo ${photo.id}:`, error);
          restoredPhotos.push(photo);
        }
      } else {
        restoredPhotos.push(photo);
      }
    }
    restoredJob.photos = restoredPhotos;
  }
  
  // Restore signatures
  if (restoredJob.signature && typeof restoredJob.signature === 'string' && !restoredJob.signature.startsWith('data:')) {
    try {
      const signatureData = await getImage(restoredJob.signature);
      if (signatureData) {
        restoredJob.signature = signatureData.data;
      }
    } catch (error) {
      console.error(`Error restoring signature ${restoredJob.signature}:`, error);
    }
  }
  
  // Restore floor plan
  if (restoredJob.floorPlan && typeof restoredJob.floorPlan === 'string' && !restoredJob.floorPlan.startsWith('data:')) {
    try {
      const floorPlanData = await getImage(restoredJob.floorPlan);
      if (floorPlanData) {
        restoredJob.floorPlan = floorPlanData.data;
      }
    } catch (error) {
      console.error(`Error restoring floor plan ${restoredJob.floorPlan}:`, error);
    }
  }
  
  // Restore room photos
  if (restoredJob.rooms) {
    for (let roomIndex = 0; roomIndex < restoredJob.rooms.length; roomIndex++) {
      const room = restoredJob.rooms[roomIndex];
      if (room.photos) {
        const restoredRoomPhotos = [];
        for (const photo of room.photos) {
          if (photo.id && !photo.file) {
            try {
              const imageData = await getImage(photo.id);
              if (imageData) {
                restoredRoomPhotos.push({
                  ...photo,
                  file: imageData.data
                });
              } else {
                restoredRoomPhotos.push(photo);
              }
            } catch (error) {
              console.error(`Error restoring room photo ${photo.id}:`, error);
              restoredRoomPhotos.push(photo);
            }
          } else {
            restoredRoomPhotos.push(photo);
          }
        }
        restoredJob.rooms[roomIndex] = { ...room, photos: restoredRoomPhotos };
      }
    }
  }
  
  return restoredJob;
};

export const saveJob = async (job) => {
  try {
    const jobs = getJobs();
    const id = generateId();
    const timestamp = new Date().toISOString();
    
    // Process job to move large data to IndexedDB
    const processedJob = await processJobForStorage(job);
    
    const newJob = {
      ...processedJob,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    
    jobs.push(newJob);
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
    return id;
  } catch (error) {
    console.error('Failed to save job:', error);
    throw error;
  }
};

export const updateJob = async (id, patch) => {
  try {
    const jobs = getJobs();
    const index = jobs.findIndex(job => job.id === id);
    if (index === -1) return false;
    
    // Process patch to move large data to IndexedDB
    const processedPatch = await processJobForStorage(patch);
    
    jobs[index] = {
      ...jobs[index],
      ...processedPatch,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
    return true;
  } catch (error) {
    console.error('Failed to update job:', error);
    throw error;
  }
};

export const getJobs = () => {
  try {
    const jobs = localStorage.getItem(JOBS_KEY);
    return jobs ? JSON.parse(jobs) : [];
  } catch (error) {
    console.error('Error loading jobs:', error);
    return [];
  }
};

export const getJob = async (id) => {
  try {
    const jobs = getJobs();
    const job = jobs.find(job => job.id === id);
    if (!job) return null;
    
    // Restore job data from IndexedDB
    return await restoreJobFromStorage(job);
  } catch (error) {
    console.error('Failed to get job:', error);
    // Return the job without restored images if there's an error
    const jobs = getJobs();
    return jobs.find(job => job.id === id) || null;
  }
};

export const deleteJob = async (id) => {
  try {
    const job = getJobs().find(job => job.id === id);
    if (job) {
      // Clean up all images associated with this job
      await cleanupJobImages(job);
    }
    
    const jobs = getJobs();
    const filtered = jobs.filter(job => job.id !== id);
    localStorage.setItem(JOBS_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete job:', error);
    throw error;
  }
};

// Helper function to extract all image IDs from a job
const extractImageIds = (job) => {
  const imageIds = [];
  
  // General photos
  if (job.photos) {
    job.photos.forEach(photo => {
      if (photo.id) imageIds.push(photo.id);
    });
  }
  
  // Signature
  if (job.signature && typeof job.signature === 'string' && !job.signature.startsWith('data:')) {
    imageIds.push(job.signature);
  }
  
  // Floor plan
  if (job.floorPlan && typeof job.floorPlan === 'string' && !job.floorPlan.startsWith('data:')) {
    imageIds.push(job.floorPlan);
  }
  
  // Room photos
  if (job.rooms) {
    job.rooms.forEach(room => {
      if (room.photos) {
        room.photos.forEach(photo => {
          if (photo.id) imageIds.push(photo.id);
        });
      }
    });
  }
  
  return imageIds;
};

// Helper function to clean up images for a job
const cleanupJobImages = async (job) => {
  const imageIds = extractImageIds(job);
  
  for (const imageId of imageIds) {
    try {
      await deleteImage(imageId);
    } catch (error) {
      console.error(`Error deleting image ${imageId}:`, error);
    }
  }
};
// Helper function to duplicate images for a job
const duplicateJobImages = async (job) => {
  const newJob = { ...job };
  
  // Duplicate general photos
  if (newJob.photos) {
    const newPhotos = [];
    for (const photo of newJob.photos) {
      if (photo.id) {
        try {
          // Get original image
          const originalImage = await getImage(photo.id);
          if (originalImage) {
            // Save as new image
            const newImageId = generateId();
            await saveImage(newImageId, originalImage.data, {
              ...originalImage.metadata,
              timestamp: new Date().toISOString()
            });
            newPhotos.push({ ...photo, id: newImageId });
          } else {
            // Keep original metadata but without the image
            newPhotos.push({ ...photo, id: null });
          }
        } catch (error) {
          console.error(`Error duplicating photo ${photo.id}:`, error);
          newPhotos.push({ ...photo, id: null });
        }
      } else {
        newPhotos.push(photo);
      }
    }
    newJob.photos = newPhotos;
  }
  
  // Duplicate signature
  if (newJob.signature && typeof newJob.signature === 'string' && !newJob.signature.startsWith('data:')) {
    try {
      const originalSignature = await getImage(newJob.signature);
      if (originalSignature) {
        const newSignatureId = generateId();
        await saveImage(newSignatureId, originalSignature.data, {
          ...originalSignature.metadata,
          timestamp: new Date().toISOString()
        });
        newJob.signature = newSignatureId;
      } else {
        newJob.signature = null;
      }
    } catch (error) {
      console.error(`Error duplicating signature ${newJob.signature}:`, error);
      newJob.signature = null;
    }
  }
  
  // Duplicate floor plan
  if (newJob.floorPlan && typeof newJob.floorPlan === 'string' && !newJob.floorPlan.startsWith('data:')) {
    try {
      const originalFloorPlan = await getImage(newJob.floorPlan);
      if (originalFloorPlan) {
        const newFloorPlanId = generateId();
        await saveImage(newFloorPlanId, originalFloorPlan.data, {
          ...originalFloorPlan.metadata,
          timestamp: new Date().toISOString()
        });
        newJob.floorPlan = newFloorPlanId;
      } else {
        newJob.floorPlan = null;
      }
    } catch (error) {
      console.error(`Error duplicating floor plan ${newJob.floorPlan}:`, error);
      newJob.floorPlan = null;
    }
  }
  
  // Duplicate room photos
  if (newJob.rooms) {
    for (let roomIndex = 0; roomIndex < newJob.rooms.length; roomIndex++) {
      const room = newJob.rooms[roomIndex];
      if (room.photos) {
        const newPhotos = [];
        for (const photo of room.photos) {
          if (photo.id) {
            try {
              const originalImage = await getImage(photo.id);
              if (originalImage) {
                const newImageId = generateId();
                await saveImage(newImageId, originalImage.data, {
                  ...originalImage.metadata,
                  timestamp: new Date().toISOString()
                });
                newPhotos.push({ ...photo, id: newImageId });
              } else {
                newPhotos.push({ ...photo, id: null });
              }
            } catch (error) {
              console.error(`Error duplicating room photo ${photo.id}:`, error);
              newPhotos.push({ ...photo, id: null });
            }
          } else {
            newPhotos.push(photo);
          }
        }
        newJob.rooms[roomIndex] = { ...room, photos: newPhotos };
      }
    }
  }
  
  return newJob;
};

export const duplicateJob = async (id) => {
  try {
    const jobs = getJobs();
    const job = jobs.find(job => job.id === id);
    if (!job) return null;
    
    // Create a copy without the id and timestamps
    const { id: _, createdAt: __, updatedAt: ___, ...jobData } = job;
    
    // Duplicate all images
    const jobWithDuplicatedImages = await duplicateJobImages(jobData);
    
    // Update some fields to indicate it's a duplicate
    const duplicatedJob = {
      ...jobWithDuplicatedImages,
      claim: {
        ...jobWithDuplicatedImages.claim,
        claimId: jobWithDuplicatedImages.claim?.claimId ? `${jobWithDuplicatedImages.claim.claimId}-COPY` : 'COPY',
        summary: jobWithDuplicatedImages.claim?.summary ? `[COPY] ${jobWithDuplicatedImages.claim.summary}` : '[COPY] Duplicated claim'
      }
    };
    
    return await saveJob(duplicatedJob);
  } catch (error) {
    console.error('Failed to duplicate job:', error);
    throw error;
  }
};
