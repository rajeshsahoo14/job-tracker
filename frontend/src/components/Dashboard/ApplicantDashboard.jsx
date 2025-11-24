import React, { useState, useEffect } from 'react';
import { jobAPI } from '../../services/api';
import { toast } from 'react-toastify';
import JobList from '../Jobs/JobList';
import JobFilters from '../Jobs/JobFilters';
import JobForm from '../Jobs/JobForm';

const ApplicantDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewJob, setViewJob] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [filters, setFilters] = useState({
    status: 'all',
    sortBy: 'newest',
    search: ''
  });

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, filters]);

  // Recalculate stats whenever jobs change
  useEffect(() => {
    calculateStats();
  }, [jobs]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getAll();
      setJobs(response.data.jobs);
    } catch (error) {
      toast.error('Failed to fetch jobs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await jobAPI.getStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  };

  const calculateStats = () => {
    const byStatus = {
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0
    };

    jobs.forEach(job => {
      if (byStatus.hasOwnProperty(job.status)) {
        byStatus[job.status]++;
      }
    });

    setStats({
      total: jobs.length,
      byStatus
    });
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(job => job.status === filters.status);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(job =>
        job.company.toLowerCase().includes(searchLower) ||
        job.role.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.appliedDate) - new Date(b.appliedDate));
        break;
      case 'company':
        filtered.sort((a, b) => a.company.localeCompare(b.company));
        break;
      default:
        break;
    }

    setFilteredJobs(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = (value) => {
    setFilters(prev => ({
      ...prev,
      search: value
    }));
  };

  const handleAddJob = () => {
    setSelectedJob(null);
    setShowModal(true);
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleViewJob = (job) => {
    setViewJob(job);
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job application?')) {
      return;
    }

    try {
      // Optimistically update UI immediately
      setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
      
      // Then sync with backend
      await jobAPI.delete(jobId);
      toast.success('Job deleted successfully');
    } catch (error) {
      toast.error('Failed to delete job');
      console.error(error);
      // Revert on error
      fetchJobs();
    }
  };

  const handleSubmitJob = async (formData) => {
  try {
    setFormLoading(true);

    if (selectedJob) {
      // UPDATE: Optimistically update the job immediately
      const updatedJobData = {
        ...selectedJob,
        ...formData,
        // Add status history if status changed
        statusHistory: formData.status !== selectedJob.status
          ? [
              ...(selectedJob.statusHistory || []),
              {
                status: formData.status,
                date: new Date().toISOString(),
                notes: formData.notes || ''
              }
            ]
          : selectedJob.statusHistory
      };

      setJobs(prevJobs =>
        prevJobs.map(job =>
          job._id === selectedJob._id ? updatedJobData : job
        )
      );

      // Close modal and reset state IMMEDIATELY
      setShowModal(false);
      setSelectedJob(null);
      setFormLoading(false);

      // Then sync with backend in the background
      await jobAPI.update(selectedJob._id, formData);
      toast.success('Job updated successfully');
    } else {
      // ADD: Optimistically add the new job
      const newJobData = {
        ...formData,
        _id: 'temp_' + Date.now(), // Temporary ID
        appliedDate: new Date().toISOString(),
        statusHistory: [{
          status: formData.status,
          date: new Date().toISOString(),
          notes: formData.notes || ''
        }]
      };

      setJobs(prevJobs => [...prevJobs, newJobData]);

      // Close modal and reset state IMMEDIATELY
      setShowModal(false);
      setSelectedJob(null);
      setFormLoading(false);

      // Then sync with backend and replace temp ID
      const response = await jobAPI.create(formData);
      const createdJob = response.data.job;
      
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job._id === newJobData._id ? createdJob : job
        )
      );

      toast.success('Job added successfully');
    }
  } catch (error) {
    toast.error(selectedJob ? 'Failed to update job' : 'Failed to add job');
    console.error(error);
    
    // Reset loading state on error
    setFormLoading(false);
    
    // Revert on error
    fetchJobs();
  }
};

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedJob(null);
  };

  const handleCloseView = () => {
    setViewJob(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Job Applications</h1>
          <p className="text-gray-600 mt-2">Track and manage your job applications</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Applied</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.byStatus?.Applied || 0}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Interview</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.byStatus?.Interview || 0}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Offer</p>
                  <p className="text-2xl font-bold text-green-600">{stats.byStatus?.Offer || 0}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.byStatus?.Rejected || 0}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Job Button */}
        <div className="mb-6">
          <button
            onClick={handleAddJob}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Job
          </button>
        </div>

        {/* Filters */}
        <JobFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

        {/* Job List */}
        <JobList
          jobs={filteredJobs}
          loading={loading}
          onEdit={handleEditJob}
          onDelete={handleDeleteJob}
          onView={handleViewJob}
        />

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold mb-6">
                {selectedJob ? 'Edit Job Application' : 'Add New Job Application'}
              </h2>
              <JobForm
                job={selectedJob}
                onSubmit={handleSubmitJob}
                onCancel={handleCloseModal}
                loading={formLoading}
              />
            </div>
          </div>
        )}

        {/* View Job Details Modal */}
        {viewJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Job Details</h2>
                <button
                  onClick={handleCloseView}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Company</label>
                  <p className="text-lg font-semibold">{viewJob.company}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Role</label>
                  <p className="text-lg">{viewJob.role}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <p className="text-lg">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${viewJob.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                        viewJob.status === 'Interview' ? 'bg-yellow-100 text-yellow-800' :
                          viewJob.status === 'Offer' ? 'bg-green-100 text-green-800' :
                            viewJob.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                              'bg-purple-100 text-purple-800'
                      }`}>
                      {viewJob.status}
                    </span>
                  </p>
                </div>

                {viewJob.location && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Location</label>
                    <p className="text-lg">{viewJob.location}</p>
                  </div>
                )}

                {viewJob.salary && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Salary Range</label>
                    <p className="text-lg">{viewJob.salary}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-600">Applied Date</label>
                  <p className="text-lg">{new Date(viewJob.appliedDate).toLocaleDateString()}</p>
                </div>

                {viewJob.jobUrl && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Job URL</label>
                    <p className="text-lg">
                      <a href={viewJob.jobUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View Job Posting
                      </a>
                    </p>
                  </div>
                )}

                {viewJob.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Notes</label>
                    <p className="text-lg whitespace-pre-wrap">{viewJob.notes}</p>
                  </div>
                )}

                {viewJob.statusHistory && viewJob.statusHistory.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status History</label>
                    <div className="mt-2 space-y-2">
                      {viewJob.statusHistory.map((history, index) => (
                        <div key={index} className="border-l-2 border-blue-500 pl-4 py-2">
                          <p className="font-semibold">{history.status}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(history.date).toLocaleString()}
                          </p>
                          {history.notes && <p className="text-sm mt-1">{history.notes}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => {
                    handleCloseView();
                    handleEditJob(viewJob);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleCloseView}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantDashboard;