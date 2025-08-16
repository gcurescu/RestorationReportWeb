import { useState, useEffect } from 'react';

// Logo SVG component for consistency
function RestorationReportLogo({ className = "w-8 h-8" }) {
  return (
    <img
      src="/RestorationReportLogo.png"
      alt="Restoration Report Logo"
      className={className}
      loading="lazy"
    />
  );
}

// Sample data constants for data-driven rendering
const moistureReadings = [
  { date: 'Apr 18, 2022', location: 'Affected Area', temp: 85, rh: 36, gpp: 64.6, grainDepression: '—' },
  { date: 'Apr 19, 2022', location: 'Affected Area', temp: 90, rh: 25, gpp: 52.4, grainDepression: 12.2 },
  { date: 'Apr 20, 2022', location: 'Affected Area', temp: 86, rh: 22, gpp: 49.0, grainDepression: 15.6 },
  { date: 'Apr 21, 2022', location: 'Affected Area', temp: 84, rh: 20, gpp: 44.8, grainDepression: 19.8 },
];

const moisturePoints = [
  { point: '1', room: 'Kitchen', surface: 'Hardwood', reading: '18%', notes: 'Pre-drydown' },
  { point: '2', room: 'Kitchen', surface: 'Hardwood', reading: '12%', notes: 'Improving' },
  { point: '3', room: 'Dining', surface: 'Drywall', reading: '11%', notes: 'Improving' },
  { point: '4', room: 'Dining', surface: 'Drywall', reading: '8%', notes: 'At goal' },
];

const equipment = {
  dehumidifiers: [
    { name: 'Desiccant DH-01', placed: 'Apr 18, 10:30 AM', removed: 'Apr 21, 2:00 PM', power: '2.8 kW', energy: '201.6 kWh', days: 3 },
    { name: 'LGR DH-02', placed: 'Apr 18, 10:45 AM', removed: 'Apr 21, 2:15 PM', power: '4.2 kW', energy: '302.4 kWh', days: 3 },
  ],
  airMovers: [
    { name: 'AM-101', placed: 'Apr 18, 11:00 AM', removed: 'Apr 21, 2:30 PM', energy: '14.4 kWh', days: 3 },
    { name: 'AM-102', placed: 'Apr 18, 11:00 AM', removed: 'Apr 21, 2:30 PM', energy: '14.4 kWh', days: 3 },
    { name: 'AM-103', placed: 'Apr 18, 11:15 AM', removed: 'Apr 21, 2:45 PM', energy: '14.1 kWh', days: 3 },
  ],
  airScrubbers: [],
};

const mitigationScope = [
  { code: 'T001', operation: 'Testing', action: 'Initial moisture assessment', qty: 1, unit: 'Inspection', notes: 'Pre-mitigation baseline' },
  { code: 'P001', operation: 'PPE', action: 'Personal protective equipment', qty: 4, unit: 'Days', notes: 'Full crew protection' },
  { code: 'S001', operation: 'Site Protection', action: 'Floor protection installation', qty: 250, unit: 'SF', notes: 'Ram board and plastic' },
  { code: 'E001', operation: 'Extraction', action: 'Water extraction', qty: 85, unit: 'SF', notes: 'Kitchen hardwood area' },
  { code: 'R001', operation: 'Tear Out', action: 'Base trim removal', qty: 120, unit: 'LF', notes: 'Promote airflow' },
  { code: 'R002', operation: 'Tear Out', action: 'Hardwood flooring removal', qty: 85, unit: 'SF', notes: 'Cupped sections only' },
  { code: 'C001', operation: 'Cleaning', action: 'Detail cleaning', qty: 350, unit: 'SF', notes: 'Pre-equipment installation' },
  { code: 'C002', operation: 'Cleaning', action: 'Antimicrobial application', qty: 350, unit: 'SF', notes: 'EPA-registered product' },
  { code: 'Q001', operation: 'Equipment', action: 'Dehumidifier setup', qty: 2, unit: 'Units', notes: 'LGR and desiccant' },
  { code: 'Q002', operation: 'Equipment', action: 'Air mover placement', qty: 6, unit: 'Units', notes: 'Strategic positioning' },
  { code: 'M001', operation: 'Monitoring', action: 'Daily monitoring', qty: 3, unit: 'Days', notes: 'Until dry goals met' },
];

