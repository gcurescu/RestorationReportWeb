import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlimNav } from '../components/nav/SlimNav';
import { DemoConversionBar } from '../components/nav/DemoConversionBar';
import { DemoTooltips } from '../components/demo/DemoTooltips';
import { getJobs, deleteJob, duplicateJob } from './storage';
import { formatDate, formatDateTime } from './utils/formatters';
import { normalizeJob } from './normalizeJob';
import { isDemoMode, ensureDemoSeed, resetDemo } from './demoSeed';

const DEBUG = false;

// Loss type → visual config (used in both modes)
const LOSS_TYPE_CONFIG = {
  Water: { bg: 'bg-blue-100',    text: 'text-blue-800' },
  Fire:  { bg: 'bg-orange-100',  text: 'text-orange-800' },
  Mold:  { bg: 'bg-emerald-100', text: 'text-emerald-800' },
};

const getLossTypeConfig = (type) =>
  LOSS_TYPE_CONFIG[type] || { bg: 'bg-slate-100', text: 'text-slate-700' };

// Derive a status badge from job data completeness
const getJobStatus = (job) => {
  const photoCount =
    (job.photos || []).length +
    (job.rooms || []).reduce((acc, r) => acc + (r.photos || []).length, 0);
  const hasMoisture = (job.moisture?.points || []).length > 0;
  const hasEquipment =
    ((job.equipment?.dehus?.length || 0) +
     (job.equipment?.movers?.length || 0) +
     (job.equipment?.scrubbers?.length || 0)) > 0;

  if (photoCount > 0 && hasMoisture && hasEquipment) {
    return { label: 'Report Ready', bg: 'bg-green-100', text: 'text-green-800' };
  }
  if (photoCount > 0) {
    return { label: 'In Progress', bg: 'bg-amber-100', text: 'text-amber-800' };
  }
  return { label: 'New', bg: 'bg-slate-100', text: 'text-slate-600' };
};

// ─── Demo mode sub-components ──────────────────────────────────────────────────

function HeroSection({ onNewJob }) {
  return (
    <div className="bg-white px-4 pt-8 pb-7 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">
        Restoration Documentation
      </p>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-3">
        Generate professional restoration<br className="hidden sm:inline" /> reports in minutes
      </h1>
      <p className="text-slate-500 text-[15px] max-w-xs mx-auto mb-6 leading-relaxed">
        Create clear, insurance-ready documentation for water, fire, and mold jobs.
      </p>
      <button
        onClick={onNewJob}
        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-2xl shadow-md hover:bg-blue-700 active:bg-blue-800 transition-colors min-h-[56px] text-base w-full sm:w-auto"
      >
        + Start a New Job
      </button>
    </div>
  );
}

