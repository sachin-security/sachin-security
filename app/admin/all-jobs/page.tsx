// app/admin/all-jobs/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Briefcase, Filter, Calendar, MapPin, DollarSign, Users, Eye, Edit, Trash2, X } from 'lucide-react';

// Sample jobs data
const sampleJobs = [
  {
    id: 'JOB001',
    title: 'Security Guard',
    department: 'Operations',
    location: 'Vadodara, Gujarat',
    type: 'Full-time',
    experience: '0-2 years',
    salary: '₹15,000 - ₹20,000/month',
    postedDate: '2025-01-15',
    status: 'Active',
    applicantsCount: 45
  },
  {
    id: 'JOB002',
    title: 'Security Supervisor',
    department: 'Operations',
    location: 'Multiple Locations (Gujarat)',
    type: 'Full-time',
    experience: '3-5 years',
    salary: '₹25,000 - ₹35,000/month',
    postedDate: '2025-01-10',
    status: 'Active',
    applicantsCount: 28
  },
  {
    id: 'JOB003',
    title: 'Female Security Guard',
    department: 'Operations',
    location: 'Hospitals & Malls - Vadodara',
    type: 'Full-time',
    experience: '0-3 years',
    salary: '₹16,000 - ₹22,000/month',
    postedDate: '2025-01-05',
    status: 'Active',
    applicantsCount: 32
  },
  {
    id: 'JOB004',
    title: 'Area Manager',
    department: 'Management',
    location: 'Vadodara, Gujarat',
    type: 'Full-time',
    experience: '5-8 years',
    salary: '₹40,000 - ₹55,000/month',
    postedDate: '2024-12-20',
    status: 'Inactive',
    applicantsCount: 15
  },
  {
    id: 'JOB005',
    title: 'Armed Security Guard',
    department: 'Operations',
    location: 'Banks - Multiple Cities',
    type: 'Full-time',
    experience: '2-4 years',
    salary: '₹22,000 - ₹28,000/month',
    postedDate: '2024-12-15',
    status: 'Inactive',
    applicantsCount: 18
  }
];

export default function AllJobsPage() {
  const [jobs, setJobs] = useState(sampleJobs);
  const [filteredJobs, setFilteredJobs] = useState(sampleJobs);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    status: 'all',
    sortBy: 'newest'
  });

  // Apply filters
  const applyFilters = () => {
    let results = [...jobs];
    
    // Filter by status
    if (filters.status !== 'all') {
      results = results.filter(job => job.status.toLowerCase() === filters.status);
    }
    
    // Sort
    if (filters.sortBy === 'newest') {
      results.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    } else if (filters.sortBy === 'oldest') {
      results.sort((a, b) => new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime());
    } else if (filters.sortBy === 'most-applicants') {
      results.sort((a, b) => b.applicantsCount - a.applicantsCount);
    } else if (filters.sortBy === 'least-applicants') {
      results.sort((a, b) => a.applicantsCount - b.applicantsCount);
    }
    
    setFilteredJobs(results);
    setShowFilters(false);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({ status: 'all', sortBy: 'newest' });
    setFilteredJobs(jobs);
  };

  // Toggle job status
  const toggleStatus = (jobId: string) => {
    const updated = jobs.map(job => {
      if (job.id === jobId) {
        return { ...job, status: job.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return job;
    });
    setJobs(updated);
    setFilteredJobs(updated);
  };

  // Delete job
  const deleteJob = (jobId: string) => {
    if (confirm('Are you sure you want to delete this job posting?')) {
      const updated = jobs.filter(job => job.id !== jobId);
      setJobs(updated);
      setFilteredJobs(updated);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Job Postings</h1>
        <p className="text-gray-600">Manage and view all job openings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Jobs</p>
              <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
            </div>
            <Briefcase className="w-10 h-10 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Active Jobs</p>
              <p className="text-3xl font-bold text-green-600">
                {jobs.filter(j => j.status === 'Active').length}
              </p>
            </div>
            <Briefcase className="w-10 h-10 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Inactive Jobs</p>
              <p className="text-3xl font-bold text-red-600">
                {jobs.filter(j => j.status === 'Inactive').length}
              </p>
            </div>
            <Briefcase className="w-10 h-10 text-red-400" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Applicants</p>
              <p className="text-3xl font-bold text-amber-600">
                {jobs.reduce((sum, job) => sum + job.applicantsCount, 0)}
              </p>
            </div>
            <Users className="w-10 h-10 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Filter & Sort</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="most-applicants">Most Applicants</option>
                  <option value="least-applicants">Least Applicants</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={applyFilters}
                className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 font-semibold"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Jobs Grid */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:border-amber-400"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Job Info */}
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        job.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{job.department}</p>

                    {/* Job Details Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Posted: {job.postedDate}</span>
                      </div>
                    </div>

                    {/* Applicants Count */}
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {job.applicantsCount} Applicants
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex lg:flex-col gap-2 lg:w-48">
                <Link
                  href={`/admin/all-jobs/${job.id}`}
                  className="flex-1 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 font-semibold text-center flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Link>
                
                <button
                  onClick={() => toggleStatus(job.id)}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold ${
                    job.status === 'Active'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {job.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
                
                <button
                  className="flex-1 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 font-semibold flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                
                <button
                  onClick={() => deleteJob(job.id)}
                  className="flex-1 border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 font-semibold flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Jobs Found</h3>
            <p className="text-gray-600">Try adjusting your filters or create a new job posting</p>
          </div>
        )}
      </div>
    </div>
  );
}
