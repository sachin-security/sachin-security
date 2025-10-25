// components/admin/ApplicantDetailsModal.tsx
'use client';

import { useState } from 'react';
import { 
  X, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Briefcase,
  FileText,
  User,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';

interface Applicant {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  education: string;
  experience: string;
  address: string;
  appliedDate?: string;
  status?: string;
  resumeUrl?: string;
  coverLetter?: string;
  jobTitle?: string;
  jobId?: string;
}

interface ApplicantDetailsModalProps {
  applicant: Applicant;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: (applicantId: string, newStatus: string) => void;
  showStatusActions?: boolean;
}

export default function ApplicantDetailsModal({
  applicant,
  isOpen,
  onClose,
  onStatusUpdate,
  showStatusActions = true
}: ApplicantDetailsModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  // Download resume function
  const handleDownloadResume = async () => {
    setIsDownloading(true);
    
    try {
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, this would be actual file download
      const link = document.createElement('a');
      link.href = applicant.resumeUrl || '#';
      link.download = `${applicant.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`Resume downloaded for ${applicant.fullName}`);
    } catch (error) {
      alert('Failed to download resume');
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle status updates
  const handleStatusUpdate = (status: string) => {
    if (onStatusUpdate) {
      onStatusUpdate(applicant.id, status);
    }
    onClose();
  };

  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
              <User className="w-7 h-7 text-amber-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{applicant.fullName}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-gray-600">ID: {applicant.id}</span>
                {applicant.status && (
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    applicant.status === 'Pending' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : applicant.status === 'Shortlisted'
                      ? 'bg-green-100 text-green-800'
                      : applicant.status === 'Rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {applicant.status}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-200px)] px-6 py-6">
          <div className="space-y-6">
            {/* Contact Information Card */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-600" />
                Contact Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Email Address</p>
                    <p className="font-medium text-gray-900 break-all">{applicant.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                    <p className="font-medium text-gray-900">{applicant.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:col-span-2">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Address</p>
                    <p className="font-medium text-gray-900">{applicant.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information Card */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-amber-600" />
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Date of Birth</p>
                    <p className="font-medium text-gray-900">{applicant.dateOfBirth}</p>
                    <p className="text-xs text-gray-500 mt-1">Age: {calculateAge(applicant.dateOfBirth)} years</p>
                  </div>
                </div>
                {applicant.appliedDate && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Applied Date</p>
                      <p className="font-medium text-gray-900">{applicant.appliedDate}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Information Card */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-600" />
                Professional Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Education</p>
                    <p className="font-medium text-gray-900">{applicant.education}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Experience</p>
                    <p className="font-medium text-gray-900">
                      {applicant.experience} {parseFloat(applicant.experience) === 1 ? 'year' : 'years'}
                    </p>
                  </div>
                </div>
                {applicant.jobTitle && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Applied For</p>
                      <p className="font-medium text-gray-900">{applicant.jobTitle}</p>
                      {applicant.jobId && (
                        <p className="text-xs text-gray-500 mt-1">Job ID: {applicant.jobId}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Letter Card */}
            {applicant.coverLetter && (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  Cover Letter
                </h3>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {applicant.coverLetter}
                  </p>
                </div>
              </div>
            )}

            {/* Resume Section */}
            <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                Resume/CV
              </h3>
              <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-amber-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {applicant.fullName.replace(/\s+/g, '_')}_Resume.pdf
                    </p>
                    <p className="text-xs text-gray-500">PDF Document</p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadResume}
                  disabled={isDownloading}
                  className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          {showStatusActions && onStatusUpdate ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 border-2 border-gray-300 py-3 rounded-lg hover:bg-gray-50 font-semibold text-gray-700"
              >
                Close
              </button>
              <button
                onClick={() => handleStatusUpdate('Shortlisted')}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Shortlist Candidate
              </button>
              <button
                onClick={() => handleStatusUpdate('Rejected')}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Reject Candidate
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 border-2 border-gray-300 py-3 rounded-lg hover:bg-gray-50 font-semibold text-gray-700"
              >
                Close
              </button>
              <button
                onClick={handleDownloadResume}
                disabled={isDownloading}
                className="flex-1 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 font-semibold disabled:bg-gray-300 flex items-center justify-center gap-2"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Resume
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
