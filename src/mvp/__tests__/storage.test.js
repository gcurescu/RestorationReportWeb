/**
 * Test utilities for storage functions
 * Basic smoke tests to ensure CRUD operations work
 */

import { saveJob, getJob, getJobs, deleteJob, duplicateJob } from '../storage';
import { defaultValues } from '../ReportSchema';

describe('Storage Functions', () => {
  // Clear localStorage before each test
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveJob', () => {
    it('should save a new job and return an ID', () => {
      const jobData = { ...defaultValues };
      jobData.claim.claimId = 'TEST-001';
      jobData.policyholder.name = 'Test Policyholder';

      const jobId = saveJob(jobData);
      
      expect(jobId).toBeDefined();
      expect(typeof jobId).toBe('string');
      expect(jobId.length).toBeGreaterThan(0);
    });

    it('should update existing job when ID is provided', () => {
      const jobData = { ...defaultValues };
      jobData.claim.claimId = 'TEST-001';
      
      // Create job
      const jobId = saveJob(jobData);
      
      // Update job
      const updatedData = { ...jobData };
      updatedData.claim.claimId = 'TEST-001-UPDATED';
      updatedData.id = jobId;
      
      const updatedId = saveJob(updatedData);
      
      expect(updatedId).toBe(jobId);
      
      // Verify the update
      const retrievedJob = getJob(jobId);
      expect(retrievedJob.claim.claimId).toBe('TEST-001-UPDATED');
    });
  });

  describe('getJob', () => {
    it('should retrieve a job by ID', () => {
      const jobData = { ...defaultValues };
      jobData.claim.claimId = 'TEST-002';
      
      const jobId = saveJob(jobData);
      const retrievedJob = getJob(jobId);
      
      expect(retrievedJob).toBeDefined();
      expect(retrievedJob.id).toBe(jobId);
      expect(retrievedJob.claim.claimId).toBe('TEST-002');
    });

    it('should return null for non-existent job', () => {
      const result = getJob('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('getJobs', () => {
    it('should return empty array when no jobs exist', () => {
      const jobs = getJobs();
      expect(Array.isArray(jobs)).toBe(true);
      expect(jobs.length).toBe(0);
    });

    it('should return all saved jobs', () => {
      // Save multiple jobs
      const job1Data = { ...defaultValues };
      job1Data.claim.claimId = 'TEST-003';
      
      const job2Data = { ...defaultValues };
      job2Data.claim.claimId = 'TEST-004';
      
      saveJob(job1Data);
      saveJob(job2Data);
      
      const jobs = getJobs();
      expect(jobs.length).toBe(2);
    });
  });

  describe('deleteJob', () => {
    it('should delete a job by ID', () => {
      const jobData = { ...defaultValues };
      jobData.claim.claimId = 'TEST-005';
      
      const jobId = saveJob(jobData);
      
      // Verify job exists
      expect(getJob(jobId)).toBeDefined();
      
      // Delete job
      const result = deleteJob(jobId);
      expect(result).toBe(true);
      
      // Verify job is deleted
      expect(getJob(jobId)).toBeNull();
    });

    it('should return false for non-existent job', () => {
      const result = deleteJob('non-existent-id');
      expect(result).toBe(false);
    });
  });

  describe('duplicateJob', () => {
    it('should create a copy of existing job', () => {
      const jobData = { ...defaultValues };
      jobData.claim.claimId = 'TEST-006';
      jobData.policyholder.name = 'Original Policyholder';
      
      const originalId = saveJob(jobData);
      const duplicateId = duplicateJob(originalId);
      
      expect(duplicateId).toBeDefined();
      expect(duplicateId).not.toBe(originalId);
      
      const duplicateJob = getJob(duplicateId);
      expect(duplicateJob.claim.claimId).toBe('TEST-006');
      expect(duplicateJob.policyholder.name).toBe('Original Policyholder');
      
      // Should have different timestamps
      expect(duplicateJob.createdAt).not.toBe(getJob(originalId).createdAt);
    });

    it('should return null for non-existent job', () => {
      const result = duplicateJob('non-existent-id');
      expect(result).toBeNull();
    });
  });
});
