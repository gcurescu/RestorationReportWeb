// Storage utilities for MVP jobs
import { deletePhoto, duplicatePhoto } from './imageStore';

const JOBS_KEY = 'rr_jobs';

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

export const saveJob = (job) => {
  const jobs = getJobs();
  const id = generateId();
  const timestamp = new Date().toISOString();
  const newJob = {
    ...job,
    id,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  
  jobs.push(newJob);
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  return id;
};

export const updateJob = (id, patch) => {
  const jobs = getJobs();
  const index = jobs.findIndex(job => job.id === id);
  if (index === -1) return false;
  
  jobs[index] = {
    ...jobs[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  return true;
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

export const getJob = (id) => {
  const jobs = getJobs();
  return jobs.find(job => job.id === id);
};

export const deleteJob = async (id) => {
  const job = getJob(id);
  if (job) {
    // Clean up all photos associated with this job
    await cleanupJobPhotos(job);
  }
  
  const jobs = getJobs();
  const filtered = jobs.filter(job => job.id !== id);
  localStorage.setItem(JOBS_KEY, JSON.stringify(filtered));
  return true;
};

// Helper function to extract all photo IDs from a job
const extractPhotoIds = (job) => {
  const photoIds = [];
  
  // General photos
  if (job.photos) {
    job.photos.forEach(photo => {
      if (photo.id) photoIds.push(photo.id);
    });
  }
  
  // Room photos
  if (job.rooms) {
    job.rooms.forEach(room => {
      if (room.photos) {
        room.photos.forEach(photo => {
          if (photo.id) photoIds.push(photo.id);
        });
      }
    });
  }
  
  return photoIds;
};

// Helper function to clean up photos for a job
const cleanupJobPhotos = async (job) => {
  const photoIds = extractPhotoIds(job);
  
  for (const photoId of photoIds) {
    try {
      await deletePhoto(photoId);
    } catch (error) {
      console.error(`Error deleting photo ${photoId}:`, error);
    }
  }
};

// Helper function to duplicate photos for a job
const duplicateJobPhotos = async (job) => {
  const newJob = { ...job };
  
  // Duplicate general photos
  if (newJob.photos) {
    const newPhotos = [];
    for (const photo of newJob.photos) {
      if (photo.id) {
        try {
          const duplicatedPhoto = await duplicatePhoto(photo.id, photo);
          newPhotos.push(duplicatedPhoto);
        } catch (error) {
          console.error(`Error duplicating photo ${photo.id}:`, error);
          // Keep original metadata but without the blob
          newPhotos.push({ ...photo, id: null });
        }
      } else {
        // Legacy photo format
        newPhotos.push(photo);
      }
    }
    newJob.photos = newPhotos;
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
              const duplicatedPhoto = await duplicatePhoto(photo.id, photo);
              newPhotos.push(duplicatedPhoto);
            } catch (error) {
              console.error(`Error duplicating room photo ${photo.id}:`, error);
              // Keep original metadata but without the blob
              newPhotos.push({ ...photo, id: null });
            }
          } else {
            // Legacy photo format
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
  const job = getJob(id);
  if (!job) return null;
  
  // Create a copy without the id and timestamps
  const { id: _, createdAt: __, updatedAt: ___, ...jobData } = job;
  
  // Duplicate all photos
  const jobWithDuplicatedPhotos = await duplicateJobPhotos(jobData);
  
  // Update some fields to indicate it's a duplicate
  const duplicatedJob = {
    ...jobWithDuplicatedPhotos,
    claim: {
      ...jobWithDuplicatedPhotos.claim,
      claimId: jobWithDuplicatedPhotos.claim?.claimId ? `${jobWithDuplicatedPhotos.claim.claimId}-COPY` : 'COPY',
      summary: jobWithDuplicatedPhotos.claim?.summary ? `[COPY] ${jobWithDuplicatedPhotos.claim.summary}` : '[COPY] Duplicated claim'
    }
  };
  
  return saveJob(duplicatedJob);
};
