import { z } from 'zod';

// Helper for numeric fields that converts empty strings to undefined
const optionalNumber = z.preprocess(
  (v) => {
    if (v === '' || v === null || v === undefined) return undefined;
    const num = Number(v);
    return isNaN(num) ? undefined : num;
  }, 
  z.number().optional()
);

// Define the main job schema
export const JobSchema = z.object({
  // Case Info fields - Essential ones required
  jobName: z.string().min(1, 'Job name is required'),
  claimNumber: z.string().min(1, 'Claim number is required'),
  lossType: z.enum(['Water', 'Fire', 'Mold']),
  dateOfLoss: z.string().min(1, 'Date of loss is required'),
  inspectorName: z.string().min(1, 'Inspector name is required'),
  companyName: z.string().min(1, 'Company name is required'),
  contact: z.object({
    phone: z.string().min(1, 'Phone is required'),
    email: z.string().email('Valid email is required'),
    address: z.string().min(1, 'Address is required'),
  }),

  // Property & Policy fields - Made more flexible
  property: z.object({
    address: z.string().min(1, 'Property address is required'),
    insured: z.string().min(1, 'Insured name is required'),
    insurer: z.string().optional(),
    policyNumber: z.string().optional(),
    deductible: optionalNumber,
    coverage: z.string().optional(),
    adjuster: z.string().optional(),
  }),

  // Affected Areas - Make optional for MVP
  areas: z.array(z.object({
    name: z.string().optional(),
    category: z.enum(['1', '2', '3']).optional(),
    class: z.enum(['1', '2', '3', '4']).optional(),
    materials: z.string().optional(),
    cause: z.string().optional(),
    overviewNotes: z.string().optional(),
  })).optional().default([]),

  // Equipment & Readings - Make more optional for MVP
  equipment: z.object({
    dehus: z.array(z.object({
      name: z.string().optional(),
      placedISO: z.string().optional(),
      removedISO: z.string().optional(),
      powerKw: optionalNumber,
      energyKwh: optionalNumber,
      days: optionalNumber,
      area: z.string().optional(),
    })).optional().default([]),
    movers: z.array(z.object({
      name: z.string().optional(),
      placedISO: z.string().optional(),
      removedISO: z.string().optional(),
      energyKwh: optionalNumber,
      days: optionalNumber,
      area: z.string().optional(),
    })).optional().default([]),
    scrubbers: z.array(z.object({
      name: z.string().optional(),
      placedISO: z.string().optional(),
      removedISO: z.string().optional(),
      energyKwh: optionalNumber,
      days: optionalNumber,
      area: z.string().optional(),
    })).optional().default([]),
    totals: z.object({
      dehusKwh: optionalNumber,
      moversKwh: optionalNumber,
      scrubbersKwh: optionalNumber,
      days: optionalNumber,
    }).optional(),
  }).optional(),
  moisture: z.object({
    psychrometrics: z.array(z.object({
      dateISO: z.string().optional(),
      location: z.string().optional(),
      tempF: optionalNumber,
      rh: optionalNumber,
      gpp: optionalNumber,
      grainDepression: optionalNumber,
    })).optional().default([]),
    points: z.array(z.object({
      point: optionalNumber,
      room: z.string().optional(),
      surface: z.string().optional(),
      reading: z.string().optional(),
      notes: z.string().optional(),
    })).optional().default([]),
    unaffected: z.array(z.object({
      dateISO: z.string().optional(),
      room: z.string().optional(),
      rh: optionalNumber,
      gpp: optionalNumber,
      tempF: optionalNumber,
    })).optional().default([]),
    hvac: z.array(z.object({
      dateISO: z.string().optional(),
      room: z.string().optional(),
      rh: optionalNumber,
      gpp: optionalNumber,
      tempF: optionalNumber,
    })).optional().default([]),
  }).optional(),

  // Photos & Notes - Make more optional
  photos: z.array(z.object({
    caption: z.string().optional(),
    file: z.string(), // base64 dataURL
    time: z.string().optional(),
  })).optional().default([]),
  notes: z.object({
    general: z.string().optional(),
    scope: z.string().optional(),
    kitchen: z.string().optional(),
    basement: z.string().optional(),
  }).optional(),
  logNotes: z.object({
    items: z.array(z.object({
      atISO: z.string().optional(),
      author: z.string().optional(),
      source: z.enum(['email', 'call', 'note']).optional(),
      text: z.string().optional(),
    })).optional().default([]),
  }).optional(),

  // Costs & Signoff - Make optional
  costs: z.object({
    labor: optionalNumber,
    materials: optionalNumber,
    equipment: optionalNumber,
    total: optionalNumber,
  }).optional(),
  signoff: z.object({
    workAuth: z.object({
      customerName: z.string().optional(),
      signedAtISO: z.string().optional(),
      dataUrl: z.string().optional(),
    }).optional(),
    healthConsent: z.object({
      customerName: z.string().optional(),
      signedAtISO: z.string().optional(),
      dataUrl: z.string().optional(),
    }).optional(),
  }).optional(),

  // Additional fields from original schema - Make all optional
  calculators: z.object({
    dehu: z.array(z.object({
      atmosphere: z.string().optional(),
      classOfWater: z.enum(['1', '2', '3', '4']).optional(),
      volumeFt3: optionalNumber,
      recommendedPintsPerDay: optionalNumber,
    })).optional().default([]),
    airMovers: z.array(z.object({
      area: z.string().optional(),
      floorFt2: optionalNumber,
      insetsOrOffsets: optionalNumber,
      recommendedMovers: optionalNumber,
    })).optional().default([]),
  }).optional(),
  attachments: z.array(z.object({
    title: z.string().optional(),
    note: z.string().optional(),
  })).optional().default([]),
  floorPlan: z.object({
    image: z.string().optional(),
    legend: z.string().optional(),
  }).optional(),
  videos: z.array(z.object({
    label: z.string().optional(),
    file: z.string().optional(),
    thumbnail: z.string().optional(),
    timeISO: z.string().optional(),
  })).optional().default([]),
});

