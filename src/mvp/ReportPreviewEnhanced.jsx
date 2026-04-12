import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SlimNav } from '../components/nav/SlimNav';
import { getJob } from './storage';
import PhotoGrid from './components/PhotoGrid';
import { normalizeJob } from './normalizeJob';

const ReportPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const reportRef = useRef();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [totalPages, setTotalPages] = useState(15);
  const [tocSections, setTocSections] = useState([]);
  const [pdfProgress, setPdfProgress] = useState({ current: 0, total: 0 });
  const [reportScale, setReportScale] = useState(1);

  // Define sections for Table of Contents (stable reference)
  const sections = useMemo(() => ([
    { title: 'Claim Summary', dataSection: 'claim-summary' },
    { title: 'Table of Contents', dataSection: 'table-of-contents' },
    { title: 'General Notes', dataSection: 'general-notes' },
    { title: 'Risk — Overview Photos, Log Notes, Room Notes', dataSection: 'risk-overview' },
    { title: 'Room: Kitchen — Overview Photos', dataSection: 'room-kitchen' },
    { title: 'Floor Plan — Floor Plan 1', dataSection: 'floor-plan' },
    { title: 'Room: Hardwood Floors — Overview Photos', dataSection: 'room-hardwood' },
    { title: 'Room: Basement — Overview Photos', dataSection: 'room-basement' },
    { title: 'Attachments', dataSection: 'attachments' },
    { title: 'Moisture FULL Report (Psychrometrics)', dataSection: 'moisture-psychrometrics' },
    { title: 'Moisture & Equipment Report', dataSection: 'moisture-equipment' },
    { title: 'Mitigation Scope (Sample)', dataSection: 'mitigation-scope' },
    { title: 'Work Authorization (Sample)', dataSection: 'work-authorization' },
    { title: 'Health & Safety Consent (Sample)', dataSection: 'health-safety' },
  ]), []);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const jobData = await getJob(id);
        if (!jobData) {
          navigate('/app/jobs');
          return;
        }
        // Normalize job data to ensure consistent schema
        setJob(normalizeJob(jobData));
      } catch (error) {
        console.error('Error loading job:', error);
        navigate('/app/jobs');
      } finally {
        setLoading(false);
      }
    };
    
    loadJob();
  }, [id, navigate]);

  useEffect(() => {
    // Count pages and calculate ToC after component mounts
    if (job && reportRef.current) {
      setTimeout(() => {
        const pages = reportRef.current.querySelectorAll('.rr-page');
        setTotalPages(pages.length);
        
        // Calculate dynamic page numbers for ToC
        const updatedSections = sections.map(section => {
          const pageElement = reportRef.current.querySelector(`[data-section="${section.dataSection}"]`);
          if (pageElement) {
            const pageIndex = Array.from(pages).indexOf(pageElement);
            return { ...section, page: pageIndex + 1 };
          }
          return { ...section, page: '—' };
        });
        setTocSections(updatedSections);
      }, 100);
    }
  }, [job, sections]);

  // Scale pages to fit the viewport width on mobile (zoom affects layout, unlike transform)
  useEffect(() => {
    const PAGE_WIDTH = 612;
    const calc = () => {
      const pad = window.innerWidth < 640 ? 8 : 16; // matches px-2 / sm:px-4
      setReportScale(Math.min(1, (window.innerWidth - pad * 2) / PAGE_WIDTH));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  const generatePDF = async () => {
    if (!reportRef.current) return;
    
    setGenerating(true);
    setPdfProgress({ current: 0, total: 0 });
    
    try {
      // Lazy load the PDF generation libraries
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);
      
      const pdf = new jsPDF('p', 'pt', 'letter');
      const pages = reportRef.current.querySelectorAll('.rr-page');
      
      setPdfProgress({ current: 0, total: pages.length });
      
      // Set PDF properties
      pdf.setProperties({
        title: `Restoration Report - ${job.claim?.claimId || 'Untitled'}`,
        subject: `${job.claim?.typeOfLoss} Damage Assessment`,
        author: job.company?.name || 'Restoration Report',
        creator: 'Restoration Report Web'
      });
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        
        // Update progress
        setPdfProgress({ current: i + 1, total: pages.length });
        
        // Update page numbers before capture
        const footers = page.querySelectorAll('.page-number');
        footers.forEach(footer => {
          footer.textContent = `Page ${i + 1} of ${pages.length}`;
        });
        
        const canvas = await html2canvas(page, {
          scale: 1, // Use 1:1 scale to avoid zoom issues
          useCORS: true,
          logging: false, // Disable console logs
          allowTaint: false,
          backgroundColor: '#ffffff',
        });
        
        // Use JPEG for photo-heavy pages to reduce file size
        const isPhotoHeavy = page.querySelector('.grid') && page.querySelectorAll('img').length > 2;
        const format = isPhotoHeavy ? 'JPEG' : 'PNG';
        const quality = isPhotoHeavy ? 0.85 : 1.0;
        
        const imgData = canvas.toDataURL(`image/${format.toLowerCase()}`, quality);
        
        // Letter size in points: 612x792
        const pdfWidth = 612;
        const pdfHeight = 792;
        
        // Calculate proper dimensions maintaining aspect ratio
        const canvasAspectRatio = canvas.width / canvas.height;
        const pdfAspectRatio = pdfWidth / pdfHeight;
        
        let finalWidth, finalHeight;
        
        if (canvasAspectRatio > pdfAspectRatio) {
          // Canvas is wider relative to its height
          finalWidth = pdfWidth;
          finalHeight = pdfWidth / canvasAspectRatio;
        } else {
          // Canvas is taller relative to its width
          finalHeight = pdfHeight;
          finalWidth = pdfHeight * canvasAspectRatio;
        }
        
        // Center the content
        const x = (pdfWidth - finalWidth) / 2;
        const y = (pdfHeight - finalHeight) / 2;
        
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, format, x, y, finalWidth, finalHeight);
      }
      
      const fileName = `restoration-report-${job.claim?.claimId || 'untitled'}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setGenerating(false);
      setPdfProgress({ current: 0, total: 0 });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading report...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Job not found</h2>
          <button
            onClick={() => navigate('/app/jobs')}
            className="text-blue-600 font-medium"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  // Reusable Components
  const PageHeader = ({ title, company = job.company }) => {
    // Filter out empty company contact fields
    const contactInfo = [company?.phone, company?.email].filter(Boolean);
    
    return (
      <div className="bg-[#0C2D48] text-white p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {company?.logoUrl && (
              <img src={company.logoUrl} alt="Company Logo" className="h-8 w-auto" />
            )}
            <div>
              <h1 className="text-lg font-bold">{company?.name || 'Restoration Report'}</h1>
            </div>
          </div>
          <div className="text-right text-sm">
            {contactInfo.length > 0 && (
              <div>{contactInfo.join(' • ')}</div>
            )}
            {!contactInfo.length && (
              <div>Professional Restoration Services</div>
            )}
            <div className="text-xs">{company?.address || 'Professional Restoration Services'}</div>
          </div>
        </div>
        {title && (
          <div className="mt-3 text-lg font-semibold text-blue-200">
            {title}
          </div>
        )}
        <div className="mt-2 h-px bg-white/30"></div>
      </div>
    );
  };

  const PageFooter = ({ pageNumber }) => (
    <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-slate-500 border-t pt-2">
      <span>Powered by Restoration Report</span>
      <span className="page-number">Page {pageNumber} of {totalPages}</span>
    </div>
  );

  const ReportTable = ({ title, headers, data, className = "" }) => (
    <div className={`mb-6 ${className}`}>
      <h3 className="font-semibold text-[#0C2D48] mb-3 text-sm border-b border-slate-200 pb-2">{title}</h3>
      <div className="overflow-x-auto -mx-0">
        <table className="w-full border border-slate-300 text-xs">
          <thead>
            <tr className="bg-[#0C2D48] text-white">
              {headers.map((header, index) => (
                <th key={index} className="border border-slate-300 px-2 py-2 text-left font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? data.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                {headers.map((header, cellIndex) => {
                  const key = header.toLowerCase().replace(/[^a-z0-9]/g, '');
                  const value = row[key] || row[Object.keys(row).find(k => 
                    k.toLowerCase().replace(/[^a-z0-9]/g, '') === key
                  )] || '-';
                  return (
                    <td key={cellIndex} className="border border-slate-300 px-2 py-1">
                      {value}
                    </td>
                  );
                })}
              </tr>
            )) : (
              <tr>
                <td colSpan={headers.length} className="border border-slate-300 px-2 py-2 text-center text-slate-500">
                  No data recorded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  

  const ScopeTable = () => {
    const scopeData = [
      { code: 'T001', operation: 'Testing', action: 'Moisture Content Assessment', qty: '1', unit: 'Complete', notes: 'Initial moisture levels documented' },
      { code: 'P001', operation: 'PPE', action: 'Personal Protective Equipment', qty: '1', unit: 'Set', notes: 'Standard safety equipment' },
      { code: 'SP001', operation: 'Site Protection', action: 'Plastic Containment', qty: '200', unit: 'Sq Ft', notes: '6 mil poly sheeting' },
      { code: 'E001', operation: 'Extraction', action: 'Water Extraction', qty: '500', unit: 'Sq Ft', notes: 'Standing water removal' },
      { code: 'TO001', operation: 'Tear Out', action: 'Drywall Removal', qty: '100', unit: 'Sq Ft', notes: '2 feet from floor' },
      { code: 'C001', operation: 'Cleaning', action: 'Antimicrobial Treatment', qty: '500', unit: 'Sq Ft', notes: 'EPA approved solution' },
      { code: 'EQ001', operation: 'Equipment', action: 'Dehumidifier Placement', qty: '3', unit: 'Units', notes: 'Commercial grade units' },
      { code: 'M001', operation: 'Monitoring & Trade Labor', action: 'Daily Moisture Monitoring', qty: '5', unit: 'Days', notes: 'Progress documentation' },
    ];

    return (
      <ReportTable
        title="Mitigation Scope"
        headers={['Code', 'Operation', 'Action', 'Qty', 'Unit/Variable', 'Notes']}
        data={scopeData}
      />
    );
  };

  // ─── Loss-type tailored copy ──────────────────────────────────────────────
  const getLossTypeCopy = (type) => {
    const t = (type || 'water').toLowerCase();
    if (t === 'fire') return {
      badge: 'Fire & Smoke',
      badgeColor: 'bg-orange-100 text-orange-800 border border-orange-200',
      summary: 'Fire and smoke damage has been documented throughout the affected areas. Soot and char residue is present on surfaces requiring professional cleaning and structural assessment. The HVAC system has been shut down to prevent cross-contamination. Odor neutralization protocols have been initiated.',
      observations: [
        'Char and soot residue confirmed on walls, ceilings, and contents in primary burn zone',
        'Smoke penetration identified in adjacent rooms not directly exposed to flame',
        'HVAC system shut down to prevent soot spread through ductwork',
        'Structural framing in burn zone assessed for load-bearing integrity',
      ],
      actions: [
        'Deploy HEPA air scrubbers immediately to address airborne particulate and odor',
        'Begin dry soot removal from all hard surfaces before any wet cleaning methods',
        'Apply encapsulant to smoke-damaged structural materials prior to reconstruction',
        'Remove and catalog salvageable contents for off-site ultrasonic cleaning',
        'Conduct clearance air quality test before reconstruction phase begins',
      ],
    };
    if (t === 'mold') return {
      badge: 'Mold Remediation',
      badgeColor: 'bg-green-100 text-green-800 border border-green-200',
      summary: 'Mold growth has been confirmed in the affected areas. The moisture source has been identified and corrected. Containment barriers are established with negative air pressure maintained per IICRC S520 and EPA remediation guidelines. Pre-remediation air quality sampling has been completed and logged.',
      observations: [
        'Visible mold growth confirmed on drywall and wood framing within containment zone',
        'Moisture source identified and corrected prior to remediation work commencing',
        'Negative air pressure containment established to prevent cross-contamination',
        'Pre-remediation air quality baseline samples collected and submitted to lab',
      ],
      actions: [
        'Maintain negative air pressure and containment integrity throughout the full remediation',
        'Remove and double-bag all visibly affected materials per IICRC S520 protocol',
        'HEPA-vacuum all structural surfaces within the containment boundary after removal',
        'Apply EPA-registered biocide to all remediated structural surfaces',
        'Collect post-remediation clearance samples before reconstruction can begin',
      ],
    };
    // Default: Water
    return {
      badge: 'Water Damage',
      badgeColor: 'bg-blue-100 text-blue-800 border border-blue-200',
      summary: 'Water intrusion has been documented throughout the affected areas. The source has been identified and controlled. Class 2 water damage is confirmed — moisture has penetrated beyond surface materials into structural components. Structural drying protocols per IICRC S500 are underway.',
      observations: [
        'Standing water extracted from kitchen and adjacent living areas upon arrival',
        'Elevated moisture readings confirmed in drywall, flooring, and structural framing',
        'Hardwood flooring in kitchen showing early signs of cupping — salvage window is narrow',
        'Basement ceiling shows water staining and light sagging from overhead intrusion',
      ],
      actions: [
        'Continue structural drying to IICRC S500 goals — estimated 3–5 days at current conditions',
        'Take and log daily psychrometric readings; adjust equipment placement as needed',
        'Re-evaluate hardwood flooring on Day 3 — determine salvage vs. replacement at that point',
        'Remove saturated carpet and pad from basement — cannot be effectively dried in-place',
        'Apply antimicrobial treatment to all affected structural surfaces after confirmed dry-down',
      ],
    };
  };

  const lossType = job.claim?.typeOfLoss || 'Water';
  const copy = getLossTypeCopy(lossType);

  return (
    <div className="min-h-screen bg-slate-100">
      <style jsx>{`
        @media print {
          .rr-page {
            width: 8.5in !important;
            height: 11in !important;
            page-break-after: always;
          }
          .no-print {
            display: none !important;
          }
        }
        .rr-page {
          width: 100%;
          min-width: 612px;
          max-width: 612px;
          min-height: 792px;
          margin: 0 auto;
          box-sizing: border-box;
        }
        .rr-report-scaler {
          /* zoom is applied via inline style; reset to 1 for browser print */
        }
        @media print {
          .rr-report-scaler {
            zoom: 1 !important;
          }
        }
      `}</style>
      
      {/* Sticky branded nav — hidden from PDF/print */}
      <div className="no-print">
        <SlimNav
          onLogoClick={() => navigate('/app/jobs')}
          action={
            <button
              onClick={generatePDF}
              disabled={generating}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-60 flex items-center gap-2 shadow transition-colors"
            >
              {generating ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {pdfProgress.total > 0 ? `${pdfProgress.current}/${pdfProgress.total}` : 'Generating…'}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="hidden sm:inline">Download PDF</span>
                  <span className="sm:hidden">PDF</span>
                </>
              )}
            </button>
          }
        />
      </div>

      {/* ── On-Screen Report Summary (excluded from PDF capture and browser print) ── */}
      <div className="no-print max-w-4xl mx-auto px-4 pt-6 pb-4 space-y-4">

        {/* Hero Job Card */}
        <div className="bg-[#0C2D48] text-white rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${copy.badgeColor}`}>
                  {copy.badge}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  In Progress
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                {job.policyholder?.name
                  ? `${job.policyholder.name} — ${lossType} Assessment`
                  : `${lossType} Damage Assessment`}
              </h2>
              <p className="text-blue-200 text-sm">{job.policyholder?.address || 'Address not recorded'}</p>
            </div>
            <div className="shrink-0 sm:text-right space-y-2">
              <div>
                <div className="text-blue-300 text-xs uppercase tracking-wide">Date of Loss</div>
                <div className="text-white font-semibold text-sm">
                  {job.claim?.dateOfLoss
                    ? new Date(job.claim.dateOfLoss).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                    : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-blue-300 text-xs uppercase tracking-wide">Claim #</div>
                <div className="text-white font-mono text-sm">{job.claim?.claimId || 'N/A'}</div>
              </div>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Carrier', value: job.claim?.carrier || '—' },
              { label: 'Adjuster', value: job.claim?.adjuster || '—' },
              { label: 'Reported By', value: job.company?.name || '—' },
              { label: 'Contact', value: job.policyholder?.phone || job.company?.phone || '—' },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-blue-300 text-xs uppercase tracking-wide mb-0.5">{label}</div>
                <div className="text-white text-sm font-medium truncate">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stat chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Affected Rooms', value: String(job.rooms?.length || (job.notes?.kitchen && job.notes?.basement ? 2 : job.notes?.kitchen || job.notes?.basement ? 1 : '—')) },
            { label: 'Photos Captured', value: String(job.photos?.length || 0) },
            { label: 'Equipment Placed', value: String((job.equipment?.dehus?.length || 0) + (job.equipment?.movers?.length || 0) + (job.equipment?.scrubbers?.length || 0)) },
            { label: 'Report Pages', value: String(totalPages) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm text-center">
              <div className="text-2xl font-bold text-slate-900">{value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Executive Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Executive Summary</h2>
          <p className="text-slate-700 leading-relaxed text-sm">
            {job.claim?.summary || copy.summary}
          </p>
        </div>

        {/* Observations + Recommended Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Observations</h2>
            <ul className="space-y-2.5">
              {copy.observations.map((obs, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {obs}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Recommended Actions</h2>
            <ol className="space-y-2.5">
              {copy.actions.map((action, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                  {action}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Affected Areas */}
        {(job.rooms?.length > 0 || job.notes?.kitchen || job.notes?.basement) && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Affected Areas</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {(job.rooms?.length > 0
                ? job.rooms
                : [
                    { name: 'Kitchen', overviewNotes: job.notes?.kitchen },
                    { name: 'Basement', overviewNotes: job.notes?.basement },
                  ].filter(r => r.overviewNotes)
              ).map((room, i) => (
                <div key={i} className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="font-semibold text-slate-800 text-sm mb-1">{room.name}</div>
                  <p className="text-xs text-slate-600 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {room.overviewNotes || 'Assessment notes not recorded.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Site Photos */}
        {job.photos?.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              Site Photos
              <span className="ml-2 normal-case font-normal text-slate-400">({job.photos.length} captured)</span>
            </h2>
            <PhotoGrid photos={job.photos.slice(0, 6)} columns={2} showPlaceholders={4} />
          </div>
        )}

        {/* Divider before full printable report */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed border-slate-300" />
          </div>
          <div className="relative flex justify-center">
            <div className="bg-slate-100 border border-slate-300 rounded-full px-4 py-1.5 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Full Printable Report</span>
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Mobile scale indicator */}
        {reportScale < 1 && (
          <div className="sm:hidden flex items-center justify-center gap-1.5 py-1">
            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span className="text-xs text-slate-400">Scaled to {Math.round(reportScale * 100)}% — full resolution PDF unaffected</span>
          </div>
        )}

      </div>

      {/* Report Container */}
      <div className="px-2 pb-8 sm:px-4">
        <div
          ref={reportRef}
          className="space-y-4 sm:space-y-6 rr-report-scaler"
          style={{ width: '612px', margin: '0 auto', zoom: generating ? 1 : reportScale }}
        >
          
          {/* Page 1: Cover / Claim Summary */}
          <div className="rr-page bg-white shadow-sm relative" data-section="claim-summary">
            <PageHeader title="Claim Summary" />
            
            <div className="px-4 pb-20">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Restoration Report</h1>
                <p className="text-base text-slate-600">{job.claim?.typeOfLoss} Damage Assessment</p>
                <p className="text-sm text-slate-500 mt-2">Professional Mitigation Services</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <h2 className="font-bold text-slate-900 mb-3 text-sm border-b pb-2">Policyholder Information</h2>
                  <div className="space-y-2 text-xs">
                    <div className="flex"><span className="w-16 font-medium">Name:</span> <span>{job.policyholder?.name || 'N/A'}</span></div>
                    <div className="flex"><span className="w-16 font-medium">Phone:</span> <span>{job.policyholder?.phone || 'N/A'}</span></div>
                    <div className="flex"><span className="w-16 font-medium">Address:</span> <span className="flex-1">{job.policyholder?.address || 'N/A'}</span></div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border">
                  <h2 className="font-bold text-slate-900 mb-3 text-sm border-b pb-2">Claim Details</h2>
                  <div className="space-y-2 text-xs">
                    <div className="flex"><span className="w-16 font-medium">Type:</span> <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">{job.claim?.typeOfLoss || 'N/A'}</span></div>
                    <div className="flex"><span className="w-16 font-medium">Claim ID:</span> <span className="font-mono">{job.claim?.claimId || 'N/A'}</span></div>
                    <div className="flex"><span className="w-16 font-medium">Carrier:</span> <span>{job.claim?.carrier || 'N/A'}</span></div>
                    <div className="flex"><span className="w-16 font-medium">Adjuster:</span> <span>{job.claim?.adjuster || 'N/A'}</span></div>
                    <div className="flex"><span className="w-16 font-medium">Date:</span> <span>{job.claim?.dateOfLoss ? new Date(job.claim.dateOfLoss).toLocaleDateString() : 'N/A'}</span></div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border">
                <h2 className="font-bold text-slate-900 mb-3 text-sm border-b pb-2">Claim Summary</h2>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {job.claim?.summary || 'No summary provided. This section would typically contain a detailed description of the loss event, initial findings, and preliminary assessment of the scope of work required for proper mitigation and restoration.'}
                </p>
              </div>
            </div>

            <PageFooter pageNumber={1} />
          </div>

          {/* Page 2: Table of Contents */}
          <div className="rr-page bg-white shadow-sm relative" data-section="table-of-contents">
            <PageHeader title="Table of Contents" />
            
            <div className="px-4 pb-20">
              <h1 className="text-xl font-bold text-slate-900 mb-6">Table of Contents</h1>
              
              <div className="space-y-2 text-sm">
                {tocSections.map((item, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-700">{item.title}</span>
                    <span className="text-slate-500">{item.page}</span>
                  </div>
                ))}
              </div>
            </div>

            <PageFooter pageNumber={2} />
          </div>

          {/* Page 3: General Notes */}
          <div className="rr-page bg-white shadow-sm relative" data-section="general-notes">
            <PageHeader title="General Notes" />
            
            <div className="px-4 pb-20">
              <h1 className="text-xl font-bold text-slate-900 mb-6">General Notes</h1>

              <div className="mb-8">
                <h2 className="font-semibold text-slate-900 mb-3 text-base">Project Overview</h2>
                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                  {job.notes?.general || 'This section contains general observations and initial assessment findings for the restoration project. Our certified technicians have completed a thorough evaluation of the affected areas to determine the scope of mitigation required.'}
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-slate-900 mb-3 text-base">Risk Assessment</h2>
                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                  Based on our assessment, the primary concern is preventing secondary damage through prompt and effective moisture control. Our mitigation strategy focuses on rapid stabilization and controlled drying to industry standards.
                </p>
              </div>

              <div className="mb-6">
                <h2 className="font-semibold text-slate-900 mb-3 text-base">Room Notes</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-slate-800 mb-2">• Kitchen</h3>
                    <p className="text-sm text-slate-600 ml-4">
                      {job.notes?.kitchen || 'Kitchen area assessed for water damage and potential equipment placement requirements.'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-slate-800 mb-2">• Basement</h3>
                    <p className="text-sm text-slate-600 ml-4">
                      {job.notes?.basement || 'Basement area evaluated for moisture levels and structural considerations.'}
                    </p>
                  </div>
                  
                  {job.notes?.scope && (
                    <div>
                      <h3 className="font-medium text-slate-800 mb-2">• Additional Scope Notes</h3>
                      <p className="text-sm text-slate-600 ml-4">{job.notes.scope}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <PageFooter pageNumber={3} />
          </div>

          {/* Page 4: Risk — Overview Photos, Log Notes, Room Notes */}
          <div className="rr-page bg-white shadow-sm relative" data-section="risk-overview">
            <PageHeader title="Risk — Overview Photos, Log Notes, Room Notes" />
            
            <div className="px-4 pb-20">
              <h1 className="text-xl font-bold text-slate-900 mb-6">Risk Assessment & Documentation</h1>

              <div className="mb-6">
                <h2 className="font-semibold text-slate-900 mb-3">Overview Photos</h2>
                <PhotoGrid photos={job.photos?.slice(0, 9)} columns={3} showPlaceholders={9} />
              </div>

              <div className="mb-6">
                <h2 className="font-semibold text-slate-900 mb-3">Log Notes</h2>
                <div className="bg-slate-50 p-4 rounded border text-sm">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="text-slate-500 w-20">12/15/2024</span>
                      <span className="text-slate-500 w-16">08:30</span>
                      <span>Initial assessment completed. Moisture detected in affected areas.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-slate-500 w-20">12/15/2024</span>
                      <span className="text-slate-500 w-16">09:15</span>
                      <span>Equipment deployment initiated. Containment established.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-slate-500 w-20">12/15/2024</span>
                      <span className="text-slate-500 w-16">10:00</span>
                      <span>Psychrometric readings documented. Drying process commenced.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="font-semibold text-slate-900 mb-3">Room Notes Summary</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="border rounded p-3 bg-slate-50">
                    <h3 className="font-medium mb-2">Primary Affected Areas</h3>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Kitchen: Water source containment and extraction completed</li>
                      <li>• Basement: Moisture levels monitored, equipment positioned</li>
                      <li>• Adjacent areas: Preventive measures implemented</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <PageFooter pageNumber={4} />
          </div>

          {/* Page 5: Room: Kitchen — Overview Photos */}
          <div className="rr-page bg-white shadow-sm relative" data-section="room-kitchen">
            <PageHeader title="Room: Kitchen — Overview Photos" />
            
            <div className="px-4 pb-20">
              <h1 className="text-xl font-bold text-slate-900 mb-6">Kitchen — Overview Photos</h1>

              <PhotoGrid photos={job.photos?.slice(9, 21)} columns={3} showPlaceholders={12} />

              <div className="mt-6">
                <h2 className="font-semibold text-slate-900 mb-3">Kitchen Assessment Notes</h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {job.notes?.kitchen || 'Kitchen area documentation shows water intrusion points and affected materials. Moisture readings indicate need for controlled drying process. Equipment placement optimized for airflow and accessibility.'}
                </p>
              </div>
            </div>

            <PageFooter pageNumber={5} />
          </div>

          {/* Page 6: Floor Plan */}
          <div className="rr-page bg-white shadow-sm relative" data-section="floor-plan">
            <PageHeader title="Floor Plan — Floor Plan 1" />
            
            <div className="px-4 pb-20">
              <h1 className="text-xl font-bold text-slate-900 mb-6">Floor Plan Diagram</h1>

              <div className="mb-6">
                <div className="w-full h-96 bg-slate-100 border-2 border-dashed border-slate-300 rounded flex items-center justify-center">
                  <div className="text-center text-slate-500">
                    <div className="text-4xl mb-2">📐</div>
                    <div className="font-medium">Floor Plan Diagram — Placeholder</div>
                    <div className="text-sm mt-2">Property layout with equipment placement locations</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-50 p-4 rounded border">
                  <h3 className="font-semibold mb-3">Legend</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span>Dehumidifiers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span>Air Movers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span>Affected Areas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span>Containment</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded border">
                  <h3 className="font-semibold mb-3">Equipment Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div>Dehumidifiers: {job.equipment?.dehus?.length || 0}</div>
                    <div>Air Movers: {job.equipment?.movers?.length || 0}</div>
                    <div>Air Scrubbers: {job.equipment?.scrubbers?.length || 0}</div>
                  </div>
                </div>
              </div>
            </div>

            <PageFooter pageNumber={6} />
          </div>

          {/* Page 7: Room: Hardwood Floors — Overview Photos */}
          <div className="rr-page bg-white shadow-sm relative" data-section="room-hardwood">
            <PageHeader title="Room: Hardwood Floors — Overview Photos" />
            
            <div className="px-4 pb-20">
              <h1 className="text-xl font-bold text-slate-900 mb-6">Hardwood Floors — Overview Photos</h1>

              <PhotoGrid photos={job.photos?.slice(21, 29)} columns={3} showPlaceholders={8} />

              <div className="mt-6">
                <h2 className="font-semibold text-slate-900 mb-3">Flooring Assessment</h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Hardwood flooring evaluation indicates moisture penetration and potential for cupping/warping. Drying strategy implemented to minimize damage and preserve existing materials where possible. Monitoring critical for optimal restoration outcome.
                </p>
              </div>
            </div>

            <PageFooter pageNumber={7} />
          </div>

          {/* Page 8: Room: Basement — Overview Photos */}
          <div className="rr-page bg-white shadow-sm relative" data-section="room-basement">
            <PageHeader title="Room: Basement — Overview Photos" />
            
            <div className="px-4 pb-20">
              <h1 className="text-xl font-bold text-slate-900 mb-6">Basement — Overview Photos</h1>

              <PhotoGrid photos={job.photos?.slice(29, 37)} columns={3} showPlaceholders={8} />

              <div className="mt-6">
                <h2 className="font-semibold text-slate-900 mb-3">Basement Assessment Notes</h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {job.notes?.basement || 'Basement area shows water intrusion requiring immediate attention. Foundation and structural elements assessed for integrity. Dehumidification and air circulation established to prevent secondary damage and microbial growth.'}
                </p>
              </div>
            </div>

            <PageFooter pageNumber={8} />
          </div>

          {/* Page 9: Attachments */}
          <div className="rr-page bg-white shadow-sm relative" data-section="attachments">
            <PageHeader title="Attachments" />
            
            <div className="px-4 pb-20">
              <h1 className="text-xl font-bold text-slate-900 mb-6">Attachments</h1>

              <p className="text-sm text-slate-600 mb-6">
                The following documents are included as part of this comprehensive restoration report:
              </p>

              <div className="space-y-3">
                {[
                  `Moisture_Full_Report_${job.claim?.claimId || 'CLAIM001'}.pdf`,
                  `Moisture_Equipment_Report_${job.claim?.claimId || 'CLAIM001'}.pdf`,
                  'Mitigation_Scope_2_0_Kitchen.pdf',
                  'Mitigation_Scope_2_0_Basement.pdf',
                  'Work_Authorization.pdf',
                  'Health_Safety_Consent.pdf',
                  'Equipment_Specifications.pdf',
                  'Daily_Monitoring_Logs.pdf',
                  'Photo_Documentation_Index.pdf',
                ].map((filename, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded border">
                    <div className="text-blue-600">📄</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{filename}</div>
                      <div className="text-xs text-slate-500">Supporting documentation</div>
                    </div>
                    <div className="text-xs text-slate-400">Attached</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
                <h3 className="font-semibold text-blue-900 mb-2">Document Access</h3>
                <p className="text-sm text-blue-800">
                  All attached documents are available digitally and can be accessed through your restoration report portal. 
                  Physical copies can be provided upon request.
                </p>
              </div>
            </div>

            <PageFooter pageNumber={9} />
          </div>

          {/* Page 10: Moisture FULL Report (Psychrometrics) */}
          <div className="rr-page bg-white shadow-sm relative" data-section="moisture-psychrometrics">
            <PageHeader title="Moisture FULL Report (Psychrometrics)" />
            
            <div className="px-4 pb-20">
              <h1 className="text-xl font-bold text-slate-900 mb-6">Daily Psychrometric Readings</h1>

              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Pre-drydown</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">In Progress</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">At Goal</span>
                </div>

                <ReportTable
                  title=""
                  headers={['Date', 'Location', 'Temp (°F)', 'RH (%)', 'GPP', 'Grain Depression']}
                  data={job.moisture?.psychrometrics}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <ReportTable
                  title="Moisture Points 1"
                  headers={['Point', 'Room', 'Surface', 'Reading', 'Notes']}
                  data={job.moisture?.points?.slice(0, Math.ceil((job.moisture?.points?.length || 4) / 4))}
                  className="text-xs"
                />
                <ReportTable
                  title="Moisture Points 2"
                  headers={['Point', 'Room', 'Surface', 'Reading', 'Notes']}
                  data={job.moisture?.points?.slice(Math.ceil((job.moisture?.points?.length || 4) / 4), Math.ceil((job.moisture?.points?.length || 4) / 2))}
                  className="text-xs"
                />
                <ReportTable
                  title="Moisture Points 3"
                  headers={['Point', 'Room', 'Surface', 'Reading', 'Notes']}
                  data={job.moisture?.points?.slice(Math.ceil((job.moisture?.points?.length || 4) / 2), Math.ceil((job.moisture?.points?.length || 4) * 3 / 4))}
                  className="text-xs"
                />
                <ReportTable
                  title="Moisture Points 4"
                  headers={['Point', 'Room', 'Surface', 'Reading', 'Notes']}
                  data={job.moisture?.points?.slice(Math.ceil((job.moisture?.points?.length || 4) * 3 / 4))}
                  className="text-xs"
                />
              </div>

              <div className="mt-6 p-4 bg-slate-50 rounded border">
                <h3 className="font-semibold text-slate-900 mb-2">Reading Progress Summary</h3>
                <p className="text-sm text-slate-600">
                  Moisture levels are being systematically monitored to ensure effective drying. Target moisture content 
                  will be achieved through controlled dehumidification and air movement.
                </p>
              </div>
            </div>

            <PageFooter pageNumber={10} />
          </div>

          {/* Page 11: Moisture & Equipment Report */}
          <div className="rr-page bg-white shadow-sm relative" data-section="moisture-equipment">
            <PageHeader title="Moisture & Equipment Report" />
            
            <div className="px-4 pb-20">
              <h1 className="text-xl font-bold text-slate-900 mb-6">Equipment Usage Report</h1>

              <ReportTable
                title="Dehumidifiers"
                headers={['Name/Model/ID', 'Placed', 'Removed', 'Power (kW)', 'Energy (kWh)', 'Days']}
                data={job.equipment?.dehus}
              />

              <ReportTable
                title="Air Movers"
                headers={['Name/ID', 'Placed', 'Removed', 'Energy (kWh)', 'Days']}
                data={job.equipment?.movers}
              />

              <ReportTable
                title="Air Scrubbers"
                headers={['Name/ID', 'Placed', 'Removed', 'Energy (kWh)', 'Days']}
                data={job.equipment?.scrubbers?.length > 0 ? job.equipment.scrubbers : [{ name: 'None', placed: 'N/A', removed: 'N/A', energykwh: 'N/A', days: 'N/A' }]}
              />

              <div className="mt-6 bg-slate-100 p-4 rounded">
                <h3 className="font-semibold text-slate-900 mb-3">Energy Consumption Totals</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Dehumidifiers</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {job.equipment?.dehus?.reduce((sum, item) => sum + (parseFloat(item.energykwh) || 0), 0).toFixed(1)} kWh
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Air Movers</div>
                    <div className="text-2xl font-bold text-green-600">
                      {job.equipment?.movers?.reduce((sum, item) => sum + (parseFloat(item.energykwh) || 0), 0).toFixed(1)} kWh
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Total Usage</div>
                    <div className="text-2xl font-bold text-slate-900">
                      {(
                        (job.equipment?.dehus?.reduce((sum, item) => sum + (parseFloat(item.energykwh) || 0), 0) || 0) +
                        (job.equipment?.movers?.reduce((sum, item) => sum + (parseFloat(item.energykwh) || 0), 0) || 0) +
                        (job.equipment?.scrubbers?.reduce((sum, item) => sum + (parseFloat(item.energykwh) || 0), 0) || 0)
                      ).toFixed(1)} kWh
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <PageFooter pageNumber={11} />
          </div>

          {/* Page 12: Mitigation Scope (Sample) */}
          <div className="rr-page bg-white shadow-sm relative" data-section="mitigation-scope">
            <PageHeader title="Mitigation Scope (Sample)" />
            
            <div className="px-4 pb-20">
              <h1 className="text-xl font-bold text-slate-900 mb-6">Mitigation Scope</h1>

              <ScopeTable />

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Sample Scope Information</h3>
                <p className="text-sm text-yellow-800">
                  This is a sample scope of work for demonstration purposes. Actual scope items, quantities, 
                  and procedures will be determined based on specific site conditions and requirements.
                </p>
              </div>
            </div>

            <PageFooter pageNumber={12} />
          </div>

          {/* Page 13: Work Authorization (Sample) */}
          <div className="rr-page bg-white shadow-sm relative" data-section="work-authorization">
            <PageHeader title="Work Authorization (Sample)" />
            
            <div className="px-4 pb-20">
              <h1 className="text-xl font-bold text-slate-900 mb-6">Work Authorization</h1>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Owner/Agent:</label>
                    <div className="border border-slate-300 p-2 bg-slate-50 rounded text-sm">
                      {job.policyholder?.name || '_______________________'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Company:</label>
                    <div className="border border-slate-300 p-2 bg-slate-50 rounded text-sm">
                      {job.claim?.carrier || '_______________________'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Policy #:</label>
                    <div className="border border-slate-300 p-2 bg-slate-50 rounded text-sm">
                      {job.claim?.claimId || '_______________________'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type of Loss:</label>
                    <div className="border border-slate-300 p-2 bg-slate-50 rounded text-sm">
                      {job.claim?.typeOfLoss || '_______________________'}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Property Address:</label>
                  <div className="border border-slate-300 p-2 bg-slate-50 rounded text-sm">
                    {job.policyholder?.address || '_______________________'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date of Loss:</label>
                  <div className="border border-slate-300 p-2 bg-slate-50 rounded text-sm">
                    {job.claim?.dateOfLoss ? new Date(job.claim.dateOfLoss).toLocaleDateString() : '_______________________'}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded border">
                  <h3 className="font-semibold text-slate-900 mb-3">Direction of Payment</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    I hereby authorize the above-named restoration company to perform emergency mitigation services 
                    as necessary to prevent further damage to the property. I understand that payment for services 
                    rendered will be my responsibility and that I may assign benefits under my insurance policy 
                    to the restoration company for work performed.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-8">
                  <div>
                    <div className="border-t border-slate-400 pt-2">
                      <div className="text-sm font-medium">Customer Signature</div>
                      <div className="text-xs text-slate-500 mt-1">Date: ________________</div>
                    </div>
                  </div>
                  <div>
                    <div className="border-t border-slate-400 pt-2">
                      <div className="text-sm font-medium">Company Representative</div>
                      <div className="text-xs text-slate-500 mt-1">Date: ________________</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <PageFooter pageNumber={13} />
          </div>

          {/* Page 14: Health & Safety Consent (Sample) */}
          <div className="rr-page bg-white shadow-sm relative" data-section="health-safety">
            <PageHeader title="Health & Safety Consent (Sample)" />
            
            <div className="px-4 pb-20">
              <h1 className="text-xl font-bold text-slate-900 mb-6">Health & Safety Consent Form</h1>

              <p className="text-sm text-slate-600 mb-6">
                Please answer the following questions to help ensure a safe working environment for all occupants and workers:
              </p>

              <div className="space-y-4">
                {[
                  'Do any occupants have known allergies to cleaning products or chemicals?',
                  'Do any occupants have chemical sensitivities?',
                  'Are there occupants under 6 years of age or over 65 years of age?',
                  'Do any occupants have respiratory issues (asthma, COPD, etc.)?',
                  'Do any occupants have immune system deficiencies?',
                  'Have you received and acknowledged the Material Safety Data Sheets (MSDS)?'
                ].map((question, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 bg-slate-50 rounded border">
                    <div className="flex-1 text-sm">{question}</div>
                    <div className="flex gap-4 text-sm">
                      <label className="flex items-center gap-1">
                        <input type="checkbox" className="rounded" />
                        Yes
                      </label>
                      <label className="flex items-center gap-1">
                        <input type="checkbox" className="rounded" />
                        No
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Health or Safety Concerns:
                </label>
                <div className="border border-slate-300 p-3 bg-slate-50 rounded text-sm min-h-[100px]">
                  <div className="text-slate-400">Please describe any additional concerns...</div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
                <h3 className="font-semibold text-blue-900 mb-2">Important Notice</h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                  This information helps our team provide services while maintaining the highest safety standards. 
                  All information provided will be kept confidential and used solely for safety planning purposes.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 mt-8">
                <div>
                  <div className="border-t border-slate-400 pt-2">
                    <div className="text-sm font-medium">Occupant Signature</div>
                    <div className="text-xs text-slate-500 mt-1">Date: ________________</div>
                  </div>
                </div>
                <div>
                  <div className="border-t border-slate-400 pt-2">
                    <div className="text-sm font-medium">Company Representative</div>
                    <div className="text-xs text-slate-500 mt-1">Date: ________________</div>
                  </div>
                </div>
              </div>
            </div>

            <PageFooter pageNumber={14} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
