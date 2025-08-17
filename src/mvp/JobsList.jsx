import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs, deleteJob, duplicateJob } from './storage';
import { formatDate, formatDateTime } from './utils/formatters';

const JobsList = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, filterType]);

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

  const filterJobs = () => {
    let filtered = jobs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(job => 
        (job.claim?.claimId?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.policyholder?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.claim?.carrier?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by loss type
    if (filterType !== 'all') {
      filtered = filtered.filter(job => job.claim?.typeOfLoss === filterType);
    }

    setFilteredJobs(filtered);
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
            className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-medium min-h-[44px] hover:bg-blue-700 transition-colors"
          >
            + New Job
          </button>
        </div>
      </div>

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
              {filterType !== 'all' && <span> • {filterType} losses</span>}
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
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <div className="text-slate-400 text-4xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No jobs yet</h2>
            <p className="text-slate-600 mb-4">
              Create your first restoration report to get started.
            </p>
            <button
              onClick={() => navigate('/app/new')}
              className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors min-h-[44px]"
            >
              Create New Job
            </button>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <div className="text-slate-400 text-4xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No matching jobs</h2>
            <p className="text-slate-600 mb-4">
              Try adjusting your search terms or filters.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setFilterType('all'); }}
              className="px-4 py-2 rounded-md bg-slate-600 text-white font-medium hover:bg-slate-700 transition-colors"
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
                  {filteredJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-t border-slate-200 hover:bg-slate-50 cursor-pointer"
                      onClick={() => navigate(`/app/job/${job.id}`)}
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {job.claim?.claimId || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        <div>
                          <div className="font-medium">{job.policyholder?.name || 'N/A'}</div>
                          <div className="text-xs text-slate-500">{job.claim?.carrier || 'No carrier'}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {job.claim?.typeOfLoss || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-sm">
                        {job.claim?.dateOfLoss ? formatDate(job.claim.dateOfLoss) : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-sm">
                        <div>
                          <div>{formatDate(job.updatedAt)}</div>
                          <div className="text-xs text-slate-400">{formatDateTime(job.updatedAt, 'h:mm A')}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/app/job/${job.id}`);
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            title="Open Report"
                          >
                            Open
                          </button>
                          <button
                            onClick={(e) => handleDuplicate(job.id, e)}
                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                            title="Duplicate Job"
                          >
                            Duplicate
                          </button>
                          <button
                            onClick={(e) => handleDelete(job.id, e)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                            title="Delete Job"
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
              {filteredJobs.map((job) => (
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
                        <p className="text-xs text-slate-500">
                          {job.claim.carrier}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {job.claim?.typeOfLoss || 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-slate-500 mb-3">
                    <span>
                      Loss: {job.claim?.dateOfLoss ? formatDate(job.claim.dateOfLoss) : 'N/A'}
                    </span>
                    <span>
                      Updated: {formatDate(job.updatedAt)}
                    </span>
                  </div>

                  <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/app/job/${job.id}`);
                      }}
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
                </div>
              ))}
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
