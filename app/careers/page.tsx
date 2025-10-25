// app/careers/page.tsx
'use client';

import { useState , useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Briefcase, Users, Award, TrendingUp, MapPin, Clock, DollarSign, GraduationCap, X } from 'lucide-react';
import Image from 'next/image';

// Job data type
interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  experience: string;
  salary: string;
  eligibility: string[];
  description: string;
  responsibilities: string[];
  status:string,
  applicantsCount: number
}

// Sample job data
const ajobs: Job[] =[{
  "id": "JOB001",
  "title": "ADm",
  "department": "qq",
  "location": "qq",
  "type": "Full-time",
  "experience": "2",
  "salary": "qq111",
  "description": "w",
  "eligibility": [
    "e",
    "e"
  ],
  "responsibilities": [
    "e",
    "df"
  ],
  "status": "Active",
  "applicantsCount": 0
}]

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState <Job[]>([]);

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

   const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
   };
    useEffect(() => {
        const fetchData = async () => {
        setIsLoading(true);
        
        try {
            // Fetch job details by ID
            const jobResponse = await fetch(`/api/jobs`);
            const jobData = await jobResponse.json();
            
            if (jobData.success) {
            setJobs(jobData.data);
            } else {
            console.error('Job not found:', jobData.error);
            setJobs([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
        };
        fetchData();
    }, []);

  return (
    <>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Why Join Us Section */}
      <WhyJoinUsSection />
      
      {/* Job Openings Section */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Current Openings
            </h2>
            <p className="text-xl text-slate-400">
              Explore exciting career opportunities with us
            </p>
          </div>
          {isLoading?
                <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                    <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading job details...</p>
                    </div>
                </div>
                :
                <div className="max-w-6xl mx-auto space-y-6">
                {jobs.map((job) => (
                    <JobCard key={job.id} job={job} onApply={handleApplyClick} />
                    ))}
                </div>
           }
        </div>
      </section>

      {/* Application Modal */}
      {isModalOpen && selectedJob && (
        <ApplicationModal job={selectedJob} onClose={handleCloseModal} />
      )}
    </>
  );
}

// Hero Section Component
function HeroSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80"
          alt="Careers"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />
      </div>

      <div
        ref={ref}
        className={`container mx-auto px-6 relative z-10 pt-28 pb-16 text-center transition-all duration-1000 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center">
          <Briefcase className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-linear-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
          Join Our Team
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8">
          Build a rewarding career in security services with Gujarat's most trusted company since 1996
        </p>

        <div className="inline-block bg-linear-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/50 px-8 py-4 rounded-full">
          <p className="text-amber-400 font-bold text-lg">
            ISO 9001:2015 Certified • 25+ Years of Excellence
          </p>
        </div>
      </div>
    </section>
  );
}

// Why Join Us Section
function WhyJoinUsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const benefits = [
    {
      icon: Award,
      title: 'Professional Training',
      description: 'Comprehensive training programs to enhance your skills and career growth'
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Clear promotion paths and opportunities to advance in your security career'
    },
    {
      icon: Users,
      title: 'Supportive Culture',
      description: 'Work in a respectful and collaborative team environment'
    },
    {
      icon: DollarSign,
      title: 'Competitive Salary',
      description: 'Industry-leading compensation with timely payments and statutory benefits'
    }
  ];

  return (
    <section className="py-4 bg-slate-950">
      <div className="container mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4">
            Why Join Sachin Security?
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            We invest in our people and provide a supportive environment for professional growth
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-amber-400/50 transition-all duration-300 hover:scale-105 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <benefit.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">{benefit.title}</h3>
              <p className="text-slate-400 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Company Stats */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-linear-to-br from-slate-900 to-slate-950 p-8 rounded-xl border border-amber-400/20 text-center">
            <div className="text-4xl font-bold text-amber-400 mb-2">25+</div>
            <div className="text-slate-300">Years Experience</div>
          </div>
          <div className="bg-linear-to-br from-slate-900 to-slate-950 p-8 rounded-xl border border-amber-400/20 text-center">
            <div className="text-4xl font-bold text-amber-400 mb-2">1000+</div>
            <div className="text-slate-300">Security Personnel</div>
          </div>
          <div className="bg-linear-to-br from-slate-900 to-slate-950 p-8 rounded-xl border border-amber-400/20 text-center">
            <div className="text-4xl font-bold text-amber-400 mb-2">4</div>
            <div className="text-slate-300">States Coverage</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Job Card Component
function JobCard({ job, onApply }: { job: Job; onApply: (job: Job) => void }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`bg-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-amber-400/50 transition-all duration-700 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Job Info */}
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{job.title}</h3>
              <span className="inline-block px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-400 text-sm">
                {job.department}
              </span>
            </div>
          </div>

          {/* Job Details Grid */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <GraduationCap className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{job.experience}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <DollarSign className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{job.salary}</span>
            </div>
          </div>

          <p className="text-slate-400 mb-4">{job.description}</p>

          {/* Eligibility */}
          <div>
            <h4 className="font-semibold text-white mb-2">Eligibility:</h4>
            <ul className="space-y-1">
              {job.eligibility.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-400 text-sm">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Apply Button */}
        <div className="lg:w-48 shrink-0">
          <button
            onClick={() => onApply(job)}
            className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)]"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ApplicationModal component
import { Loader2, CheckCircle, Upload, } from 'lucide-react';

function ApplicationModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    education: '',
    experience: '',
    address: '',
    coverLetter: '',
    resumeUrl: '',
    resumeFilename: ''
  });

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF and DOC files are allowed');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    setIsUploading(true);
    setError('');
    
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('resume', file);
      
      const response = await fetch('/api/upload/resume', {
        method: 'POST',
        body: uploadFormData
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Job Applied')
        setFormData({
          ...formData,
          resumeUrl: data.data.url,
          resumeFilename: data.data.filename
        });
      } else {
        setError(data.error || 'Failed to upload resume');
      }
    } catch (error) {
      setError('Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Validate resume upload
      if (!formData.resumeUrl) {
        setError('Please upload your resume');
        setIsSubmitting(false);
        return;
      }
      
      const applicationData = {
        jobId: job.id,
        jobTitle: job.title,
        ...formData
      };
      
      const response = await fetch('/api/apply-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(applicationData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setError(data.error || 'Failed to submit application');
      }
    } catch (error) {
      setError('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove uploaded file
  const handleRemoveFile = () => {
    setFormData({
      ...formData,
      resumeUrl: '',
      resumeFilename: ''
    });
  };

  // Success state
  if (submitSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Application Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for applying to <strong>{job.title}</strong>. We will review your application and contact you soon.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Apply for {job.title}</h2>
            <p className="text-slate-400 text-sm">{job.location}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-bold text-amber-400 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-400 transition-colors text-white"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-400 transition-colors text-white"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-400 transition-colors text-white"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Date of Birth <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-400 transition-colors text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Address <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-400 transition-colors text-white"
                  placeholder="Enter your complete address"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="text-lg font-bold text-amber-400 mb-4">Professional Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Highest Education <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-400 transition-colors text-white"
                >
                  <option value="">Select education</option>
                  <option value="10th">10th Pass</option>
                  <option value="12th">12th Pass</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Post Graduate">Post Graduate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Total Experience (Years) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  required
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-400 transition-colors text-white"
                  placeholder="Enter years of experience"
                />
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Upload Resume (PDF/DOC) <span className="text-red-400">*</span>
                </label>
                
                {!formData.resumeUrl ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className={`flex items-center justify-center gap-2 w-full px-4 py-4 bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-amber-400 transition-colors ${
                        isUploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                          <span className="text-slate-300">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-amber-400" />
                          <span className="text-slate-300">Click to upload resume</span>
                        </>
                      )}
                    </label>
                    <p className="text-xs text-slate-500 mt-2">Max file size: 5MB (PDF or DOC only)</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Resume uploaded</p>
                        <p className="text-slate-400 text-xs">{formData.resumeFilename}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Why do you want to join us?
                </label>
                <textarea
                  rows={4}
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-400 transition-colors text-white"
                  placeholder="Tell us about yourself and why you're interested in this position..."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
