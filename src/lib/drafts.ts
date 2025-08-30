import { Job } from '../schemas/job';

const DRAFT_KEY = 'job-wizard-draft';

export const saveDraft = (data: Partial<Job>): void => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      ...data,
      lastSaved: new Date().toISOString()
    }));
  } catch (error) {
    console.warn('Failed to save draft:', error);
  }
};

export const loadDraft = (): Partial<Job> | null => {
  try {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (!draft) return null;
    
    const parsed = JSON.parse(draft);
    // Remove the lastSaved timestamp before returning
    const { lastSaved, ...data } = parsed;
    return data;
  } catch (error) {
    console.warn('Failed to load draft:', error);
    return null;
  }
};

export const clearDraft = (): void => {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    console.warn('Failed to clear draft:', error);
  }
};

export const hasDraft = (): boolean => {
  return localStorage.getItem(DRAFT_KEY) !== null;
};
