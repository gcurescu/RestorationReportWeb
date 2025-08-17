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

  logNotes: z.object({
    items: z.array(z.object({
      atISO: z.string(),
      author: z.string().optional(),
      source: z.enum(['email', 'call', 'note']).optional(),
      text: z.string(),
    })),
  }),

  rooms: z.array(z.object({
    name: z.string(),
    overviewNotes: z.string().optional(),
    photos: z.array(z.object({
      caption: z.string().optional(),
      file: z.string(),
      timeISO: z.string().optional(),
    })),
  })),

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
  
  moisture: z.object({
    psychrometrics: z.array(z.object({
      dateISO: z.string(),
      location: z.string(),
      tempF: z.number(),
      rh: z.number(),
      gpp: z.number(),
      grainDepression: z.number().optional(),
    })),
    points: z.array(z.object({
      point: z.number(),
      room: z.string(),
      surface: z.string(),
      reading: z.string(),
      notes: z.string().optional(),
    })),
    unaffected: z.array(z.object({
      dateISO: z.string(),
      room: z.string(),
      rh: z.number(),
      gpp: z.number(),
      tempF: z.number(),
    })).optional(),
    hvac: z.array(z.object({
      dateISO: z.string(),
      room: z.string(),
      rh: z.number(),
      gpp: z.number(),
      tempF: z.number(),
    })).optional(),
  }),
  
  equipment: z.object({
    dehus: z.array(z.object({
      name: z.string(),
      placedISO: z.string(),
      removedISO: z.string().optional(),
      powerKw: z.number().optional(),
      energyKwh: z.number().optional(),
      days: z.number().optional(),
      area: z.string().optional(),
    })),
    movers: z.array(z.object({
      name: z.string(),
      placedISO: z.string(),
      removedISO: z.string().optional(),
      energyKwh: z.number().optional(),
      days: z.number().optional(),
      area: z.string().optional(),
    })),
    scrubbers: z.array(z.object({
      name: z.string(),
      placedISO: z.string(),
      removedISO: z.string().optional(),
      energyKwh: z.number().optional(),
      days: z.number().optional(),
      area: z.string().optional(),
    })),
    totals: z.object({
      dehusKwh: z.number().optional(),
      moversKwh: z.number().optional(),
      scrubbersKwh: z.number().optional(),
      days: z.number().optional(),
    }).optional(),
  }),

  calculators: z.object({
    dehu: z.array(z.object({
      atmosphere: z.string(),
      classOfWater: z.enum([1, 2, 3, 4]),
      volumeFt3: z.number(),
      recommendedPintsPerDay: z.number(),
    })),
    airMovers: z.array(z.object({
      area: z.string(),
      floorFt2: z.number(),
      insetsOrOffsets: z.number().optional(),
      recommendedMovers: z.number(),
    })),
  }).optional(),

  attachments: z.array(z.object({
    title: z.string(),
    note: z.string().optional(),
  })).optional(),

  signatures: z.object({
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
  
  photos: z.array(z.object({
    caption: z.string().optional(),
    file: z.string(), // base64 dataURL
    time: z.string().optional(),
  })).optional(),
});

// Default values for the form
export const defaultValues = {
  company: {
    name: 'Restoration Report',
    phone: '1-800-RESTORE',
    email: 'info@restorationreport.com',
    address: 'Professional Restoration Services',
    logoUrl: '/RestorationReportLogo.png',
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
  logNotes: {
    items: [],
  },
  rooms: [
    {
      name: 'Risk',
      overviewNotes: '',
      photos: [],
    },
    {
      name: 'Kitchen',
      overviewNotes: '',
      photos: [],
    },
    {
      name: 'Hardwood Floors',
      overviewNotes: '',
      photos: [],
    },
    {
      name: 'Basement',
      overviewNotes: '',
      photos: [],
    },
  ],
  floorPlan: {
    image: '',
    legend: '',
  },
  videos: [],
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
  signatures: {
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
  photos: [],
};
