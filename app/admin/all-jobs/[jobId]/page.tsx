// app/admin/all-jobs/[jobId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ApplicantDetailsModal from '@/app/components/ApplicantDetailsModal';
import { 
  ArrowLeft, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  Loader2
} from 'lucide-react';
import { downloadFile } from '@/app/lib/downloadutils';

export default function JobApplicantsPage() {
  const params = useParams();
  const jobId = params.jobId as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<any[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch job and applicants data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch job details by ID
        const jobResponse = await fetch(`/api/jobs/${jobId}`);
        const jobData = await jobResponse.json();
        
        if (jobData.success) {
          setJob(jobData.data);
        } else {
          console.error('Job not found:', jobData.error);
          setJob(null);
        }
        
        // Fetch applicants for this job
        const applicantsResponse = await fetch(`/api/applicants?jobId=${jobId}`);
        const applicantsData = await applicantsResponse.json();
        
        if (applicantsData.success) {
          setApplicants(applicantsData.data);
          setFilteredApplicants(applicantsData.data);
        } else {
          console.error('Failed to fetch applicants:', applicantsData.error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [jobId]);

  // Filter applicants by status
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredApplicants(applicants);
    } else {
      setFilteredApplicants(
        applicants.filter(app => app.status.toLowerCase() === statusFilter)
      );
    }
  }, [statusFilter, applicants]);

  // View applicant details
  const handleViewDetails = (applicant: any) => {
    setSelectedApplicant({
      ...applicant,
      jobTitle: job?.title,
      jobId: job?.id
    });
    setShowDetailsModal(true);
  };

  // Update applicant status via API
  const handleStatusUpdate = async (applicantId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/applicants/${applicantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setApplicants(applicants.map(app => 
          app.id === applicantId ? { ...app, status: newStatus } : app
        ));
      } else {
        alert('Failed to update applicant status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update applicant status');
    }
  };

  // Download resume
  const downloadResume = async (applicant: any) => {
    if (applicant.resumeUrl) {
        console.log(applicant)
        const success = await downloadFile(applicant.resumeUrl, applicant.resumeFilename);
        alert('Downloaded Successfully');
         if (!success) {
        alert('Download failed');
  }
    //   window.open(applicant.resumeUrl, '_blank');
    } else {
      alert('Resume not available');
    }
  };

  // Export applicants to CSV
  const handleExport = () => {
    const csv = [
      ['ID', 'Name', 'Email', 'Phone', 'Education', 'Experience', 'Status', 'Applied Date'].join(','),
      ...filteredApplicants.map(app => [
        app.id,
        app.fullName,
        app.email,
        app.phone,
        app.education,
        app.experience,
        app.status,
        app.appliedDate
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applicants_${jobId}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Calculate stats
  const stats = {
    total: applicants.length,
    pending: applicants.filter(a => a.status === 'Pending').length,
    shortlisted: applicants.filter(a => a.status === 'Shortlisted').length,
    rejected: applicants.filter(a => a.status === 'Rejected').length
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  // Job not found
  if (!job) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/admin/all-jobs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <Link
        href="/admin/all-jobs"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Jobs
      </Link>

      {/* Job Details Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-amber-100 flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                  job.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {job.status}
                </span>
              </div>
              <p className="text-lg text-gray-600">{job.department}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Job ID</p>
            <p className="font-bold text-gray-900">{job.id}</p>
          </div>
        </div>

        {/* Job Info Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium text-gray-900">{job.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Job Type</p>
              <p className="font-medium text-gray-900">{job.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="w-5 h-5 text-gray-400" >₹</p>
            <div>
              <p className="text-sm text-gray-600">Salary</p>
              <p className="font-medium text-gray-900">{job.salary || 'Not specified'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Posted Date</p>
              <p className="font-medium text-gray-900">{job.postedDate}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Job Description</h2>
          <p className="text-gray-700 leading-relaxed">{job.description}</p>
        </div>

        {/* Eligibility & Responsibilities */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Eligibility Criteria</h2>
            <ul className="space-y-2">
              {job.eligibility?.map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>{item}</span>
                </li>
              )) || <li className="text-gray-500">No eligibility criteria specified</li>}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Responsibilities</h2>
            <ul className="space-y-2">
              {job.responsibilities?.map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>{item}</span>
                </li>
              )) || <li className="text-gray-500">No responsibilities specified</li>}
            </ul>
          </div>
        </div>
      </div>

      {/* Applicants Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Applicants ({applicants.length})
        </h2>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Shortlisted</p>
                <p className="text-2xl font-bold text-green-900">{stats.shortlisted}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 mb-1">Rejected</p>
                <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Filter and Export */}
        <div className="flex flex-col md:flex-row  space-y-2 items-center justify-between mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Applicants</option>
              <option value="pending">Pending</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          {/* <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button> */}
        </div>

        {/* Applicants Table */}
        {applicants.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Applicants Yet</h3>
            <p className="text-gray-600">This job hasn't received any applications yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Education</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Experience</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Applied Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplicants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No applicants found matching your filter
                    </td>
                  </tr>
                ) : (
                  filteredApplicants.map((applicant) => (
                    <tr key={applicant.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-900">{applicant.fullName}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <div className="flex items-center gap-2 text-gray-700 mb-1">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-xs">{applicant.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-xs">{applicant.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">{applicant.education}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{applicant.experience} years</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{applicant.appliedDate}</td>
                      <td className="px-4 py-4">
                        <select
                          value={applicant.status}
                          onChange={(e) => handleStatusUpdate(applicant.id, e.target.value)}
                          className={`px-3 py-1 text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-amber-500 ${
                            applicant.status === 'Pending' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : applicant.status === 'Shortlisted'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetails(applicant)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => downloadResume(applicant)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="Download Resume"
                          >
                            <Download className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Applicant Details Modal */}
      {selectedApplicant && (
        <ApplicantDetailsModal
          applicant={selectedApplicant}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onStatusUpdate={handleStatusUpdate}
          showStatusActions={true}
        />
      )}
    </div>
  );
}
