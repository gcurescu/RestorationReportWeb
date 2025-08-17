// Storage utilities for MVP jobs
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

export const deleteJob = (id) => {
  const jobs = getJobs();
  const filtered = jobs.filter(job => job.id !== id);
  localStorage.setItem(JOBS_KEY, JSON.stringify(filtered));
  return true;
};

export const duplicateJob = (id) => {
  const job = getJob(id);
  if (!job) return null;
  
  // Create a copy without the id and timestamps
  const { id: _, createdAt: __, updatedAt: ___, ...jobData } = job;
  
  // Update some fields to indicate it's a duplicate
  const duplicatedJob = {
    ...jobData,
    claim: {
      ...jobData.claim,
      claimId: jobData.claim?.claimId ? `${jobData.claim.claimId}-COPY` : 'COPY',
      summary: jobData.claim?.summary ? `[COPY] ${jobData.claim.summary}` : '[COPY] Duplicated claim'
    }
  };
  
  return saveJob(duplicatedJob);
};
