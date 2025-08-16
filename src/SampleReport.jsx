import { useState } from 'react';

// Logo SVG component for consistency
function RestorationReportLogo({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#10b981"/>
          <stop offset="100%" stopColor="#0ea5e9"/>
        </linearGradient>
      </defs>
      <rect x="10" y="8" width="36" height="48" rx="6" fill="url(#g1)" opacity=".12"/>
      <rect x="14" y="12" width="28" height="40" rx="4" fill="#fff" stroke="#0f172a" strokeOpacity=".2"/>
      <rect x="18" y="18" width="20" height="4" rx="2" fill="#0f172a" opacity=".5"/>
      <rect x="18" y="26" width="20" height="4" rx="2" fill="#0f172a" opacity=".2"/>
      <rect x="18" y="34" width="14" height="4" rx="2" fill="#0f172a" opacity=".2"/>
      <path d="M50 28c0 6-4.5 10-9 10s-9-4-9-10C32 19 41 12 41 12s9 7 9 16z" fill="#0ea5e9"/>
      <path d="M44 26c0 4-3 7-6 7s-6-3-6-7c0-5 6-9 6-9s6 4 6 9z" fill="#f97316" opacity=".9"/>
      <circle cx="41" cy="49" r="6" fill="#10b981"/>
    </svg>
  );
}

