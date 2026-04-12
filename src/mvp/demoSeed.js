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
        summary: 'Cat 1 water intrusion from a failed supply line at the 2nd-floor bathroom. Source secured on arrival. Standing water present in kitchen and living room (~1–2" depth). Secondary intrusion through basement ceiling confirmed. Class 2 conditions — moisture wicked into hardwood flooring, wall cavities, and framing. Extraction and structural drying equipment deployed same day. Carpet and pad in living room and basement require removal; hardwood salvage TBD at Day 3 re-check.',
      },
      
      notes: {
        general: 'Accessed property at 08:30 on 12/10/2024. Homeowner on-site. Failed supply line to upstairs bathroom — main shutoff closed by homeowner prior to our arrival. Standing water ~1–2" in kitchen and living room. Basement ceiling deflecting in NW corner with active drip. Emergency extraction and equipment deployment completed same day. All readings logged at initial setup.',
        kitchen: '~200 sq ft hardwood flooring affected. Early cupping visible along seams — moisture content 26–32% (reference: 7–9%). Lower cabinet toe kicks absorbing; drywall wicking to ~20" height at wet wall. Dishwasher and refrigerator undamaged. Two air movers and one LGR dehumidifier placed. Hardwood salvage to be re-evaluated at Day 3.',
        basement: 'Finished basement. Drywall ceiling water-stained and light deflection in NW corner from overhead intrusion. Carpet pad fully saturated; cannot be dried in-place — scheduled for removal. ~300 sq ft affected. Two dehumidifiers and three air movers deployed. Contents moved to dry zone. Subfloor moisture readings pending after carpet removal.',
        scope: 'Water extraction (complete). Structural drying — 3–5 days estimated per current psychrometrics. Living room and basement carpet/pad removal and disposal. Hardwood assessment at Day 3. Lower drywall removal TBD per moisture readings. Antimicrobial treatment on all affected structural surfaces post dry-down. Final moisture verification and clearance prior to reconstruction.',
      },
      
      logNotes: {
        items: [
          {
            atISO: new Date(lastWeek.getTime() + 9 * 60 * 60 * 1000).toISOString(),
            author: 'Dispatch',
            source: 'call',
            text: 'Emergency call received — active water loss, 2nd floor supply line. Crew dispatched with extraction equipment.',
          },
          {
            atISO: new Date(lastWeek.getTime() + 10 * 60 * 60 * 1000).toISOString(),
            author: 'Mike Rodriguez',
            source: 'note',
            text: 'On-site. Source confirmed shut. Extracted standing water from kitchen and living room. Psychrometrics logged. Equipment placed — 2 dehus, 5 air movers.',
          },
          {
            atISO: new Date(lastWeek.getTime() + 24 * 60 * 60 * 1000).toISOString(),
            author: 'Jennifer Park',
            source: 'note',
            text: 'Day 2 readings: all zones tracking downward. Kitchen hardwood still elevated at 24% — monitoring closely. Equipment positions unchanged.',
          },
          {
            atISO: new Date(yesterday.getTime()).toISOString(),
            author: 'Mike Rodriguez',
            source: 'email',
            text: 'Adjuster confirmed for tomorrow at 14:00. Carpet and pad removal scheduled for same visit pending adjuster sign-off.',
          },
        ],
      },
      
      rooms: [
        {
          name: 'Kitchen',
          overviewNotes: 'Primary affected area. Hardwood flooring showing early cupping (MC 26–32%). Wicking confirmed in drywall to ~20" height. Lower cabinet toe kicks saturated. Air movers and dehumidifier placed.',
          photos: [
            createPhoto('Standing water at kitchen entry on arrival', 1),
            createPhoto('Hardwood cupping along seams — Day 1', 2),
            createPhoto('Drywall wicking at baseboard level', 3),
            createPhoto('Equipment placement — air movers and dehumidifier', 4),
          ],
        },
        {
          name: 'Living Room',
          overviewNotes: 'Adjacent to kitchen. Water spread via open floor plan. Carpet and pad fully saturated — removal required. Baseboards showing moisture intrusion. Air mover placed.',
          photos: [
            createPhoto('Waterline on baseboard — moisture migration path', 5),
            createPhoto('Carpet probe reading — full saturation', 6),
            createPhoto('Air mover position at wet perimeter', 7),
          ],
        },
        {
          name: 'Basement',
          overviewNotes: 'Finished basement. Secondary intrusion through ceiling from above. Drywall ceiling deflecting in NW corner. Carpet and pad saturated throughout ~300 sq ft. Two dehus deployed.',
          photos: [
            createPhoto('Ceiling water staining and deflection — NW corner', 8),
            createPhoto('Carpet saturation — probe at pad level', 9),
            createPhoto('Dehumidifier placement and air movement setup', 10),
          ],
        },
        {
          name: 'Upstairs Bathroom',
          overviewNotes: 'Loss origin. Failed compression fitting on supply line to toilet. Shutoff valve confirmed closed. No structural damage to bathroom floor or subfloor observed.',
          photos: [
            createPhoto('Failed supply line fitting — loss origin', 11),
            createPhoto('Shutoff valve — confirmed closed on arrival', 12),
          ],
        },
      ],
      
      photos: [
        createPhoto('Exterior — property overview at arrival', 1),
        createPhoto('Front entry — no exterior damage noted', 2),
        createPhoto('Kitchen — standing water extent on arrival', 3),
        createPhoto('Kitchen — hardwood cupping, Day 1', 4),
        createPhoto('Living room — carpet saturation', 5),
        createPhoto('Basement — ceiling deflection, NW corner', 6),
        createPhoto('Dehumidifier and air mover setup overview', 7),
        createPhoto('Moisture meter reading — kitchen hardwood', 8),
        createPhoto('Equipment placement — basement zone', 9),
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
        summary: 'Kitchen fire from unattended cooking. Fire confined to kitchen; smoke and soot migrated through open floor plan to dining room and first-floor hallway. Fire department extinguished prior to arrival. HVAC shut down on arrival to prevent further soot distribution. Suppression water on kitchen floor extracted. Emergency board-up complete. Full scope pending adjuster walk — contents pack-out and dry soot cleaning are immediate priorities.',
      },
      
      notes: {
        general: 'On-site at 18:45 on 11/28/2024. Fire department had cleared the scene. Smoke odor throughout first floor. HVAC shut down immediately — filter and supply registers coated with fine soot. No structural compromise observed at this time; framing above stovetop area to be reassessed after cabinet demolition. Emergency board-up to rear kitchen window completed.',
        kitchen: 'Direct fire damage. Stovetop, upper cabinets, range hood, and ceiling field show heavy char. Protein-based smoke residue on all surfaces — greasy film on cabinets, walls, and appliances. Suppression water extracted from floor. Structural ceiling framing exposed in ~15 sq ft area above range — to be assessed by licensed contractor. Lower cabinets and countertop intact; salvageability TBD post-demo.',
        scope: 'Emergency board-up (complete). HVAC shutdown (complete). Water extraction (complete). Pending: contents inventory and pack-out; kitchen demo of charred materials; dry soot cleaning throughout first floor; duct cleaning and HVAC filter replacement; odor treatment (thermal fog or hydroxyl); structural assessment of exposed ceiling framing; full restoration scope to follow adjuster inspection.',
      },
      
      logNotes: {
        items: [
          {
            atISO: new Date(twoWeeksAgo.getTime() + 18 * 60 * 60 * 1000).toISOString(),
            author: 'Dispatch',
            source: 'call',
            text: 'Emergency call — kitchen fire, fire dept. on scene. Crew en route with board-up and extraction equipment.',
          },
          {
            atISO: new Date(twoWeeksAgo.getTime() + 20 * 60 * 60 * 1000).toISOString(),
            author: 'Carlos Mendez',
            source: 'note',
            text: 'On-site. HVAC shut down. Suppression water extracted. Board-up to rear window complete. Full photo and soot mapping done. HEPA scrubbers running.',
          },
          {
            atISO: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
            author: 'Lisa Thompson',
            source: 'email',
            text: 'Adjuster walk set for next Thursday AM. Contents inventory approved — pack-out can begin prior to inspection.',
          },
        ],
      },
      
      rooms: [
        {
          name: 'Kitchen',
          overviewNotes: 'Primary burn zone. Heavy char on upper cabinets, range hood, and ceiling. Protein smoke on all surfaces. Suppression water extracted. Structural framing exposed above range — assessment pending.',
          photos: [
            createPhoto('Range and upper cabinet char — loss origin', 13),
            createPhoto('Ceiling field — char and exposed framing above range', 14),
            createPhoto('Smoke and soot deposit on cabinet faces and walls', 15),
          ],
        },
        {
          name: 'Dining Room',
          overviewNotes: 'No direct fire exposure. Protein smoke residue on walls and ceiling. Soot visible on horizontal surfaces. HVAC register coated — system offline.',
          photos: [
            createPhoto('Smoke residue on ceiling and upper walls', 16),
            createPhoto('Soot deposit on dining table and horizontal surfaces', 17),
          ],
        },
      ],
      
      photos: [
        createPhoto('Exterior — fire dept. access point documented', 18),
        createPhoto('Kitchen — overall loss extent, Day 1', 19),
        createPhoto('Upper cabinet char and range hood damage', 20),
        createPhoto('Ceiling framing exposed above range', 21),
        createPhoto('Dining room — smoke migration and soot deposits', 22),
        createPhoto('Board-up complete — rear kitchen window', 23),
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
        summary: 'Visible microbial growth on drywall substrate in 1st-floor bathroom — approximately 4–6 sq ft behind toilet. Growth consistent with sustained elevated moisture from a slow-running supply line compression fitting. Plumber confirmed repair prior to this assessment. Moisture source is resolved. No visible growth outside the bathroom. Remediation scope is localized — containment, drywall removal, and biocide treatment. No full-floor disruption anticipated.',
      },
      
      notes: {
        general: 'Homeowner noticed discoloration behind toilet during cleaning. Called plumber first — supply line fitting replaced prior to our arrival; no active moisture present. Moisture meter readings on adjacent drywall elevated at 18–22% (reference material 9–11%). Growth limited to face paper and substrate of one drywall section. No odor in adjacent rooms; no visible cross-contamination to ceiling or floor tile.',
        scope: 'Establish poly containment with negative air and HEPA filtration. Remove affected drywall with 12" clearance beyond visible growth boundary. Inspect framing and subfloor for secondary growth after demo. HEPA-vacuum all surfaces in containment. Apply EPA-registered biocide to all structural surfaces. Re-inspect framing 24 hours post-treatment. Post-remediation clearance required before reconstruction. Estimated 1–2 days.',
      },
      
      logNotes: {
        items: [
          {
            atISO: yesterday.toISOString(),
            author: 'Office',
            source: 'call',
            text: 'Homeowner reporting mold behind toilet — plumber already addressed the leak. Scheduled assessment for next morning.',
          },
          {
            atISO: now.toISOString(),
            author: 'Tom Wilson',
            source: 'note',
            text: 'Assessment complete. Growth localized to drywall behind toilet — ~4–6 sq ft. No active moisture. Readings 18–22% on adjacent material. Containment and remediation scheduled for tomorrow AM.',
          },
        ],
      },
      
      rooms: [
        {
          name: 'Bathroom',
          overviewNotes: 'Visible growth on drywall face and paper backing behind toilet. ~4–6 sq ft affected. Moisture source (supply line) confirmed repaired. Adjacent tile and subfloor have no visible growth. Elevated moisture readings on adjacent drywall — to be re-checked after removal.',
          photos: [
            createPhoto('Visible mold growth on drywall behind toilet', 24),
            createPhoto('Repaired supply line fitting — confirmed no active moisture', 25),
          ],
        },
      ],
      
      photos: [
        createPhoto('Bathroom overview — affected area location', 26),
        createPhoto('Close-up — mold growth boundary on drywall', 27),
        createPhoto('Moisture meter reading on adjacent drywall', 28),
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
