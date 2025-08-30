// Migration utility to convert old photo format to new IndexedDB format
// This can be run as a one-time migration script if needed

import { dataURLToBlob, savePhotoBlob, generatePhotoId, createThumbnail } from './imageStore';
import { getJobs, updateJob } from './storage';

/**
 * Migrate a single job's photos from old format to new format
 * @param {Object} job - The job object to migrate
 * @returns {Promise<Object>} Updated job object with new photo format
 */
export const migrateJobPhotos = async (job) => {
  const migratedJob = { ...job };
  
  // Migrate general photos
  if (migratedJob.photos && Array.isArray(migratedJob.photos)) {
    const newPhotos = [];
    for (const photo of migratedJob.photos) {
      if (photo.file && !photo.id) {
        // This is an old format photo that needs migration
        try {
          const blob = dataURLToBlob(photo.file);
          const photoId = generatePhotoId();
          const thumbDataUrl = await createThumbnail(blob);
          
          // Store the blob
          await savePhotoBlob(photoId, blob);
          
          // Create new metadata
          const newPhoto = {
            id: photoId,
            caption: photo.caption,
            timeISO: photo.timeISO,
            thumbDataUrl,
            size: blob.size,
            type: blob.type
          };
          
          newPhotos.push(newPhoto);
        } catch (error) {
          console.error('Error migrating photo:', error);
          // Keep the old photo if migration fails
          newPhotos.push(photo);
        }
      } else {
        // Already in new format or no migration needed
        newPhotos.push(photo);
      }
    }
    migratedJob.photos = newPhotos;
  }
  
  // Migrate room photos
  if (migratedJob.rooms && Array.isArray(migratedJob.rooms)) {
    for (let roomIndex = 0; roomIndex < migratedJob.rooms.length; roomIndex++) {
      const room = migratedJob.rooms[roomIndex];
      if (room.photos && Array.isArray(room.photos)) {
        const newPhotos = [];
        for (const photo of room.photos) {
          if (photo.file && !photo.id) {
            // This is an old format photo that needs migration
            try {
              const blob = dataURLToBlob(photo.file);
              const photoId = generatePhotoId();
              const thumbDataUrl = await createThumbnail(blob);
              
              // Store the blob
              await savePhotoBlob(photoId, blob);
              
              // Create new metadata
              const newPhoto = {
                id: photoId,
                caption: photo.caption,
                timeISO: photo.timeISO,
                thumbDataUrl,
                size: blob.size,
                type: blob.type
              };
              
              newPhotos.push(newPhoto);
            } catch (error) {
              console.error('Error migrating room photo:', error);
              // Keep the old photo if migration fails
              newPhotos.push(photo);
            }
          } else {
            // Already in new format or no migration needed
            newPhotos.push(photo);
          }
        }
        migratedJob.rooms[roomIndex] = { ...room, photos: newPhotos };
      }
    }
  }
  
  return migratedJob;
};

/**
 * Migrate all jobs from old photo format to new format
 * This is a one-time migration script
 * @returns {Promise<number>} Number of jobs migrated
 */
export const migrateAllJobs = async () => {
  const jobs = getJobs();
  let migratedCount = 0;
  
  for (const job of jobs) {
    try {
      const migratedJob = await migrateJobPhotos(job);
      
      // Check if any photos were actually migrated
      const hasOldPhotos = JSON.stringify(job).includes('"file":"data:image/');
      const hasNewPhotos = JSON.stringify(migratedJob).includes('"id":"photo_');
      
      if (hasOldPhotos && hasNewPhotos) {
        // Update the job in storage
        await updateJob(job.id, migratedJob);
        migratedCount++;
        console.log(`Migrated job: ${job.id}`);
      }
    } catch (error) {
      console.error(`Error migrating job ${job.id}:`, error);
    }
  }
  
  console.log(`Migration complete. ${migratedCount} jobs migrated.`);
  return migratedCount;
};

/**
 * Check if a job needs migration
 * @param {Object} job - The job to check
 * @returns {boolean} True if job has old format photos
 */
export const needsMigration = (job) => {
  const jobStr = JSON.stringify(job);
  return jobStr.includes('"file":"data:image/') && !jobStr.includes('"id":"photo_');
};

/**
 * Get migration statistics
 * @returns {Object} Migration stats
 */
export const getMigrationStats = () => {
  const jobs = getJobs();
  let oldFormat = 0;
  let newFormat = 0;
  let mixed = 0;
  let noPhotos = 0;
  
  for (const job of jobs) {
    const jobStr = JSON.stringify(job);
    const hasOldPhotos = jobStr.includes('"file":"data:image/');
    const hasNewPhotos = jobStr.includes('"id":"photo_');
    const hasPhotos = jobStr.includes('"photos":[') && jobStr.includes('"caption"');
    
    if (!hasPhotos) {
      noPhotos++;
    } else if (hasOldPhotos && hasNewPhotos) {
      mixed++;
    } else if (hasOldPhotos) {
      oldFormat++;
    } else if (hasNewPhotos) {
      newFormat++;
    }
  }
  
  return {
    total: jobs.length,
    oldFormat,
    newFormat,
    mixed,
    noPhotos
  };
};