// Full PDF Modal Component
function FullReportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl max-h-[90vh] w-full overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-900">Sample Restoration Report</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] bg-gray-100">
          <style jsx>{`
            .doc { width: 8.5in; margin: 0 auto; background: #ffffff; }
            .page { width: 8.5in; min-height: 11in; position: relative; padding: 0.75in 0.6in 0.6in 0.6in; background: #ffffff; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { position: absolute; left: 0; top: 0; width: 100%; height: 0.9in; background: #0C2D48; color: #fff; }
            .header-inner { display: flex; align-items: center; justify-content: space-between; padding: 0 0.6in; height: 100%; }
            .brand { display: flex; align-items: center; gap: 14px; }
            .brand svg { width: 48px; height: 48px; }
            .brand .title { font: 700 18px Montserrat, Inter, sans-serif; }
            .brand .subtitle { font: 600 12px Montserrat, Inter, sans-serif; opacity: .95; }
            .contact { font: 400 10px Inter, sans-serif; text-align: right; line-height: 1.25; }
            .underline { position: absolute; left: 0.6in; right: 0.6in; top: 0.9in; height: 1px; background: #E5E7EB; }
            .footer { position: absolute; left: 0.6in; right: 0.6in; bottom: 0.45in; display: flex; justify-content: space-between; align-items: center; color: #475569; font: 400 10px Inter; }
            .hr { height: 1px; background: #E5E7EB; margin: 16px 0; }
            .modal-h1 { font: 700 20px Montserrat, Inter, sans-serif; margin: 0 0 8px; }
            .modal-h2 { font: 700 14px Montserrat, Inter, sans-serif; margin: 18px 0 8px; }
            .modal-p { margin: 0 0 10px; line-height: 1.45; }
            .kv { display: flex; gap: 20px; margin-top: 12px; }
            .kv .panel { flex: 1; border: 1px solid #E5E7EB; padding: 12px; border-radius: 8px; background: #fff; }
            .row { display: flex; justify-content: space-between; border-bottom: 1px solid #f0f2f5; padding: 6px 0; }
            .row:last-child { border-bottom: none; }
            .k { color: #475569; font-size: 12px; }
            .v { font-size: 12.5px; font-weight: 500; }
            .photos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px; }
            .ph { background: #e5e7eb; border: 1px solid #E5E7EB; height: 1.7in; border-radius: 6px; position: relative; overflow: hidden; }
            .ph.blur::before { content: ""; position: absolute; inset: 0; background: linear-gradient(135deg, #cbd5e1, #94a3b8, #cbd5e1); filter: blur(6px) saturate(.9) brightness(1.05); transform: scale(1.06); }
            .ph.blur::after { content: ""; position: absolute; inset: 0; background: rgba(255,255,255,.08); }
            .cap { font-size: 11px; color: #475569; text-align: center; margin-top: 4px; }
            .meta { font-size: 10px; color: #475569; text-align: center; margin-top: 2px; opacity: .85; }
            .video { background: #e5e7eb; border: 1px solid #E5E7EB; height: 2.5in; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #475569; }
            .muted { background: #F8FAFC; padding: 10px; border-radius: 8px; border: 1px solid #E5E7EB; }
            .toc { font: 500 12px Inter; white-space: pre-line; }
            .table { width: 100%; border-collapse: collapse; font: 400 11px Inter; color: #0F172A; }
            .table th { background: #e2e8f0; border: 1px solid #E5E7EB; padding: 6px; text-align: left; font-weight: 600; }
            .table td { border: 1px solid #E5E7EB; padding: 6px; }
            .stripe tr:nth-child(even) td { background: #f8fafc; }
          `}</style>

          <div className="doc">
            {/* PAGE 1: COVER / CLAIM SUMMARY */}
            <section className="page">
              <div className="header">
                <div className="header-inner">
                  <div className="brand">
                    <RestorationReportLogo className="w-12 h-12" />
                    <div>
                      <div className="title">Restoration Report</div>
                      <div className="subtitle">Claim Summary</div>
                    </div>
                  </div>
                  <div className="contact">
                    <div>1234 Byron Avenue • Elk Grove Village, IL 60007</div>
                    <div>1-800-425-1954 • hello@restorationreport.app</div>
                  </div>
                </div>
                <div className="underline"></div>
              </div>
              <div style={{ marginTop: '1.1in' }}>
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
              </div>
              <div className="footer"><div>Powered by Restoration Report</div><div>Page 1 of 15</div></div>
            </section>

            {/* PAGE 2: TABLE OF CONTENTS */}
            <section className="page">
              <div className="header">
                <div className="header-inner">
                  <div className="brand">
                    <RestorationReportLogo className="w-12 h-12" />
                    <div>
                      <div className="title">Restoration Report</div>
                      <div className="subtitle">Table of Contents</div>
                    </div>
                  </div>
                  <div className="contact">
                    <div>1234 Byron Avenue • Elk Grove Village, IL 60007</div>
                    <div>1-800-425-1954 • hello@restorationreport.app</div>
                  </div>
                </div>
                <div className="underline"></div>
              </div>
              <div style={{ marginTop: '1.1in' }}>
                <div className="muted">
                  <div className="toc">{`3  General Notes
4  Risk - Overview Photos, Log Notes, Room Notes
5  Kitchen - Overview Photos
6  Floor Plan - Floor Plan 1
7  Hardwood Floors - Overview Photos
8  Scope Video - Overview Videos
9  Basement - Overview Photos
10 Attachments
11 Moisture Full Report (sample)
12 Moisture & Equipment Report (sample)
13 Mitigation Scope (sample)
14 Work Authorization (sample)
15 Health & Safety Consent (sample)`}</div>
                </div>
              </div>
              <div className="footer"><div>Powered by Restoration Report</div><div>Page 2 of 15</div></div>
            </section>

            {/* PAGE 3: GENERAL NOTES */}
            <section className="page">
              <div className="header">
                <div className="header-inner">
                  <div className="brand">
                    <RestorationReportLogo className="w-12 h-12" />
                    <div>
                      <div className="title">Restoration Report</div>
                      <div className="subtitle">General Notes</div>
                    </div>
                  </div>
                  <div className="contact">
                    <div>1234 Byron Avenue • Elk Grove Village, IL 60007</div>
                    <div>1-800-425-1954 • hello@restorationreport.app</div>
                  </div>
                </div>
                <div className="underline"></div>
              </div>
              <div style={{ marginTop: '1.1in' }}>
                <h2 className="modal-h2">Initial Inspection 4-18-2022</h2>
                <p className="modal-p">This single-family home experienced water damage impacting the kitchen, dining room, and basement. The loss originated from a damaged plastic water supply line behind the refrigerator and has been corrected. Restoration Report mitigation partners were engaged to perform extraction, removals as needed, antimicrobial application, equipment installation, and daily monitoring until drying goals were met.</p>
                <h2 className="modal-h2">Kitchen/Dining Room</h2>
                <p className="modal-p">Water likely migrated from the supply line into the kitchen for an unknown duration. Required actions included base trim removal, ventilating drywall to promote drying, removing the toe-kick to assess flooring beneath, and removing cupped hardwood. After removals, crews detail cleaned and applied plant-based antimicrobial prior to installing drying equipment.</p>
                <h2 className="modal-h2">Basement</h2>
                <p className="modal-p">Moisture tracked through the subfloor into the basement. The drop ceiling is insulated; crews systematically removed insulation to determine the extent of moisture. Following removals, detail cleaning and antimicrobial application were performed.</p>
                <h2 className="modal-h2">Scope (Summary)</h2>
                <p className="modal-p">Flooring protection in service ways; content manipulation; selective removal of ceiling insulation and base trim; drywall ventilation or cutting to 2 ft if discoloration is present; removal of impacted hardwood; antimicrobial application; equipment installation; daily monitoring.</p>
              </div>
              <div className="footer"><div>Powered by Restoration Report</div><div>Page 3 of 15</div></div>
            </section>

            {/* PAGE 4: RISK */}
            <section className="page">
              <div className="header">
                <div className="header-inner">
                  <div className="brand">
                    <RestorationReportLogo className="w-12 h-12" />
                    <div>
                      <div className="title">Restoration Report</div>
                      <div className="subtitle">Risk</div>
                    </div>
                  </div>
                  <div className="contact">
                    <div>1234 Byron Avenue • Elk Grove Village, IL 60007</div>
                    <div>1-800-425-1954 • hello@restorationreport.app</div>
                  </div>
                </div>
                <div className="underline"></div>
              </div>
              <div style={{ marginTop: '1.1in' }}>
                <h2 className="modal-h2">Overview Photos: Risk</h2>
                <div className="photos">
                  <div><div className="ph blur"></div><div className="cap">Exterior - Front elevation</div><div className="meta">Photo 1 · Apr 18, 2022 · 10:40 AM CT</div></div>
                  <div><div className="ph blur"></div><div className="cap">Exterior - Side elevation</div><div className="meta">Photo 2 · Apr 18, 2022 · 10:41 AM CT</div></div>
                  <div><div className="ph blur"></div><div className="cap">Rear yard overview</div><div className="meta">Photo 3 · Apr 18, 2022 · 10:41 AM CT</div></div>
                  <div><div className="ph blur"></div><div className="cap">Entry path protection</div><div className="meta">Photo 4 · Apr 18, 2022 · 10:42 AM CT</div></div>
                  <div><div className="ph blur"></div><div className="cap">Staging area</div><div className="meta">Photo 5 · Apr 18, 2022 · 10:44 AM CT</div></div>
                  <div><div className="ph blur"></div><div className="cap">Safety signage</div><div className="meta">Photo 6 · Apr 18, 2022 · 10:45 AM CT</div></div>
                </div>
                <h2 className="modal-h2" style={{ marginTop: '16px' }}>Log Notes</h2>
                <p className="modal-p">4/18: Received call for a new water loss - refrigerator leak on kitchen floor with cupping observed. Referral from agent. Inspection scheduled for 11am. Contact information and claim number recorded.</p>
                <h2 className="modal-h2" style={{ marginTop: '16px' }}>Room Notes</h2>
                <ul style={{ margin: '0 0 0 18px', padding: 0, font: '400 10.5px Inter', color: '#0F172A' }}>
                  <li><strong>Kitchen:</strong> Base trim removal; ventilate drywall; remove toe-kick and cupped hardwood; clean and apply plant-based antimicrobial; install drying equipment.</li>
                  <li><strong>Dining Room:</strong> Monitor moisture migration; remove base trim where impacted; detail clean; continue daily monitoring.</li>
                  <li><strong>Basement:</strong> Inspect drop ceiling cavities; remove wet insulation as needed; clean and apply antimicrobial; confirm final moisture goals.</li>
                </ul>
              </div>
              <div className="footer"><div>Powered by Restoration Report</div><div>Page 4 of 15</div></div>
            </section>

            {/* Additional pages would continue here... For brevity, I'll add a few key pages */}
            
            {/* PAGE 11: MOISTURE FULL REPORT */}
            <section className="page">
              <div className="header">
                <div className="header-inner">
                  <div className="brand">
                    <RestorationReportLogo className="w-12 h-12" />
                    <div>
                      <div className="title">Restoration Report</div>
                      <div className="subtitle">Moisture Full Report</div>
                    </div>
                  </div>
                  <div className="contact">
                    <div>1234 Byron Avenue • Elk Grove Village, IL 60007</div>
                    <div>1-800-425-1954 • hello@restorationreport.app</div>
                  </div>
                </div>
                <div className="underline"></div>
              </div>
              <div style={{ marginTop: '1.1in' }}>
                <h2 className="modal-h2">Daily Psychrometric Readings</h2>
                <table className="table stripe">
                  <thead>
                    <tr>
                      <th>Date</th><th>Location</th><th>Temp (°F)</th><th>RH (%)</th><th>GPP</th><th>Grain Depression</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Apr 18, 2022</td><td>Affected Area</td><td>85</td><td>36</td><td>64.6</td><td>—</td></tr>
                    <tr><td>Apr 19, 2022</td><td>Affected Area</td><td>90</td><td>25</td><td>52.4</td><td>12.2</td></tr>
                    <tr><td>Apr 20, 2022</td><td>Affected Area</td><td>86</td><td>22</td><td>49.0</td><td>15.6</td></tr>
                  </tbody>
                </table>
                <h2 className="modal-h2" style={{ marginTop: '14px' }}>Moisture Points (1–4)</h2>
                <table className="table stripe">
                  <thead>
                    <tr><th>Point</th><th>Room</th><th>Surface</th><th>Reading</th><th>Notes</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>1</td><td>Kitchen</td><td>Hardwood</td><td>18%</td><td>Pre-drydown</td></tr>
                    <tr><td>2</td><td>Kitchen</td><td>Hardwood</td><td>12%</td><td>Improving</td></tr>
                    <tr><td>3</td><td>Dining</td><td>Drywall</td><td>11%</td><td>Improving</td></tr>
                    <tr><td>4</td><td>Dining</td><td>Drywall</td><td>8%</td><td>At goal</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="footer"><div>Powered by Restoration Report</div><div>Page 11 of 15</div></div>
            </section>
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