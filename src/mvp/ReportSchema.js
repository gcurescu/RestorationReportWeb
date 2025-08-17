import { z } from 'zod';

// Define the main report schema
export const reportSchema = z.object({
  company: z.object({
    name: z.string().min(1, 'Company name is required'),
    phone: z.string().min(1, 'Phone is required'),
    email: z.string().email('Valid email is required'),
    address: z.string().min(1, 'Address is required'),
    logoUrl: z.string().optional(),
  }),
  
  policyholder: z.object({
    name: z.string().min(1, 'Policyholder name is required'),
    phone: z.string().min(1, 'Phone is required'),
    address: z.string().min(1, 'Address is required'),
  }),
  
  claim: z.object({
    typeOfLoss: z.enum(['Water', 'Fire', 'Mold']),
    claimId: z.string().min(1, 'Claim ID is required'),
    carrier: z.string().min(1, 'Carrier is required'),
    adjuster: z.string().min(1, 'Adjuster is required'),
    dateOfLoss: z.string().min(1, 'Date of loss is required'),
    summary: z.string().min(10, 'Summary must be at least 10 characters'),
  }),
  
  notes: z.object({
    general: z.string().optional(),
    kitchen: z.string().optional(),
    basement: z.string().optional(),
    scope: z.string().optional(),
  }),
  
  moisture: z.object({
    psychrometrics: z.array(z.object({
      date: z.string(),
      location: z.string(),
      tempF: z.string(),
      rh: z.string(),
      gpp: z.string(),
      gd: z.string(),
    })).optional(),
    points: z.array(z.object({
      point: z.string(),
      room: z.string(),
      surface: z.string(),
      reading: z.string(),
      notes: z.string().optional(),
    })).optional(),
  }),
  
  equipment: z.object({
    dehus: z.array(z.object({
      name: z.string(),
      placed: z.string(),
      removed: z.string().optional(),
      powerKw: z.string().optional(),
      energyKwh: z.string().optional(),
      days: z.string().optional(),
    })).optional(),
    movers: z.array(z.object({
      name: z.string(),
      placed: z.string(),
      removed: z.string().optional(),
      energyKwh: z.string().optional(),
      days: z.string().optional(),
    })).optional(),
    scrubbers: z.array(z.object({
      name: z.string(),
      placed: z.string(),
      removed: z.string().optional(),
      energyKwh: z.string().optional(),
      days: z.string().optional(),
    })).optional(),
  }),
  
  photos: z.array(z.object({
    caption: z.string().optional(),
    file: z.string(), // base64 dataURL
  })).optional(),
});

// Default values for the form
export const defaultValues = {
  company: {
    name: '',
    phone: '',
    email: '',
    address: '',
    logoUrl: '',
  },
  policyholder: {
    name: '',
    phone: '',
    address: '',
  },
  claim: {
    typeOfLoss: 'Water',
    claimId: '',
    carrier: '',
    adjuster: '',
    dateOfLoss: '',
    summary: '',
  },
  notes: {
    general: '',
    kitchen: '',
    basement: '',
    scope: '',
  },
  moisture: {
    psychrometrics: [
      { date: '', location: '', tempF: '', rh: '', gpp: '', gd: '' }
    ],
    points: [
      { point: '', room: '', surface: '', reading: '', notes: '' }
    ],
  },
  equipment: {
    dehus: [
      { name: '', placed: '', removed: '', powerKw: '', energyKwh: '', days: '' }
    ],
    movers: [
      { name: '', placed: '', removed: '', energyKwh: '', days: '' }
    ],
    scrubbers: [
      { name: '', placed: '', removed: '', energyKwh: '', days: '' }
    ],
  },
  photos: [],
};
