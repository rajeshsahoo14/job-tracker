import React, { useState, useEffect } from 'react';

const JobForm = ({ job, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    location: '',
    salary: '',
    jobUrl: '',
    notes: '',
    appliedDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (job) {
      setFormData({
        company: job.company || '',
        role: job.role || '',
        status: job.status || 'Applied',
        location: job.location || '',
        salary: job.salary || '',
        jobUrl: job.jobUrl || '',
        notes: job.notes || '',
        appliedDate: job.appliedDate ? new Date(job.appliedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
    }
  }, [job]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Job role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.company ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g., Google, Microsoft"
          />
          {errors.company && <p className="mt-1 text-xs text-red-500">{errors.company}</p>}
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            Job Role <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.role ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g., Software Engineer"
          />
          {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role}</p>}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
            <option value="Accepted">Accepted</option>
          </select>
        </div>

        {/* Applied Date */}
        <div>
          <label htmlFor="appliedDate" className="block text-sm font-medium text-gray-700 mb-2">
            Applied Date
          </label>
          <input
            type="date"
            id="appliedDate"
            name="appliedDate"
            value={formData.appliedDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., San Francisco, CA"
          />
        </div>

        {/* Salary */}
        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
            Salary Range
          </label>
          <input
            type="text"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., $80k - $120k"
          />
        </div>
      </div>

      {/* Job URL */}
      <div>
        <label htmlFor="jobUrl" className="block text-sm font-medium text-gray-700 mb-2">
          Job Posting URL
        </label>
        <input
          type="url"
          id="jobUrl"
          name="jobUrl"
          value={formData.jobUrl}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://..."
        />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add any additional notes or comments..."
        ></textarea>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? 'Saving...' : job ? 'Update Job' : 'Add Job'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default JobForm;