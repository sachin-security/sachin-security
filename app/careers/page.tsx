// app/careers/page.tsx
'use client';

import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Briefcase, Users, Award, TrendingUp, MapPin, Clock, DollarSign, GraduationCap, X } from 'lucide-react';
import Image from 'next/image';

// Job data type
interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  experience: string;
  salary: string;
  eligibility: string[];
  description: string;
  responsibilities: string[];
}

// Sample job data
const jobs: Job[] = [
  {
    id: 1,
    title: 'Security Guard',
    department: 'Operations',
    location: 'Vadodara, Gujarat',
    type: 'Full-time',
    experience: '0-2 years',
    salary: '₹15,000 - ₹20,000/month',
    eligibility: [
      'Minimum 10th pass',
      'Age: 21-45 years',
      'Height: Minimum 5\'6"',
      'Good physical fitness',
      'No criminal record'
    ],
    description: 'We are seeking dedicated security guards for various client locations across Vadodara.',
    responsibilities: [
      'Monitor premises and personnel',
      'Control access points',
      'Conduct regular patrols',
      'Report incidents immediately',
      'Maintain security logs'
    ]
  },
  {
    id: 2,
    title: 'Security Supervisor',
    department: 'Operations',
    location: 'Multiple Locations (Gujarat)',
    type: 'Full-time',
    experience: '3-5 years',
    salary: '₹25,000 - ₹35,000/month',
    eligibility: [
      'Graduation preferred',
      'Age: 25-50 years',
      'Minimum 3 years security experience',
      'Leadership skills',
      'Valid driving license'
    ],
    description: 'Experienced supervisors needed to manage security teams at client locations.',
    responsibilities: [
      'Lead and train security teams',
      'Conduct site inspections',
      'Handle client communications',
      'Prepare duty rosters',
      'Coordinate with management'
    ]
  },
  {
    id: 3,
    title: 'Female Security Guard',
    department: 'Operations',
    location: 'Hospitals & Malls - Vadodara',
    type: 'Full-time',
    experience: '0-3 years',
    salary: '₹16,000 - ₹22,000/month',
    eligibility: [
      'Minimum 12th pass',
      'Age: 21-40 years',
      'Good communication skills',
      'Comfortable with shift work',
      'Professional appearance'
    ],
    description: 'Female security professionals required for healthcare and retail sectors.',
    responsibilities: [
      'Monitor female visitors and staff',
      'Conduct security checks',
      'Assist in emergency situations',
      'Maintain visitor logs',
      'Provide customer service'
    ]
  }
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

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

          <div className="max-w-6xl mx-auto space-y-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onApply={handleApplyClick} />
            ))}
          </div>
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
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />
      </div>

      <div
        ref={ref}
        className={`container mx-auto px-6 relative z-10 pt-28 pb-16 text-center transition-all duration-1000 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
          <Briefcase className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
          Join Our Team
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8">
          Build a rewarding career in security services with Gujarat's most trusted company since 1996
        </p>

        <div className="inline-block bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/50 px-8 py-4 rounded-full">
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
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <benefit.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">{benefit.title}</h3>
              <p className="text-slate-400 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Company Stats */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-xl border border-amber-400/20 text-center">
            <div className="text-4xl font-bold text-amber-400 mb-2">25+</div>
            <div className="text-slate-300">Years Experience</div>
          </div>
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-xl border border-amber-400/20 text-center">
            <div className="text-4xl font-bold text-amber-400 mb-2">1000+</div>
            <div className="text-slate-300">Security Personnel</div>
          </div>
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-xl border border-amber-400/20 text-center">
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
            <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
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
              <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <GraduationCap className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <span>{job.experience}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <DollarSign className="w-5 h-5 text-amber-400 flex-shrink-0" />
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
        <div className="lg:w-48 flex-shrink-0">
          <button
            onClick={() => onApply(job)}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)]"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}

// Application Modal Component
function ApplicationModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    education: '',
    experience: '',
    address: '',
    resume: null as File | null,
    coverLetter: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Application submitted successfully! We will contact you soon.');
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resume: e.target.files[0] });
    }
  };

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
                  <option value="graduate">Graduate</option>
                  <option value="postgraduate">Post Graduate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Total Experience (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-400 transition-colors text-white"
                  placeholder="Enter years of experience"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Upload Resume (PDF) <span className="text-red-400">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  required
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-400 transition-colors text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-500 file:text-white file:cursor-pointer hover:file:bg-amber-600"
                />
              </div>

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
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
