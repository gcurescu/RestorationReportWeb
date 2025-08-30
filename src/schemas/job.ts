import { z } from 'zod';

// Helper for numeric fields that converts empty strings to undefined
const optionalNumber = z.preprocess(
  (v) => v === '' || v === null || v === undefined ? undefined : Number(v), 
  z.number().optional()
);

const requiredNumber = z.preprocess(
  (v) => v === '' || v === null || v === undefined ? undefined : Number(v), 
  z.number({ message: 'Must be a number' })
);

// Define the main job schema
export const JobSchema = z.object({
  // Case Info fields
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

  // Property & Policy fields
  property: z.object({
    address: z.string().min(1, 'Property address is required'),
    insured: z.string().min(1, 'Insured name is required'),
    insurer: z.string().min(1, 'Insurance company is required'),
    policyNumber: z.string().min(1, 'Policy number is required'),
    deductible: requiredNumber,
    coverage: z.string().min(1, 'Coverage details required'),
    adjuster: z.string().min(1, 'Adjuster name is required'),
  }),

  // Affected Areas
  areas: z.array(z.object({
    name: z.string().min(1, 'Area name is required'),
    category: z.enum(['1', '2', '3']),
    class: z.enum(['1', '2', '3', '4']),
    materials: z.string().min(1, 'Materials affected is required'),
    cause: z.string().min(1, 'Cause description is required'),
    overviewNotes: z.string().optional(),
  })).min(1, 'At least one affected area is required'),

  // Equipment & Readings
  equipment: z.object({
    dehus: z.array(z.object({
      name: z.string().min(1, 'Equipment name is required'),
      placedISO: z.string().min(1, 'Placement date is required'),
      removedISO: z.string().optional(),
      powerKw: optionalNumber,
      energyKwh: optionalNumber,
      days: optionalNumber,
      area: z.string().optional(),
    })),
    movers: z.array(z.object({
      name: z.string().min(1, 'Equipment name is required'),
      placedISO: z.string().min(1, 'Placement date is required'),
      removedISO: z.string().optional(),
      energyKwh: optionalNumber,
      days: optionalNumber,
      area: z.string().optional(),
    })),
    scrubbers: z.array(z.object({
      name: z.string().min(1, 'Equipment name is required'),
      placedISO: z.string().min(1, 'Placement date is required'),
      removedISO: z.string().optional(),
      energyKwh: optionalNumber,
      days: optionalNumber,
      area: z.string().optional(),
    })),
    totals: z.object({
      dehusKwh: optionalNumber,
      moversKwh: optionalNumber,
      scrubbersKwh: optionalNumber,
      days: optionalNumber,
    }).optional(),
  }),
  moisture: z.object({
    psychrometrics: z.array(z.object({
      dateISO: z.string(),
      location: z.string(),
      tempF: requiredNumber,
      rh: requiredNumber,
      gpp: requiredNumber,
      grainDepression: optionalNumber,
    })),
    points: z.array(z.object({
      point: requiredNumber,
      room: z.string(),
      surface: z.string(),
      reading: z.string(),
      notes: z.string().optional(),
    })),
    unaffected: z.array(z.object({
      dateISO: z.string(),
      room: z.string(),
      rh: requiredNumber,
      gpp: requiredNumber,
      tempF: requiredNumber,
    })).optional(),
    hvac: z.array(z.object({
      dateISO: z.string(),
      room: z.string(),
      rh: requiredNumber,
      gpp: requiredNumber,
      tempF: requiredNumber,
    })).optional(),
  }),

  // Photos & Notes
  photos: z.array(z.object({
    caption: z.string().optional(),
    file: z.string(), // base64 dataURL
    time: z.string().optional(),
  })).optional(),
  notes: z.object({
    general: z.string().optional(),
    scope: z.string().optional(),
    kitchen: z.string().optional(),
    basement: z.string().optional(),
  }),
  logNotes: z.object({
    items: z.array(z.object({
      atISO: z.string(),
      author: z.string().optional(),
      source: z.enum(['email', 'call', 'note']).optional(),
      text: z.string(),
    })),
  }),

  // Costs & Signoff
  costs: z.object({
    labor: optionalNumber,
    materials: optionalNumber,
    equipment: optionalNumber,
    total: optionalNumber,
  }),
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

  // Additional fields from original schema
  calculators: z.object({
    dehu: z.array(z.object({
      atmosphere: z.string(),
      classOfWater: z.enum(['1', '2', '3', '4']),
      volumeFt3: requiredNumber,
      recommendedPintsPerDay: requiredNumber,
    })),
    airMovers: z.array(z.object({
      area: z.string(),
      floorFt2: requiredNumber,
      insetsOrOffsets: optionalNumber,
      recommendedMovers: requiredNumber,
    })),
  }).optional(),
  attachments: z.array(z.object({
    title: z.string(),
    note: z.string().optional(),
  })).optional(),
  floorPlan: z.object({
    image: z.string().optional(),
    legend: z.string().optional(),
  }).optional(),
  videos: z.array(z.object({
    label: z.string().optional(),
    file: z.string().optional(),
    thumbnail: z.string().optional(),
    timeISO: z.string().optional(),
  })).optional(),
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

// Default values for the wizard
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
    deductible: 0,
    coverage: '',
    adjuster: '',
  },
  areas: [
    {
      name: 'Kitchen',
      category: '1' as const,
      class: '1' as const,
      materials: '',
      cause: '',
      overviewNotes: '',
    }
  ],
  equipment: {
    dehus: [
      { name: '', placedISO: '', removedISO: '', powerKw: 0, energyKwh: 0, days: 0, area: '' }
    ],
    movers: [
      { name: '', placedISO: '', removedISO: '', energyKwh: 0, days: 0, area: '' }
    ],
    scrubbers: [
      { name: '', placedISO: '', removedISO: '', energyKwh: 0, days: 0, area: '' }
    ],
    totals: {
      dehusKwh: 0,
      moversKwh: 0,
      scrubbersKwh: 0,
      days: 0,
    },
  },
  moisture: {
    psychrometrics: [
      { dateISO: '', location: '', tempF: 0, rh: 0, gpp: 0, grainDepression: 0 }
    ],
    points: [
      { point: 1, room: '', surface: '', reading: '', notes: '' }
    ],
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
    labor: 0,
    materials: 0,
    equipment: 0,
    total: 0,
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
  attachments: [
    { title: 'Moisture Full Report', note: '' },
    { title: 'Moisture & Equipment Report', note: '' },
    { title: 'Mitigation Scope', note: '' },
    { title: 'Work Authorization', note: '' },
    { title: 'Health & Safety Consent', note: '' },
  ],
  floorPlan: {
    image: '',
    legend: '',
  },
  videos: [],
};

export type Job = z.infer<typeof JobSchema>;