const kitchenPhotos = [
  { caption: 'Kitchen overview - Pre-mitigation', time: 'Apr 18, 2022 · 10:15 AM CT' },
  { caption: 'Refrigerator area - Supply line damage', time: 'Apr 18, 2022 · 10:18 AM CT' },
  { caption: 'Hardwood cupping assessment', time: 'Apr 18, 2022 · 10:22 AM CT' },
  { caption: 'Base trim removal - North wall', time: 'Apr 18, 2022 · 11:30 AM CT' },
  { caption: 'Base trim removal - East wall', time: 'Apr 18, 2022 · 11:35 AM CT' },
  { caption: 'Toe-kick removal - Cabinet base', time: 'Apr 18, 2022 · 11:45 AM CT' },
  { caption: 'Subfloor inspection', time: 'Apr 18, 2022 · 12:00 PM CT' },
  { caption: 'Hardwood removal - Section 1', time: 'Apr 18, 2022 · 1:15 PM CT' },
  { caption: 'Hardwood removal - Section 2', time: 'Apr 18, 2022 · 1:30 PM CT' },
  { caption: 'Detail cleaning - Floor prep', time: 'Apr 18, 2022 · 2:45 PM CT' },
  { caption: 'Antimicrobial application', time: 'Apr 18, 2022 · 3:00 PM CT' },
  { caption: 'Equipment setup - Dehumidifiers', time: 'Apr 18, 2022 · 3:30 PM CT' },
  { caption: 'Equipment setup - Air movers', time: 'Apr 18, 2022 · 3:45 PM CT' },
  { caption: 'Final positioning check', time: 'Apr 18, 2022 · 4:00 PM CT' },
  { caption: 'Airflow pattern verification', time: 'Apr 18, 2022 · 4:10 PM CT' },
];

const hardwoodPhotos = [
  { caption: 'Hardwood assessment - Overall view', time: 'Apr 18, 2022 · 10:25 AM CT' },
  { caption: 'Cupping detail - Severe section', time: 'Apr 18, 2022 · 10:28 AM CT' },
  { caption: 'Board separation - Gap measurement', time: 'Apr 18, 2022 · 10:32 AM CT' },
  { caption: 'Moisture meter readings', time: 'Apr 18, 2022 · 10:35 AM CT' },
  { caption: 'Removal area marking', time: 'Apr 18, 2022 · 11:20 AM CT' },
  { caption: 'Post-removal subfloor condition', time: 'Apr 18, 2022 · 1:45 PM CT' },
  { caption: 'Salvageable section assessment', time: 'Apr 18, 2022 · 2:00 PM CT' },
  { caption: 'Final moisture verification', time: 'Apr 21, 2022 · 1:30 PM CT' },
];

const basementPhotos = [
  { caption: 'Basement ceiling - Drop tiles', time: 'Apr 18, 2022 · 10:50 AM CT' },
  { caption: 'Insulation inspection - Wet areas', time: 'Apr 18, 2022 · 11:00 AM CT' },
  { caption: 'Insulation removal - Section 1', time: 'Apr 18, 2022 · 12:30 PM CT' },
  { caption: 'Insulation removal - Section 2', time: 'Apr 18, 2022 · 12:45 PM CT' },
  { caption: 'Structural assessment', time: 'Apr 18, 2022 · 1:00 PM CT' },
  { caption: 'Antimicrobial application', time: 'Apr 18, 2022 · 3:15 PM CT' },
  { caption: 'Final moisture check', time: 'Apr 21, 2022 · 1:45 PM CT' },
  { caption: 'Ready for reconstruction', time: 'Apr 21, 2022 · 2:00 PM CT' },
];

const attachments = [
  'Moisture_Full_Report_24-543210D.pdf',
  'Moisture_Equipment_Report_24-543210D.pdf',
  'Mitigation_Scope_2.0_Kitchen.pdf',
  'Work_Authorization_Restoration_Report.pdf',
  'Health_Safety_Consent_Job_101_RR.pdf',
];

const healthSafetyItems = [
  { question: 'Do you or any occupants have allergies to cleaning products?', answer: 'No' },
  { question: 'Do you or any occupants have chemical sensitivities?', answer: 'No' },
  { question: 'Are there occupants under 6 or over 65 years of age?', answer: 'Yes - 1 occupant over 65' },
  { question: 'Do you or any occupants have respiratory problems?', answer: 'No' },
  { question: 'Do you or any occupants have immune deficiencies?', answer: 'No' },
  { question: 'Do you have a family doctor we should contact if needed?', answer: 'Dr. Sarah Johnson - (847) 555-0123' },
  { question: 'Have you reviewed the Material Safety Data Sheets (MSDS)?', answer: 'Yes' },
];

// Helper components for data-driven rendering
function DocPage({ title, subtitle, children, pageNumber, totalPages }) {
  return (
    <section className="page">
      <div className="header">
        <div className="header-inner">
          <div className="brand">
            <RestorationReportLogo className="w-12 h-12" />
            <div>
              <div className="title">Restoration Report</div>
              <div className="subtitle">{subtitle}</div>
            </div>
          </div>
          <div className="contact">
            <div>1234 Byron Avenue • Elk Grove Village, IL 60007</div>
            <div>1-800-425-1954 • hello@restorationreport.app</div>
          </div>
        </div>
        <div className="underline"></div>
      </div>
      <div style={{ marginTop: window.innerWidth < 768 ? '0' : '1.1in' }}>
        {children}
      </div>
      <div className="footer">
        <div>Powered by Restoration Report</div>
        <div>Page {pageNumber} of {totalPages}</div>
      </div>
    </section>
  );
}