// Per-step validation schemas
export const StepSchemas = {
  caseInfo: JobSchema.pick({ 
    jobName: true, 
    claimNumber: true, 
    lossType: true, 
    dateOfLoss: true, 
    inspectorName: true, 
    companyName: true, 
    contact: true 
  }),
  propertyPolicy: JobSchema.pick({ 
    property: true 
  }),
  affectedAreas: JobSchema.pick({ 
    areas: true 
  }),
  equipmentReadings: JobSchema.pick({ 
    equipment: true, 
    moisture: true 
  }),
  photosNotes: JobSchema.pick({ 
    photos: true, 
    notes: true, 
    logNotes: true 
  }),
  costsSignoff: JobSchema.pick({ 
    costs: true, 
    signoff: true 
  }),
  full: JobSchema
};

// Default values for the wizard - Only essential fields have values
export const defaultJobValues = {
  jobName: '',
  claimNumber: '',
  lossType: 'Water' as const,
  dateOfLoss: '',
  inspectorName: '',
  companyName: 'Restoration Report',
  contact: {
    phone: '',
    email: '',
    address: '',
  },
  property: {
    address: '',
    insured: '',
    insurer: '',
    policyNumber: '',
    deductible: undefined,
    coverage: '',
    adjuster: '',
  },
  areas: [],
  equipment: {
    dehus: [],
    movers: [],
    scrubbers: [],
    totals: {
      dehusKwh: undefined,
      moversKwh: undefined,
      scrubbersKwh: undefined,
      days: undefined,
    },
  },
  moisture: {
    psychrometrics: [],
    points: [],
    unaffected: [],
    hvac: [],
  },
  photos: [],
  notes: {
    general: '',
    scope: '',
    kitchen: '',
    basement: '',
  },
  logNotes: {
    items: [],
  },
  costs: {
    labor: undefined,
    materials: undefined,
    equipment: undefined,
    total: undefined,
  },
  signoff: {
    workAuth: {
      customerName: '',
      signedAtISO: '',
      dataUrl: '',
    },
    healthConsent: {
      customerName: '',
      signedAtISO: '',
      dataUrl: '',
    },
  },
  calculators: {
    dehu: [],
    airMovers: [],
  },
  attachments: [],
  floorPlan: {
    image: '',
    legend: '',
  },
  videos: [],
};

export type Job = z.infer<typeof JobSchema>;