const VALUE_ITEMS = [
  {
    label: 'Insurance-ready formatting',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-blue-600" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    label: 'Cleaner documentation',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-blue-600" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="13" y2="17" />
      </svg>
    ),
  },
  {
    label: 'Faster report turnaround',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-blue-600" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

function ValueStrip() {
  return (
    <div className="bg-slate-50 border-t border-b border-slate-200 px-4 py-5">
      <div className="max-w-md mx-auto flex justify-around gap-3">
        {VALUE_ITEMS.map(({ label, icon }) => (
          <div key={label} className="flex flex-col items-center gap-2 text-center flex-1">
            {icon}
            <span className="text-xs font-medium text-slate-600 leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DemoJobCard({ job, onView }) {
  const lossConfig = getLossTypeConfig(job.claim?.typeOfLoss);
  const status = getJobStatus(job);
  const summary = job.claim?.summary || '';
  const shortSummary = summary.length > 160 ? summary.slice(0, 157) + '…' : summary;

  return (
    <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      {/* Loss type + Status row */}
      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${lossConfig.bg} ${lossConfig.text}`}>
          {job.claim?.typeOfLoss || 'Unknown'} Damage
        </span>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
          {status.label}
        </span>
      </div>

      {/* Address */}
      <p className="text-base font-semibold text-slate-900 leading-snug mb-1">
        {job.policyholder?.address || 'Address not provided'}
      </p>

      {/* Date of loss */}
      <p className="text-sm text-slate-500 mb-4">
        Loss date:{' '}
        <span className="font-medium text-slate-700">
          {job.claim?.dateOfLoss ? formatDate(job.claim.dateOfLoss) : 'N/A'}
        </span>
      </p>

      {/* Summary excerpt */}
      {shortSummary && (
        <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 mb-5">
          {shortSummary}
        </p>
      )}

      {/* Primary CTA */}
      <button
        onClick={() => onView(job.id)}
        className="w-full py-3.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors min-h-[52px]"
      >
        View Report →
      </button>
    </article>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

const JobsList = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [demoMode] = useState(isDemoMode());
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (demoMode) {
      ensureDemoSeed();
    }
    loadJobs();
  }, [demoMode]);

  const loadJobs = () => {
    try {
      const jobsList = getJobs();
      const normalizedJobs = jobsList.map(normalizeJob);
      setJobs(normalizedJobs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = useCallback(() => {
    let filtered = jobs;
    if (searchTerm) {
      filtered = filtered.filter(job =>
        (job.claim?.claimId?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.policyholder?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.claim?.carrier?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (filterType !== 'all') {
      filtered = filtered.filter(job => job.claim?.typeOfLoss === filterType);
    }
    setFilteredJobs(filtered);
  }, [jobs, searchTerm, filterType]);

  useEffect(() => {
    filterJobs();
  }, [filterJobs]);

  const handleDelete = async (jobId, event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(jobId);
        loadJobs();
      } catch (error) {
        if (DEBUG) console.error('Error deleting job:', error);
        setErrorMessage('Error deleting job. Please try again.');
        setTimeout(() => setErrorMessage(null), 5000);
      }
    }
  };

  const handleDuplicate = async (jobId, event) => {
    event.stopPropagation();
    if (window.confirm('Create a duplicate of this job?')) {
      try {
        const newJobId = await duplicateJob(jobId);
        if (newJobId) {
          loadJobs();
          navigate(`/app/job/${newJobId}`);
        }
      } catch (error) {
        if (DEBUG) console.error('Error duplicating job:', error);
        setErrorMessage('Error duplicating job. Please try again.');
        setTimeout(() => setErrorMessage(null), 5000);
      }
    }
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset demo data? This will restore the 3 sample jobs.')) {
      resetDemo();
      loadJobs();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm text-slate-500">Loading jobs…</p>
        </div>
      </div>
    );
  }

  // Shared error banner — rendered once, used in both mode branches
  const errorBanner = errorMessage && (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-red-50 border border-red-200 rounded-md p-4 shadow-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
          <div className="ml-3">
            <button
              onClick={() => setErrorMessage(null)}
              className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Demo mode ────────────────────────────────────────────────────────────────
  if (demoMode) {
    return (
      <div className="min-h-screen bg-slate-50">
        {errorBanner}

        <DemoTooltips steps={[
          {
            targetSelector: '.space-y-4 > div:first-child',
            message: 'Click any job to see a complete restoration report',
            position: 'bottom',
          },
          {
            targetSelector: 'button:contains("New Job")',
            message: 'You can create new reports from scratch in under 60 seconds',
            position: 'bottom',
          },
        ]} />
        <DemoConversionBar />
        <SlimNav
          onLogoClick={() => navigate('/')}
          action={
            <button
              onClick={() => navigate('/app/new')}
              className="px-3 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold min-h-[44px] hover:bg-blue-700 transition-colors"
            >
              + New Job
            </button>
          }
        />

        <HeroSection onNewJob={() => navigate('/app/new')} />
        <ValueStrip />

        {/* Sample job cards */}
        <div className="px-4 pt-6 pb-28 max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Sample Jobs
            </h2>
            <button
              onClick={handleResetDemo}
              className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
            >
              Reset demo data
            </button>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <p className="text-slate-500 mb-4 text-sm">No sample jobs loaded.</p>
              <button
                onClick={() => { resetDemo(); loadJobs(); }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold min-h-[44px] hover:bg-blue-700 transition-colors"
              >
                Load Sample Jobs
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map(job => (
                <DemoJobCard
                  key={job.id}
                  job={job}
                  onView={(id) => navigate(`/app/job/${id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Normal mode ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      {errorBanner}

      <SlimNav
        onLogoClick={() => navigate('/')}
        action={
          <button
            onClick={() => navigate('/app/new')}
            className="px-3 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold min-h-[44px] hover:bg-blue-700 transition-colors"
          >
            + New Job
          </button>
        }
      />

      {/* Search and Filters */}
      {jobs.length > 0 && (
        <div className="bg-white border-b px-4 py-3">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by claim ID, policyholder, or carrier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
            >
              <option value="all">All Types</option>
              <option value="Water">Water</option>
              <option value="Fire">Fire</option>
              <option value="Mold">Mold</option>
            </select>
          </div>

          {(searchTerm || filterType !== 'all') && (
            <div className="max-w-4xl mx-auto mt-2 text-sm text-slate-600">
              Showing {filteredJobs.length} of {jobs.length} jobs
              {searchTerm && <span> matching "{searchTerm}"</span>}
              {filterType !== 'all' && <span> · {filterType} losses</span>}
              <button
                onClick={() => { setSearchTerm(''); setFilterType('all'); }}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4 max-w-4xl mx-auto pb-20">
        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">No jobs yet</h2>
            <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
              Create your first restoration report to get started.
            </p>
            <button
              onClick={() => navigate('/app/new')}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors min-h-[48px] text-sm"
            >
              + Create New Job
            </button>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">No matching jobs</h2>
            <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
              Try adjusting your search terms or filters.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setFilterType('all'); }}
              className="px-6 py-3 rounded-xl bg-slate-600 text-white font-semibold hover:bg-slate-700 active:bg-slate-800 transition-colors min-h-[48px] text-sm"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Claim ID</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Policyholder</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Loss Type</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Date of Loss</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Updated</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => {
                    const lc = getLossTypeConfig(job.claim?.typeOfLoss);
                    return (
                      <tr
                        key={job.id}
                        className="border-t border-slate-200 hover:bg-slate-50 cursor-pointer"
                        onClick={() => navigate(`/app/job/${job.id}`)}
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {job.claim?.claimId || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          <div className="font-medium">{job.policyholder?.name || 'N/A'}</div>
                          <div className="text-xs text-slate-500">{job.claim?.carrier || 'No carrier'}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${lc.bg} ${lc.text}`}>
                            {job.claim?.typeOfLoss || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-sm">
                          {job.claim?.dateOfLoss ? formatDate(job.claim.dateOfLoss) : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-sm">
                          <div>{formatDate(job.updatedAt)}</div>
                          <div className="text-xs text-slate-400">{formatDateTime(job.updatedAt, 'h:mm A')}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate(`/app/job/${job.id}`); }}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Open
                            </button>
                            <button
                              onClick={(e) => handleDuplicate(job.id, e)}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              Duplicate
                            </button>
                            <button
                              onClick={(e) => handleDelete(job.id, e)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {filteredJobs.map((job) => {
                const lc = getLossTypeConfig(job.claim?.typeOfLoss);
                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-lg border border-slate-200 p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => navigate(`/app/job/${job.id}`)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900 mb-1">
                          {job.claim?.claimId || 'Untitled Job'}
                        </h3>
                        <p className="text-sm text-slate-600 mb-1">
                          {job.policyholder?.name || 'No policyholder'}
                        </p>
                        {job.claim?.carrier && (
                          <p className="text-xs text-slate-500">{job.claim.carrier}</p>
                        )}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${lc.bg} ${lc.text}`}>
                        {job.claim?.typeOfLoss || 'N/A'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-500 mb-3">
                      <span>Loss: {job.claim?.dateOfLoss ? formatDate(job.claim.dateOfLoss) : 'N/A'}</span>
                      <span>Updated: {formatDate(job.updatedAt)}</span>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-slate-100">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/app/job/${job.id}`); }}
                        className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold min-h-[44px] hover:bg-blue-700 active:bg-blue-800 transition-colors"
                      >
                        Open
                      </button>
                      <button
                        onClick={(e) => handleDuplicate(job.id, e)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium min-h-[44px] hover:bg-slate-50 active:bg-slate-100 transition-colors"
                      >
                        Copy
                      </button>
                      <button
                        onClick={(e) => handleDelete(job.id, e)}
                        className="px-4 py-2.5 rounded-xl border border-red-100 text-red-500 text-sm font-medium min-h-[44px] hover:bg-red-50 active:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Mobile FAB */}
      <button
        onClick={() => navigate('/app/new')}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl font-light hover:bg-blue-700 transition-colors z-20"
        aria-label="Create New Job"
      >
        +
      </button>
    </div>
  );
};

export default JobsList;
