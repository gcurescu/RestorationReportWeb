/**
 * Demo mode utilities for B2B demonstrations
 * Provides seeded data when URL includes ?demo=1
 */

const DEBUG = false; // Set to true for development debugging
const JOBS_KEY = 'rr_jobs';
const DEMO_FLAG_KEY = 'rr_demo_mode';

/**
 * Check if the app is in demo mode.
 * /app/jobs is always the demo experience — returns true unconditionally.
 */
export const isDemoMode = () => true;

/**
 * Generate a unique ID for demo jobs
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

/**
 * Create demo jobs with realistic data
 */
const createDemoJobs = () => {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  // Helper to create placeholder photo with proper structure
  const createPhoto = (caption, index) => ({
    caption,
    file: `https://via.placeholder.com/800x600/4299e1/ffffff?text=Photo+${index}`,
    timeISO: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  });

  const demoJobs = [
    // Job 1: Fully filled - Complete water damage restoration
    {
      id: generateId(),
      createdAt: lastWeek.toISOString(),
      updatedAt: yesterday.toISOString(),
      
      company: {
        name: 'Premier Restoration Services',
        phone: '(555) 123-4567',
        email: 'contact@premierrestoration.com',
        address: '123 Main Street, Suite 200, Chicago, IL 60601',
      },
      
      policyholder: {
        name: 'Sarah Johnson',
        phone: '(555) 987-6543',
        address: '456 Oak Avenue, Apartment 3B, Chicago, IL 60614',
      },
      
      claim: {
        claimId: 'WTR-2024-001847',
        typeOfLoss: 'Water',
        dateOfLoss: '2024-12-10',
        carrier: 'State Farm Insurance',
        adjuster: 'Michael Chen',
        summary: 'Significant water damage to first floor and basement resulting from a burst pipe in the main bathroom. Water affected kitchen, living room, and finished basement areas. Initial assessment indicates Class 2 water damage affecting carpet, drywall, and hardwood flooring. Immediate mitigation measures were deployed including water extraction, dehumidification, and air movement equipment. Affected materials have been documented and moisture readings taken at multiple points throughout the property.',
      },
      
      notes: {
        general: 'Property accessed at 8:30 AM on 12/10/2024. Homeowner was present during initial inspection. Water source identified as failed supply line to upstairs bathroom. Main water shutoff valve was closed immediately. Standing water was approximately 1-2 inches deep in the kitchen and adjacent living room areas. Basement had water seepage through ceiling. Emergency mitigation equipment deployed same day.',
        kitchen: 'Kitchen sustained water damage to hardwood flooring, lower cabinets, and baseboards. Approximately 200 sq ft of hardwood flooring affected. Cabinet kick plates showing signs of water absorption. Dishwasher and refrigerator inspected and appear unaffected. Moisture readings taken at multiple points. Two air movers and one dehumidifier placed strategically for optimal drying.',
        basement: 'Finished basement with carpet and drywall ceiling affected. Ceiling tiles showing water stains and slight sagging in northwest corner. Carpet pad completely saturated, carpet surface damp throughout 300 sq ft area. Two dehumidifiers and three air movers deployed. Furniture moved to dry areas. Recommend carpet and pad replacement after full assessment.',
        scope: 'Full scope to include: water extraction, structural drying (3-5 days estimated), removal and disposal of affected carpet and pad, drywall repair/replacement, hardwood floor assessment and possible refinishing, antimicrobial treatment, final moisture verification, and clearance testing.',
      },
      
      logNotes: {
        items: [
          {
            atISO: new Date(lastWeek.getTime() + 9 * 60 * 60 * 1000).toISOString(),
            author: 'Tech Team',
            source: 'call',
            text: 'Initial emergency call received. Water damage reported. Dispatch team immediately.',
          },
          {
            atISO: new Date(lastWeek.getTime() + 10 * 60 * 60 * 1000).toISOString(),
            author: 'Mike Rodriguez',
            source: 'note',
            text: 'On-site assessment complete. Water extraction begun. Equipment placement documented.',
          },
          {
            atISO: new Date(lastWeek.getTime() + 24 * 60 * 60 * 1000).toISOString(),
            author: 'Jennifer Park',
            source: 'note',
            text: 'Day 2 moisture readings showing good progress. All readings trending downward.',
          },
          {
            atISO: new Date(yesterday.getTime()).toISOString(),
            author: 'Mike Rodriguez',
            source: 'email',
            text: 'Adjuster scheduled to visit property tomorrow at 2 PM for final assessment.',
          },
        ],
      },
      
      rooms: [
        {
          name: 'Kitchen',
          overviewNotes: 'Main affected area with hardwood flooring damage and lower cabinet exposure to water.',
          photos: [
            createPhoto('Standing water in kitchen upon arrival', 1),
            createPhoto('Water damage to hardwood flooring', 2),
            createPhoto('Cabinet base showing water damage', 3),
            createPhoto('Equipment placement - air movers and dehumidifier', 4),
          ],
        },
        {
          name: 'Living Room',
          overviewNotes: 'Adjacent to kitchen, water spread to living room carpet and baseboards.',
          photos: [
            createPhoto('Water line visible on baseboards', 5),
            createPhoto('Carpet saturation assessment', 6),
            createPhoto('Air mover placement near wet areas', 7),
          ],
        },
        {
          name: 'Basement',
          overviewNotes: 'Finished basement with carpet and ceiling damage from water seepage.',
          photos: [
            createPhoto('Ceiling water stains and sagging', 8),
            createPhoto('Saturated carpet and pad', 9),
            createPhoto('Dehumidifier placement in basement', 10),
          ],
        },
        {
          name: 'Upstairs Bathroom',
          overviewNotes: 'Source of water damage - failed supply line identified and shut off.',
          photos: [
            createPhoto('Failed pipe connection point', 11),
            createPhoto('Water shutoff valve location', 12),
          ],
        },
      ],
      
      photos: [
        createPhoto('Property exterior overview', 1),
        createPhoto('Entry point documentation', 2),
        createPhoto('Overall water damage extent', 3),
        createPhoto('Kitchen standing water', 4),
        createPhoto('Living room affected area', 5),
        createPhoto('Basement ceiling damage', 6),
        createPhoto('Equipment setup overview', 7),
        createPhoto('Moisture meter readings', 8),
        createPhoto('Dehumidifier placement', 9),
      ],
      
      moisture: {
        psychrometrics: [
          { dateISO: lastWeek.toISOString(), location: 'Kitchen', tempF: 68, rh: 78, gpp: 124.5, grainDepression: 12 },
          { dateISO: lastWeek.toISOString(), location: 'Living Room', tempF: 67, rh: 82, gpp: 131.2, grainDepression: 8 },
          { dateISO: lastWeek.toISOString(), location: 'Basement', tempF: 64, rh: 88, gpp: 139.8, grainDepression: 5 },
        ],
        points: [
          { point: 1, room: 'Kitchen', surface: 'Hardwood Floor', reading: '28%', notes: 'Elevated moisture' },
          { point: 2, room: 'Kitchen', surface: 'Baseboard', reading: '32%', notes: 'Significant saturation' },
          { point: 3, room: 'Living Room', surface: 'Carpet', reading: '45%', notes: 'Heavy saturation' },
          { point: 4, room: 'Basement', surface: 'Drywall Ceiling', reading: '38%', notes: 'Affected area' },
        ],
        unaffected: [
          { dateISO: lastWeek.toISOString(), room: 'Upstairs Bedroom', rh: 42, gpp: 58.3, tempF: 70 },
        ],
        hvac: [],
      },
      
      equipment: {
        dehus: [
          { name: 'Dehumidifier 1 - LGR 2800i', placedISO: lastWeek.toISOString(), powerKw: 2.8, energyKwh: 67.2, days: 1, area: 'Kitchen/Living Room' },
          { name: 'Dehumidifier 2 - LGR 2800i', placedISO: lastWeek.toISOString(), powerKw: 2.8, energyKwh: 67.2, days: 1, area: 'Basement' },
        ],
        movers: [
          { name: 'Air Mover 1', placedISO: lastWeek.toISOString(), energyKwh: 8.4, days: 1, area: 'Kitchen' },
          { name: 'Air Mover 2', placedISO: lastWeek.toISOString(), energyKwh: 8.4, days: 1, area: 'Living Room' },
          { name: 'Air Mover 3', placedISO: lastWeek.toISOString(), energyKwh: 8.4, days: 1, area: 'Basement' },
        ],
        scrubbers: [],
        totals: { dehusKwh: 134.4, moversKwh: 25.2, scrubbersKwh: 0, days: 1 },
      },
    },

    // Job 2: In Progress - Fire damage assessment
    {
      id: generateId(),
      createdAt: twoWeeksAgo.toISOString(),
      updatedAt: now.toISOString(),
      
      company: {
        name: 'Rapid Response Restoration',
        phone: '(555) 234-5678',
        email: 'info@rapidresponse.com',
        address: '789 Industrial Parkway, Chicago, IL 60622',
      },
      
      policyholder: {
        name: 'Robert Martinez',
        phone: '(555) 876-5432',
        address: '321 Pine Street, Chicago, IL 60610',
      },
      
      claim: {
        claimId: 'FIRE-2024-000923',
        typeOfLoss: 'Fire',
        dateOfLoss: '2024-11-28',
        carrier: 'Allstate Insurance',
        adjuster: 'Lisa Thompson',
        summary: 'Kitchen fire resulting from unattended cooking. Fire contained to kitchen area but smoke damage extends throughout first floor. Significant soot and odor present. Fire department responded and extinguished blaze. Assessment in progress for fire, smoke, and water damage from firefighting efforts.',
      },
      
      notes: {
        general: 'Emergency response on 11/28/2024. Fire department had already extinguished the blaze before our arrival. Kitchen shows direct fire damage to stove area, cabinets, and ceiling. Smoke residue visible throughout first floor. Water damage from fire suppression efforts noted on kitchen floor and adjacent dining area. Initial emergency board-up completed.',
        kitchen: 'Kitchen is primary damage area. Fire originated at stovetop and spread to overhead cabinets and ceiling. Significant charring visible on upper cabinets and range hood. Smoke staining on all surfaces. Assessment ongoing for structural integrity.',
        scope: 'Preliminary scope includes: emergency board-up (completed), contents pack-out, demolition of fire-damaged materials, smoke and soot cleaning throughout first floor, odor remediation, water extraction and drying, structural assessment, and full restoration. Detailed scope pending adjuster inspection.',
      },
      
      logNotes: {
        items: [
          {
            atISO: new Date(twoWeeksAgo.getTime() + 18 * 60 * 60 * 1000).toISOString(),
            author: 'Dispatch',
            source: 'call',
            text: 'Emergency fire damage call. Deploying team immediately with board-up supplies.',
          },
          {
            atISO: new Date(twoWeeksAgo.getTime() + 20 * 60 * 60 * 1000).toISOString(),
            author: 'Carlos Mendez',
            source: 'note',
            text: 'Emergency board-up complete. Property secured. Initial photo documentation done.',
          },
          {
            atISO: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
            author: 'Lisa Thompson',
            source: 'email',
            text: 'Adjuster inspection scheduled for next week. Proceed with contents inventory.',
          },
        ],
      },
      
      rooms: [
        {
          name: 'Kitchen',
          overviewNotes: 'Primary fire damage area. Stovetop, cabinets, and ceiling heavily damaged.',
          photos: [
            createPhoto('Fire damage to stove and cabinets', 13),
            createPhoto('Charred ceiling and range hood', 14),
            createPhoto('Smoke damage throughout kitchen', 15),
          ],
        },
        {
          name: 'Dining Room',
          overviewNotes: 'Adjacent to kitchen. Smoke damage and water from firefighting.',
          photos: [
            createPhoto('Smoke residue on walls and ceiling', 16),
            createPhoto('Water damage from fire suppression', 17),
          ],
        },
      ],
      
      photos: [
        createPhoto('Exterior showing fire department access', 18),
        createPhoto('Kitchen fire damage overview', 19),
        createPhoto('Cabinet charring and destruction', 20),
        createPhoto('Ceiling damage assessment', 21),
        createPhoto('Smoke damage in adjacent rooms', 22),
        createPhoto('Emergency board-up completion', 23),
      ],
      
      moisture: {
        psychrometrics: [],
        points: [],
        unaffected: [],
        hvac: [],
      },
      
      equipment: {
        dehus: [],
        movers: [],
        scrubbers: [
          { name: 'Air Scrubber 1 - HEPA', placedISO: twoWeeksAgo.toISOString(), energyKwh: 24.0, days: 3, area: 'Kitchen/First Floor' },
        ],
        totals: { dehusKwh: 0, moversKwh: 0, scrubbersKwh: 24.0, days: 3 },
      },
    },

    // Job 3: Small/Simple - Minor mold remediation
    {
      id: generateId(),
      createdAt: yesterday.toISOString(),
      updatedAt: now.toISOString(),
      
      company: {
        name: 'QuickFix Restoration',
        phone: '(555) 345-6789',
        email: 'service@quickfixrestoration.com',
        address: '555 Commerce Drive, Chicago, IL 60607',
      },
      
      policyholder: {
        name: 'Emily Chen',
        phone: '(555) 765-4321',
        address: '789 Maple Lane, Unit 12, Chicago, IL 60615',
      },
      
      claim: {
        claimId: 'MOLD-2024-000456',
        typeOfLoss: 'Mold',
        dateOfLoss: '2025-01-05',
        carrier: 'Liberty Mutual',
        adjuster: 'David Kim',
        summary: 'Small mold growth discovered in bathroom behind toilet. Appears to be result of slow leak from supply line. Limited to approximately 3 square feet area. No structural damage observed.',
      },
      
      notes: {
        general: 'Small localized mold growth in bathroom. Homeowner discovered issue during routine cleaning. Supply line leak identified and repaired by plumber prior to our arrival. Mold confined to drywall behind toilet. Quick remediation scheduled.',
        basement: 'No basement access required for this job.',
        scope: 'Small containment area, removal of affected drywall section (approximately 2ft x 2ft), HEPA vacuuming, antimicrobial treatment, and drywall replacement. Estimated 1-2 day job.',
      },
      
      logNotes: {
        items: [
          {
            atISO: yesterday.toISOString(),
            author: 'Office',
            source: 'call',
            text: 'Initial inquiry about bathroom mold. Scheduled assessment for today.',
          },
          {
            atISO: now.toISOString(),
            author: 'Tom Wilson',
            source: 'note',
            text: 'Assessment complete. Small contained area. Remediation can begin tomorrow.',
          },
        ],
      },
      
      rooms: [
        {
          name: 'Bathroom',
          overviewNotes: 'Small mold growth behind toilet from slow supply line leak.',
          photos: [
            createPhoto('Mold growth on drywall', 24),
            createPhoto('Supply line leak point', 25),
          ],
        },
      ],
      
      photos: [
        createPhoto('Bathroom overview', 26),
        createPhoto('Mold affected area close-up', 27),
        createPhoto('Leak source identification', 28),
      ],
      
      moisture: {
        psychrometrics: [
          { dateISO: yesterday.toISOString(), location: 'Bathroom', tempF: 69, rh: 68, gpp: 98.5, grainDepression: 15 },
        ],
        points: [
          { point: 1, room: 'Bathroom', surface: 'Drywall behind toilet', reading: '22%', notes: 'Elevated but drying' },
        ],
        unaffected: [],
        hvac: [],
      },
      
      equipment: {
        dehus: [],
        movers: [],
        scrubbers: [],
        totals: { dehusKwh: 0, moversKwh: 0, scrubbersKwh: 0, days: 0 },
      },
    },
  ];

  return demoJobs;
};

