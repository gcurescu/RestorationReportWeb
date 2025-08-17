import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs, deleteJob, duplicateJob } from './storage';

const JobsList = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = () => {
    try {
      const jobsList = getJobs();
      setJobs(jobsList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (jobId, event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteJob(jobId);
      loadJobs();
    }
  };

  const handleDuplicate = (jobId, event) => {
    event.stopPropagation();
    if (window.confirm('Create a duplicate of this job?')) {
      const newJobId = duplicateJob(jobId);
      if (newJobId) {
        loadJobs();
        // Optionally navigate to the duplicated job
        navigate(`/app/job/${newJobId}`);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 text-sm font-medium"
            >
              ← Back to Home
            </button>
            <h1 className="text-lg font-bold text-slate-900 mt-1">My Jobs</h1>
          </div>
          <button
            onClick={() => navigate('/app/new')}
            className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-medium"
          >
            + New Job
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-4xl mx-auto pb-20">
        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <div className="text-slate-400 text-4xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No jobs yet</h2>
            <p className="text-slate-600 mb-4">
              Create your first restoration report to get started.
            </p>
            <button
              onClick={() => navigate('/app/new')}
              className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium"
            >
              Create New Job
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
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-t border-slate-200 hover:bg-slate-50 cursor-pointer"
                      onClick={() => navigate(`/app/job/${job.id}`)}
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {job.claim?.claimId || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {job.policyholder?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {job.claim?.typeOfLoss || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {job.claim?.dateOfLoss ? formatDate(job.claim.dateOfLoss) : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(job.updatedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => handleDuplicate(job.id, e)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
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
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg border border-slate-200 p-4 cursor-pointer"
                  onClick={() => navigate(`/app/job/${job.id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-slate-900">
                        {job.claim?.claimId || 'Untitled Job'}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {job.policyholder?.name || 'No policyholder'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {job.claim?.typeOfLoss || 'N/A'}
                      </span>
                      <button
                        onClick={(e) => handleDuplicate(job.id, e)}
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="Duplicate Job"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => handleDelete(job.id, e)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Delete Job"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>
                      Loss: {job.claim?.dateOfLoss ? formatDate(job.claim.dateOfLoss) : 'N/A'}
                    </span>
                    <span>
                      Updated: {formatDate(job.updatedAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Mobile FAB */}
      <button
        onClick={() => navigate('/app/new')}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl font-light hover:bg-blue-700 transition-colors"
        aria-label="Create New Job"
      >
        +
      </button>
    </div>
  );
};

export default JobsList;
