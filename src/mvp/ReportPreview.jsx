import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getJob } from './storage';

const ReportPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const reportRef = useRef();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const jobData = getJob(id);
    if (!jobData) {
      navigate('/app/jobs');
      return;
    }
    setJob(jobData);
    setLoading(false);
  }, [id, navigate]);

  const generatePDF = async () => {
    if (!reportRef.current) return;
    
    setGenerating(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'letter');
      const pages = reportRef.current.querySelectorAll('.rr-page');
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }
      
      const fileName = `restoration-report-${job.claim?.claimId || 'untitled'}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setGenerating(false);
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

  const ReportTable = ({ title, headers, data }) => (
    <div className="mb-6">
      <h3 className="font-semibold text-slate-900 mb-3">{title}</h3>
      <div className="overflow-x-auto">
        <table className="rr-table w-full border border-slate-300 text-sm">
          <thead>
            <tr className="bg-slate-100">
              {headers.map((header, index) => (
                <th key={index} className="border border-slate-300 px-2 py-2 text-left font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? data.map((row, index) => (
              <tr key={index}>
                {headers.map((header, cellIndex) => (
                  <td key={cellIndex} className="border border-slate-300 px-2 py-1">
                    {row[header.toLowerCase().replace(/[^a-z0-9]/g, '')] || '-'}
                  </td>
                ))}
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

  const PhotoGrid = ({ photos = [] }) => (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {photos.map((photo, index) => (
        <div key={index} className="aspect-video bg-slate-100 rounded overflow-hidden">
          {photo.file ? (
            <img
              src={photo.file}
              alt={photo.caption || `Photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <div className="text-center">
                <div className="text-2xl mb-2">📷</div>
                <div className="text-xs">Photo Placeholder</div>
              </div>
            </div>
          )}
          {photo.caption && (
            <div className="p-2 bg-white border-t">
              <p className="text-xs text-slate-600">{photo.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sticky Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/app/jobs')}
              className="text-blue-600 text-sm font-medium"
            >
              ← Back to Jobs
            </button>
            <h1 className="text-lg font-bold text-slate-900 mt-1">
              Report Preview
            </h1>
          </div>
          <button
            onClick={generatePDF}
            disabled={generating}
            className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-medium disabled:opacity-60"
          >
            {generating ? 'Generating...' : 'Generate PDF'}
          </button>
        </div>
      </div>

      {/* Report Container */}
      <div className="p-4">
        <div ref={reportRef} className="max-w-4xl mx-auto">
          {/* Page 1: Cover/Claim Summary */}
          <div className="rr-page bg-white rounded-lg shadow-sm mb-6 p-8" style={{ minHeight: '11in' }}>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Restoration Report
              </h1>
              <div className="text-lg text-slate-600">
                {job.claim?.typeOfLoss} Damage Assessment
              </div>
            </div>

            {/* Key Information Panels */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h2 className="font-semibold text-slate-900 mb-3">Company Information</h2>
                <div className="space-y-2 text-sm">
                  <div><strong>Company:</strong> {job.company?.name || 'N/A'}</div>
                  <div><strong>Phone:</strong> {job.company?.phone || 'N/A'}</div>
                  <div><strong>Email:</strong> {job.company?.email || 'N/A'}</div>
                  <div><strong>Address:</strong> {job.company?.address || 'N/A'}</div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h2 className="font-semibold text-slate-900 mb-3">Claim Details</h2>
                <div className="space-y-2 text-sm">
                  <div><strong>Claim ID:</strong> {job.claim?.claimId || 'N/A'}</div>
                  <div><strong>Carrier:</strong> {job.claim?.carrier || 'N/A'}</div>
                  <div><strong>Adjuster:</strong> {job.claim?.adjuster || 'N/A'}</div>
                  <div><strong>Date of Loss:</strong> {job.claim?.dateOfLoss || 'N/A'}</div>
                  <div><strong>Policyholder:</strong> {job.policyholder?.name || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Claim Summary */}
            <div className="mb-8">
              <h2 className="font-semibold text-slate-900 mb-3">Claim Summary</h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {job.claim?.summary || 'No summary provided.'}
              </p>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 left-8 right-8 flex justify-between text-xs text-slate-500 border-t pt-2">
              <span>Powered by Restoration Report</span>
              <span>Page 1 of 5</span>
            </div>
          </div>

          {/* Page 2: Notes and Photos */}
          <div className="rr-page bg-white rounded-lg shadow-sm mb-6 p-8" style={{ minHeight: '11in' }}>
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Notes & Overview</h1>

            {/* Notes Sections */}
            <div className="mb-8">
              <h2 className="font-semibold text-slate-900 mb-3">General Notes</h2>
              <p className="text-sm text-slate-700 mb-4">
                {job.notes?.general || 'No general notes provided.'}
              </p>

              <h2 className="font-semibold text-slate-900 mb-3">Kitchen Notes</h2>
              <p className="text-sm text-slate-700 mb-4">
                {job.notes?.kitchen || 'No kitchen notes provided.'}
              </p>

              <h2 className="font-semibold text-slate-900 mb-3">Basement Notes</h2>
              <p className="text-sm text-slate-700 mb-4">
                {job.notes?.basement || 'No basement notes provided.'}
              </p>
            </div>

            {/* Overview Photos */}
            <div className="mb-8">
              <h2 className="font-semibold text-slate-900 mb-3">Overview Photos</h2>
              <PhotoGrid photos={job.photos?.slice(0, 4)} />
            </div>

            <div className="absolute bottom-8 left-8 right-8 flex justify-between text-xs text-slate-500 border-t pt-2">
              <span>Powered by Restoration Report</span>
              <span>Page 2 of 5</span>
            </div>
          </div>

          {/* Page 3: Moisture Data */}
          <div className="rr-page bg-white rounded-lg shadow-sm mb-6 p-8" style={{ minHeight: '11in' }}>
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Moisture Assessment</h1>

            <ReportTable
              title="Psychrometric Readings"
              headers={['Date', 'Location', 'Temp °F', 'RH %', 'GPP', 'GD']}
              data={job.moisture?.psychrometrics}
            />

            <ReportTable
              title="Moisture Points"
              headers={['Point', 'Room', 'Surface', 'Reading', 'Notes']}
              data={job.moisture?.points}
            />

            <div className="absolute bottom-8 left-8 right-8 flex justify-between text-xs text-slate-500 border-t pt-2">
              <span>Powered by Restoration Report</span>
              <span>Page 3 of 5</span>
            </div>
          </div>

          {/* Page 4: Equipment */}
          <div className="rr-page bg-white rounded-lg shadow-sm mb-6 p-8" style={{ minHeight: '11in' }}>
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Equipment</h1>

            <ReportTable
              title="Dehumidifiers"
              headers={['Name', 'Placed', 'Removed', 'Power (kW)', 'Energy (kWh)', 'Days']}
              data={job.equipment?.dehus}
            />

            <ReportTable
              title="Air Movers"
              headers={['Name', 'Placed', 'Removed', 'Energy (kWh)', 'Days']}
              data={job.equipment?.movers}
            />

            <ReportTable
              title="Air Scrubbers"
              headers={['Name', 'Placed', 'Removed', 'Energy (kWh)', 'Days']}
              data={job.equipment?.scrubbers}
            />

            <div className="absolute bottom-8 left-8 right-8 flex justify-between text-xs text-slate-500 border-t pt-2">
              <span>Powered by Restoration Report</span>
              <span>Page 4 of 5</span>
            </div>
          </div>

          {/* Page 5: Scope and Additional Photos */}
          <div className="rr-page bg-white rounded-lg shadow-sm mb-6 p-8" style={{ minHeight: '11in' }}>
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Scope & Documentation</h1>

            <div className="mb-8">
              <h2 className="font-semibold text-slate-900 mb-3">Scope of Work</h2>
              <p className="text-sm text-slate-700 mb-6">
                {job.notes?.scope || 'No scope notes provided.'}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="font-semibold text-slate-900 mb-3">Additional Photos</h2>
              <PhotoGrid photos={job.photos?.slice(4)} />
            </div>

            <div className="absolute bottom-8 left-8 right-8 flex justify-between text-xs text-slate-500 border-t pt-2">
              <span>Powered by Restoration Report</span>
              <span>Page 5 of 5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