/**
 * Seed demo jobs into storage if none exist
 * Only runs when in demo mode
 */
export const ensureDemoSeed = () => {
  if (!isDemoMode()) return;

  try {
    const existingJobs = localStorage.getItem(JOBS_KEY);
    const jobs = existingJobs ? JSON.parse(existingJobs) : [];

    // Only seed if there are no jobs
    if (jobs.length === 0) {
      const demoJobs = createDemoJobs();
      localStorage.setItem(JOBS_KEY, JSON.stringify(demoJobs));
      localStorage.setItem(DEMO_FLAG_KEY, 'true');
      if (DEBUG) console.log('Demo jobs seeded successfully');
    }
  } catch (error) {
    if (DEBUG) console.error('Error seeding demo jobs:', error);
  }
};

/**
 * Clear all jobs and re-seed demo data
 * Only works in demo mode
 */
export const resetDemo = () => {
  if (!isDemoMode()) {
    if (DEBUG) console.warn('Reset demo only works in demo mode');
    return;
  }

  try {
    // Clear existing jobs
    localStorage.removeItem(JOBS_KEY);
    
    // Re-seed
    const demoJobs = createDemoJobs();
    localStorage.setItem(JOBS_KEY, JSON.stringify(demoJobs));
    localStorage.setItem(DEMO_FLAG_KEY, 'true');
    
    if (DEBUG) console.log('Demo reset successfully');
    return true;
  } catch (error) {
    if (DEBUG) console.error('Error resetting demo:', error);
    return false;
  }
};

const demoSeed = {
  isDemoMode,
  ensureDemoSeed,
  resetDemo,
};

export default demoSeed;