function PhotoGrid({ items, columns = 3 }) {
  const gridCols = columns === 2 ? 'grid-cols-2' : 'grid-cols-3';
  return (
    <div className={`photos grid ${gridCols} gap-2 md:gap-3 mt-2 md:mt-3`}>
      {items.map((item, idx) => (
        <div key={idx}>
          <div className="ph blur" aria-label="Overview photo placeholder"></div>
          <div className="cap">{item.caption}</div>
          <div className="meta">{item.time}</div>
        </div>
      ))}
    </div>
  );
}

function DataTable({ columns, rows, className = "table stripe" }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className={className}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {Object.values(row).map((cell, cellIdx) => (
                <td key={cellIdx}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Full PDF Modal Component
function FullReportModal({ isOpen, onClose }) {
  const [totalPages, setTotalPages] = useState(18);

  useEffect(() => {
    if (isOpen) {
      // Count pages after render
      setTimeout(() => {
        const pageElements = document.querySelectorAll('.page');
        setTotalPages(pageElements.length);
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isMobile = window.innerWidth < 768;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 md:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl max-h-[95vh] md:max-h-[90vh] w-full overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-base md:text-lg font-semibold text-slate-900">Sample Restoration Report</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="overflow-y-auto max-h-[calc(95vh-60px)] md:max-h-[calc(90vh-80px)] bg-gray-100">
          <style jsx>{`
            .doc { max-width: 100%; margin: 0 auto; background: #ffffff; }
            .page { 
              max-width: 100%; 
              width: 100%;
              min-height: auto; 
              position: relative; 
              padding: 12px; 
              background: #ffffff; 
              margin-bottom: 16px; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
            }
            .header { position: relative; left: 0; top: 0; width: 100%; min-height: 80px; background: #0C2D48; color: #fff; margin-bottom: 16px; border-radius: 4px; }
            .header-inner { display: flex; align-items: center; justify-content: space-between; padding: 12px; min-height: 80px; flex-wrap: wrap; gap: 8px; }
            .brand { display: flex; align-items: center; gap: 8px; }
            .brand svg { width: 32px; height: 32px; }
            .brand .title { font: 700 14px Montserrat, Inter, sans-serif; }
            .brand .subtitle { font: 600 10px Montserrat, Inter, sans-serif; opacity: .95; }
            .contact { font: 400 8px Inter, sans-serif; text-align: right; line-height: 1.25; }
            .underline { display: none; }
            .footer { position: relative; left: 0; right: 0; bottom: 0; display: flex; justify-content: space-between; align-items: center; color: #475569; font: 400 9px Inter; margin-top: 16px; padding-top: 8px; border-top: 1px solid #E5E7EB; }
            .hr { height: 1px; background: #E5E7EB; margin: 12px 0; }
            .modal-h1 { font: 700 16px Montserrat, Inter, sans-serif; margin: 0 0 6px; }
            .modal-h2 { font: 700 12px Montserrat, Inter, sans-serif; margin: 12px 0 6px; }
            .modal-p { margin: 0 0 8px; line-height: 1.4; font-size: 11px; }
            .kv { display: flex; flex-direction: column; gap: 12px; margin-top: 8px; }
            .kv .panel { flex: 1; border: 1px solid #E5E7EB; padding: 8px; border-radius: 6px; background: #fff; }
            .row { display: flex; justify-content: space-between; border-bottom: 1px solid #f0f2f5; padding: 4px 0; }
            .row:last-child { border-bottom: none; }
            .k { color: #475569; font-size: 10px; }
            .v { font-size: 10px; font-weight: 500; }
            .photos { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 8px; }
            .ph { background: #e5e7eb; border: 1px solid #E5E7EB; height: 120px; border-radius: 4px; position: relative; overflow: hidden; }
            .ph.blur::before { content: ""; position: absolute; inset: 0; background: linear-gradient(135deg, #cbd5e1, #94a3b8, #cbd5e1); filter: blur(4px) saturate(.9) brightness(1.05); transform: scale(1.06); }
            .ph.blur::after { content: ""; position: absolute; inset: 0; background: rgba(255,255,255,.08); }
            .cap { font-size: 9px; color: #475569; text-align: center; margin-top: 3px; }
            .meta { font-size: 8px; color: #475569; text-align: center; margin-top: 2px; opacity: .85; }
            .video { background: #e5e7eb; border: 1px solid #E5E7EB; height: 160px; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #475569; }
            .muted { background: #F8FAFC; padding: 8px; border-radius: 6px; border: 1px solid #E5E7EB; }
            .toc { font: 500 10px Inter; white-space: pre-line; }
            .table { width: 100%; border-collapse: collapse; font: 400 9px Inter; color: #0F172A; overflow-x: auto; }
            .table th { background: #e2e8f0; border: 1px solid #E5E7EB; padding: 4px; text-align: left; font-weight: 600; font-size: 9px; }
            .table td { border: 1px solid #E5E7EB; padding: 4px; font-size: 9px; }
            .stripe tr:nth-child(even) td { background: #f8fafc; }
            
            /* Desktop styles */
            @media (min-width: 768px) {
              .doc { width: 8.5in; }
              .page { width: 8.5in; min-height: 11in; padding: 0.75in 0.6in 0.6in 0.6in; margin-bottom: 20px; }
              .header { position: absolute; height: 0.9in; margin-bottom: 0; border-radius: 0; }
              .header-inner { padding: 0 0.6in; min-height: 0.9in; flex-wrap: nowrap; gap: 14px; }
              .brand svg { width: 48px; height: 48px; }
              .brand .title { font: 700 18px Montserrat, Inter, sans-serif; }
              .brand .subtitle { font: 600 12px Montserrat, Inter, sans-serif; }
              .contact { font: 400 10px Inter, sans-serif; }
              .underline { display: block; position: absolute; left: 0.6in; right: 0.6in; top: 0.9in; height: 1px; background: #E5E7EB; }
              .footer { position: absolute; left: 0.6in; right: 0.6in; bottom: 0.45in; font: 400 10px Inter; margin-top: 0; padding-top: 0; border-top: none; }
              .modal-h1 { font: 700 20px Montserrat, Inter, sans-serif; margin: 0 0 8px; }
              .modal-h2 { font: 700 14px Montserrat, Inter, sans-serif; margin: 18px 0 8px; }
              .modal-p { line-height: 1.45; font-size: inherit; margin: 0 0 10px; }
              .kv { flex-direction: row; gap: 20px; margin-top: 12px; }
              .kv .panel { padding: 12px; }
              .row { padding: 6px 0; }
              .k { font-size: 12px; }
              .v { font-size: 12.5px; }
              .photos { grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px; }
              .ph { height: 1.7in; border-radius: 6px; }
              .cap { font-size: 11px; margin-top: 4px; }
              .meta { font-size: 10px; }
              .video { height: 2.5in; border-radius: 6px; }
              .muted { padding: 10px; }
              .toc { font: 500 12px Inter; }
              .table { font: 400 11px Inter; }
              .table th { padding: 6px; font-size: inherit; }
              .table td { padding: 6px; font-size: inherit; }
            }
          `}</style>

          <div className="doc">
            {/* PAGE 1: COVER / CLAIM SUMMARY */}
            <DocPage subtitle="Claim Summary" pageNumber={1} totalPages={totalPages}>
              <div className="kv">
                <div className="panel">
                  <h2 className="modal-h2">Policyholder</h2>
                  <div className="row"><div className="k">Name</div><div className="v">James Miller</div></div>
                  <div className="row"><div className="k">Phone</div><div className="v">(847) 454-9876</div></div>
                  <div className="row"><div className="k">Address</div><div className="v">975 Westmere St., Des Plaines, IL, USA</div></div>
                </div>
                <div className="panel">
                  <h2 className="modal-h2">Claim Details</h2>
                  <div className="row"><div className="k">Type of Loss</div><div className="v">Water</div></div>
                  <div className="row"><div className="k">Date of Loss</div><div className="v">Apr 18, 2022</div></div>
                  <div className="row"><div className="k">Claim ID</div><div className="v">24-543210D</div></div>
                  <div className="row"><div className="k">Date Claim Created</div><div className="v">Apr 18, 2022</div></div>
                  <div className="row"><div className="k">Carrier</div><div className="v">Allstate</div></div>
                  <div className="row"><div className="k">Adjuster</div><div className="v">Lauren Tillus</div></div>
                </div>
              </div>
              <h2 className="modal-h2" style={{ marginTop: '16px' }}>Claim Summary</h2>
              <p className="modal-p">Water damage affecting kitchen, dining, and basement areas due to a damaged plastic supply line behind the refrigerator. Source isolated and mitigation initiated. Photos, moisture readings, equipment logs, and scope summary are included in this report.</p>
            </DocPage>

            {/* PAGE 2: TABLE OF CONTENTS */}
            <DocPage subtitle="Table of Contents" pageNumber={2} totalPages={totalPages}>
              <div className="muted">
                <div className="toc">{`3  General Notes
4  Risk - Overview Photos, Log Notes, Room Notes
5  Kitchen - Overview Photos
6  Floor Plan - Floor Plan 1
7  Hardwood Floors - Overview Photos
8  Scope Video - Overview Videos
9  Basement - Overview Photos
10 Attachments
11 Moisture Full Report (Psychrometric Data)
12 Moisture & Equipment Report
13 Mitigation Scope
14 Work Authorization
15 Health & Safety Consent`}</div>
              </div>
            </DocPage>

            {/* PAGE 3: GENERAL NOTES */}
            <DocPage subtitle="General Notes" pageNumber={3} totalPages={totalPages}>
              <h2 className="modal-h2">Initial Inspection 4-18-2022</h2>
              <p className="modal-p">This single-family home experienced water damage impacting the kitchen, dining room, and basement. The loss originated from a damaged plastic water supply line behind the refrigerator and has been corrected. Restoration Report mitigation partners were engaged to perform extraction, removals as needed, antimicrobial application, equipment installation, and daily monitoring until drying goals were met.</p>
              <h2 className="modal-h2">Kitchen/Dining Room</h2>
              <p className="modal-p">Water likely migrated from the supply line into the kitchen for an unknown duration. Required actions included base trim removal, ventilating drywall to promote drying, removing the toe-kick to assess flooring beneath, and removing cupped hardwood. After removals, crews detail cleaned and applied plant-based antimicrobial prior to installing drying equipment.</p>
              <h2 className="modal-h2">Basement</h2>
              <p className="modal-p">Moisture tracked through the subfloor into the basement. The drop ceiling is insulated; crews systematically removed insulation to determine the extent of moisture. Following removals, detail cleaning and antimicrobial application were performed.</p>
              <h2 className="modal-h2">Scope (Summary)</h2>
              <p className="modal-p">Flooring protection in service ways; content manipulation; selective removal of ceiling insulation and base trim; drywall ventilation or cutting to 2 ft if discoloration is present; removal of impacted hardwood; antimicrobial application; equipment installation; daily monitoring.</p>
            </DocPage>

            {/* PAGE 4: RISK */}
            <DocPage subtitle="Risk" pageNumber={4} totalPages={totalPages}>
              <h2 className="modal-h2">Overview Photos: Risk</h2>
              <PhotoGrid items={[
                { caption: 'Exterior - Front elevation', time: 'Photo 1 · Apr 18, 2022 · 10:40 AM CT' },
                { caption: 'Exterior - Side elevation', time: 'Photo 2 · Apr 18, 2022 · 10:41 AM CT' },
                { caption: 'Rear yard overview', time: 'Photo 3 · Apr 18, 2022 · 10:41 AM CT' },
                { caption: 'Entry path protection', time: 'Photo 4 · Apr 18, 2022 · 10:42 AM CT' },
                { caption: 'Staging area', time: 'Photo 5 · Apr 18, 2022 · 10:44 AM CT' },
                { caption: 'Safety signage', time: 'Photo 6 · Apr 18, 2022 · 10:45 AM CT' },
              ]} />
              <h2 className="modal-h2" style={{ marginTop: '16px' }}>Log Notes</h2>
              <div className="muted">
                <p className="modal-p"><strong>4/18 - 9:15 AM:</strong> Received call for new water loss - refrigerator leak on kitchen floor with cupping observed. Referral from agent. Inspection scheduled for 11am. Contact information and claim number recorded.</p>
                <p className="modal-p"><strong>4/18 - 11:00 AM:</strong> On-site inspection commenced. Policyholder present. Source isolated, supply line repaired by plumber. Moisture assessment underway.</p>
                <p className="modal-p"><strong>4/18 - 4:30 PM:</strong> Mitigation plan approved by adjuster. Equipment deployed, monitoring schedule established. Daily reports to follow.</p>
              </div>
              <h2 className="modal-h2" style={{ marginTop: '16px' }}>Room Notes</h2>
              <ul style={{ margin: '0 0 0 18px', padding: 0, font: '400 10.5px Inter', color: '#0F172A' }}>
                <li><strong>Kitchen:</strong> Base trim removal; ventilate drywall; remove toe-kick and cupped hardwood; clean and apply plant-based antimicrobial; install drying equipment.</li>
                <li><strong>Dining Room:</strong> Monitor moisture migration; remove base trim where impacted; detail clean; continue daily monitoring.</li>
                <li><strong>Basement:</strong> Inspect drop ceiling cavities; remove wet insulation as needed; clean and apply antimicrobial; confirm final moisture goals.</li>
              </ul>
            </DocPage>

            {/* PAGE 5: KITCHEN - OVERVIEW PHOTOS */}
            <DocPage subtitle="Kitchen" pageNumber={5} totalPages={totalPages}>
              <h2 className="modal-h2">Overview Photos: Kitchen</h2>
              <PhotoGrid items={kitchenPhotos.slice(0, 9)} />
              <PhotoGrid items={kitchenPhotos.slice(9)} />
            </DocPage>

            {/* PAGE 6: FLOOR PLAN */}
            <DocPage subtitle="Floor Plan" pageNumber={6} totalPages={totalPages}>
              <h2 className="modal-h2">Floor Plan 1</h2>
              <div style={{ 
                background: '#e5e7eb', 
                border: '1px solid #E5E7EB', 
                height: isMobile ? '200px' : '400px', 
                borderRadius: '6px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#475569',
                marginTop: '12px'
              }}>
                Floor Plan Diagram — Placeholder
              </div>
              <div className="muted" style={{ marginTop: '16px' }}>
                <h3 className="modal-h2">Legend</h3>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '10px' }}>Affected Area</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', background: '#3b82f6', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '10px' }}>Equipment Location</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '10px' }}>Moisture Reading Points</span>
                  </div>
                </div>
              </div>
            </DocPage>

            {/* PAGE 7: HARDWOOD FLOORS - OVERVIEW PHOTOS */}
            <DocPage subtitle="Hardwood Floors" pageNumber={7} totalPages={totalPages}>
              <h2 className="modal-h2">Overview Photos: Hardwood Floors</h2>
              <PhotoGrid items={hardwoodPhotos} />
            </DocPage>

            {/* PAGE 8: SCOPE VIDEO */}
            <DocPage subtitle="Scope Video" pageNumber={8} totalPages={totalPages}>
              <h2 className="modal-h2">Overview Videos</h2>
              <div className="video" style={{ marginTop: '12px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>▶</div>
                  <div>Overview Video 1 — Kitchen Assessment</div>
                  <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '4px' }}>Duration: 3:42 • Recorded: Apr 18, 2022 11:30 AM CT</div>
                </div>
              </div>
              <div className="video" style={{ marginTop: '16px', height: isMobile ? '120px' : '200px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>▶</div>
                  <div>Overview Video 2 — Equipment Installation</div>
                  <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '4px' }}>Duration: 2:18 • Recorded: Apr 18, 2022 3:15 PM CT</div>
                </div>
              </div>
            </DocPage>

            {/* PAGE 9: BASEMENT - OVERVIEW PHOTOS */}
            <DocPage subtitle="Basement" pageNumber={9} totalPages={totalPages}>
              <h2 className="modal-h2">Overview Photos: Basement</h2>
              <PhotoGrid items={basementPhotos} />
            </DocPage>

            {/* PAGE 10: ATTACHMENTS */}
            <DocPage subtitle="Attachments" pageNumber={10} totalPages={totalPages}>
              <h2 className="modal-h2">Report Attachments</h2>
              <ol style={{ margin: '16px 0 0 20px', padding: 0 }}>
                {attachments.map((attachment, idx) => (
                  <li key={idx} style={{ margin: '8px 0', fontSize: '11px', lineHeight: 1.4 }}>
                    {attachment}
                  </li>
                ))}
              </ol>
            </DocPage>

            {/* PAGE 11: MOISTURE FULL REPORT */}
            <DocPage subtitle="Moisture Full Report" pageNumber={11} totalPages={totalPages}>
              <h2 className="modal-h2">Daily Psychrometric Readings</h2>
              <DataTable 
                columns={['Date', 'Location', 'Temp (°F)', 'RH (%)', 'GPP', 'Grain Depression']}
                rows={moistureReadings}
              />
              
              <h2 className="modal-h2" style={{ marginTop: '16px' }}>Unaffected Area Readings</h2>
              <DataTable 
                columns={['Time', 'Room', 'RH (%)', 'GPP', 'Temp (°F)']}
                rows={[
                  { time: '10:00 AM', room: 'Living Room', rh: '45%', gpp: '72.3', temp: '72°F' },
                  { time: '10:00 AM', room: 'Master Bedroom', rh: '42%', gpp: '68.9', temp: '71°F' },
                ]}
              />

              <h2 className="modal-h2" style={{ marginTop: '16px' }}>Affected Area Readings - Kitchen</h2>
              <DataTable 
                columns={['Time', 'RH (%)', 'GPP', 'Temp (°F)', 'Grain Depression']}
                rows={[
                  { time: '10:15 AM', rh: '36%', gpp: '64.6', temp: '85°F', grainDepression: '—' },
                  { time: '2:00 PM', rh: '32%', gpp: '58.2', temp: '88°F', grainDepression: '6.4' },
                  { time: '6:00 PM', rh: '28%', gpp: '54.1', temp: '86°F', grainDepression: '10.5' },
                ]}
              />

              <h2 className="modal-h2" style={{ marginTop: '16px' }}>Moisture Points (1–4)</h2>
              <DataTable 
                columns={['Point', 'Room', 'Surface', 'Reading', 'Notes']}
                rows={moisturePoints}
              />
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ 
                  background: '#dcfce7', 
                  color: '#166534', 
                  padding: '2px 6px', 
                  borderRadius: '4px', 
                  fontSize: '9px',
                  border: '1px solid #bbf7d0'
                }}>
                  Dry Standard: &lt;12% (Wood), &lt;15% (Drywall)
                </span>
              </div>
            </DocPage>

            {/* PAGE 12: MOISTURE & EQUIPMENT REPORT */}
            <DocPage subtitle="Moisture & Equipment Report" pageNumber={12} totalPages={totalPages}>
              <h2 className="modal-h2">Dehumidifiers</h2>
              <DataTable 
                columns={['Name/Model/ID', 'Placed', 'Removed', 'Power kW', 'Energy kWh', 'Days on Site']}
                rows={equipment.dehumidifiers}
              />
              
              <h2 className="modal-h2" style={{ marginTop: '16px' }}>Air Movers</h2>
              <DataTable 
                columns={['Name/ID', 'Placed', 'Removed', 'Energy kWh', 'Days on Site']}
                rows={equipment.airMovers.map(({ name, placed, removed, energy, days }) => ({ name, placed, removed, energy, days }))}
              />

              <h2 className="modal-h2" style={{ marginTop: '16px' }}>Air Scrubbers</h2>
              <DataTable 
                columns={['Name/ID', 'Placed', 'Removed', 'Energy kWh', 'Days on Site']}
                rows={equipment.airScrubbers.length ? equipment.airScrubbers : [{ name: 'None deployed', placed: '—', removed: '—', energy: '—', days: '—' }]}
              />

              <div className="muted" style={{ marginTop: '16px' }}>
                <h3 className="modal-h2">Energy Totals</h3>
                <div className="row"><div className="k">Dehumidifier Total kWh</div><div className="v">504.0 kWh</div></div>
                <div className="row"><div className="k">Air Mover Total kWh</div><div className="v">42.9 kWh</div></div>
                <div className="row"><div className="k">Grand Total kWh</div><div className="v">546.9 kWh</div></div>
              </div>
            </DocPage>

            {/* PAGE 13: MITIGATION SCOPE */}
            <DocPage subtitle="Mitigation Scope" pageNumber={13} totalPages={totalPages}>
              <h2 className="modal-h2">Mitigation Scope Summary</h2>
              <DataTable 
                columns={['Code', 'Operation', 'Action', 'Qty', 'Unit/Variable', 'Notes']}
                rows={mitigationScope}
              />
            </DocPage>

            {/* PAGE 14: WORK AUTHORIZATION */}
            <DocPage subtitle="Work Authorization" pageNumber={14} totalPages={totalPages}>
              <h2 className="modal-h2">Work Authorization</h2>
              
              <div className="kv">
                <div className="panel">
                  <h3 className="modal-h2">Property Owner/Agent</h3>
                  <div className="row"><div className="k">Name</div><div className="v">James Miller</div></div>
                  <div className="row"><div className="k">Address</div><div className="v">975 Westmere St., Des Plaines, IL 60007</div></div>
                  <div className="row"><div className="k">Phone</div><div className="v">(847) 454-9876</div></div>
                </div>
                <div className="panel">
                  <h3 className="modal-h2">Insurance Information</h3>
                  <div className="row"><div className="k">Insurance Company</div><div className="v">Allstate Insurance</div></div>
                  <div className="row"><div className="k">Policy Number</div><div className="v">ALT-789-456-123</div></div>
                  <div className="row"><div className="k">Claim Number</div><div className="v">24-543210D</div></div>
                </div>
              </div>

              <div className="panel" style={{ marginTop: '16px' }}>
                <h3 className="modal-h2">Loss Details</h3>
                <div className="row"><div className="k">Type of Loss</div><div className="v">Water Damage</div></div>
                <div className="row"><div className="k">Date of Loss</div><div className="v">April 18, 2022</div></div>
                <div className="row"><div className="k">Property Address</div><div className="v">975 Westmere St., Des Plaines, IL 60007</div></div>
              </div>

              <div className="muted" style={{ marginTop: '16px' }}>
                <h3 className="modal-h2">Direction of Payment</h3>
                <p className="modal-p">I hereby authorize and direct my insurance company to pay Restoration Report directly for services rendered. I understand that I am financially responsible for all charges whether or not paid by insurance.</p>
                
                <div style={{ marginTop: '20px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                  <div>
                    <div className="hr" style={{ width: '200px' }}></div>
                    <div style={{ fontSize: '10px', marginTop: '4px' }}>Customer Signature / Date</div>
                  </div>
                  <div>
                    <div className="hr" style={{ width: '200px' }}></div>
                    <div style={{ fontSize: '10px', marginTop: '4px' }}>Company Representative / Date</div>
                  </div>
                </div>
              </div>
            </DocPage>

            {/* PAGE 15: HEALTH & SAFETY CONSENT */}
            <DocPage subtitle="Health & Safety Consent" pageNumber={15} totalPages={totalPages}>
              <h2 className="modal-h2">Health & Safety Questionnaire</h2>
              
              <div className="muted">
                {healthSafetyItems.map((item, idx) => (
                  <div key={idx} className="row">
                    <div className="k" style={{ width: '70%' }}>{item.question}</div>
                    <div className="v" style={{ width: '30%', textAlign: 'right' }}>{item.answer}</div>
                  </div>
                ))}
              </div>

              <div className="panel" style={{ marginTop: '16px' }}>
                <h3 className="modal-h2">Additional Health/Safety Concerns</h3>
                <p className="modal-p">None reported at time of initial inspection. Occupant over 65 has been advised of mitigation activities and timeline. All EPA-registered products will be used with appropriate ventilation.</p>
              </div>

              <div className="muted" style={{ marginTop: '16px' }}>
                <p className="modal-p"><strong>Acknowledgment:</strong> I acknowledge that I have reviewed this questionnaire and provided accurate information. I understand the restoration process and agree to notify Restoration Report of any changes in health status during the project.</p>
                
                <div style={{ marginTop: '20px' }}>
                  <div className="hr" style={{ width: '250px' }}></div>
                  <div style={{ fontSize: '10px', marginTop: '4px' }}>Property Owner Signature / Date: _________________</div>
                </div>
              </div>
            </DocPage>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SampleReport() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="w-full max-w-sm mx-auto rounded-lg shadow-lg border border-slate-200 bg-white overflow-hidden">
        {/* Scrollable container with fixed height */}
        <div className="h-96 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-slate-800 text-white p-3 z-10">
            <div className="flex items-center gap-2">
              <RestorationReportLogo />
              <div>
                <h3 className="font-bold text-sm">Restoration Report</h3>
                <p className="text-xs opacity-95">Claim Summary</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 text-xs">
            {/* Claim Details */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-2 rounded border">
                  <h4 className="font-semibold text-slate-800 text-xs mb-1">Policyholder</h4>
                  <div className="space-y-0.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Name:</span>
                      <span className="font-medium">James Miller</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Phone:</span>
                      <span className="font-medium">(847) 454-9876</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-2 rounded border">
                  <h4 className="font-semibold text-slate-800 text-xs mb-1">Claim Details</h4>
                  <div className="space-y-0.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Type:</span>
                      <span className="font-medium">Water</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">ID:</span>
                      <span className="font-medium">24-543210D</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Claim Summary</h4>
              <p className="text-slate-600 leading-relaxed">
                Water damage affecting kitchen, dining, and basement areas due to a damaged plastic supply line behind the refrigerator. Source isolated and mitigation initiated.
              </p>
            </div>

            {/* Photos Grid */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Overview Photos</h4>
              <div className="grid grid-cols-3 gap-1">
                {[
                  'Kitchen Overview',
                  'Refrigerator Wall', 
                  'Base Trim Removal',
                  'Equipment Setup',
                  'Moisture Reading',
                  'Final Inspection'
                ].map((caption, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 aspect-square rounded border relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-400/20 via-slate-500/30 to-slate-400/20 backdrop-blur-sm"></div>
                    </div>
                    <p className="text-xs text-slate-500 text-center leading-tight">{caption}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Moisture Readings */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Moisture Readings</h4>
              <div className="bg-slate-50 rounded border">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left p-2 font-medium text-slate-700">Location</th>
                      <th className="text-right p-2 font-medium text-slate-700">Reading</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200/50">
                      <td className="p-2 text-slate-600">Kitchen hardwood</td>
                      <td className="p-2 text-right font-mono font-medium">18.2%</td>
                    </tr>
                    <tr className="border-b border-slate-200/50">
                      <td className="p-2 text-slate-600">Dining drywall</td>
                      <td className="p-2 text-right font-mono font-medium">11.5%</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-slate-600">Basement ceiling</td>
                      <td className="p-2 text-right font-mono font-medium">8.3%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Equipment Log */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Equipment Deployed</h4>
              <div className="bg-slate-50 rounded border">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left p-2 font-medium text-slate-700">Equipment</th>
                      <th className="text-right p-2 font-medium text-slate-700">Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200/50">
                      <td className="p-2 text-slate-600">Dehumidifiers</td>
                      <td className="p-2 text-right font-medium">2 units</td>
                    </tr>
                    <tr className="border-b border-slate-200/50">
                      <td className="p-2 text-slate-600">Air movers</td>
                      <td className="p-2 text-right font-medium">6 units</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-slate-600">Days deployed</td>
                      <td className="p-2 text-right font-medium">3 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mitigation Scope */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Scope Summary</h4>
              <div className="space-y-1">
                {[
                  'Base trim removal for airflow (120 LF)',
                  'Remove impacted hardwood (85 SF)',
                  'Apply EPA-registered antimicrobial',
                  'Equipment installation & monitoring'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-slate-400 mt-2 flex-shrink-0"></div>
                    <span className="text-slate-600 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer / CTA */}
            <div className="border-t pt-3 mt-4">
              <div className="bg-slate-50 p-3 rounded border text-center">
                <p className="text-slate-600 mb-2 leading-relaxed">
                  This is a preview of a complete restoration report with 15+ pages including photos, moisture logs, and equipment details.
                </p>
                <button 
                  onClick={() => setShowModal(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-xs hover:underline"
                >
                  View Full Sample Report →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <FullReportModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
}