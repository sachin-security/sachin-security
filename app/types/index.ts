// types/index.ts
export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  experience: string;
  salary: string;
  description: string;
  eligibility: string[];
  responsibilities: string[];
  status: 'Active' | 'Inactive';
  postedDate: string;
  applicantsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Applicant {
  id: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  education: string;
  experience: string;
  address: string;
  coverLetter: string;
  resumeUrl: string;
  status: 'Pending' | 'Shortlisted' | 'Rejected';
  appliedDate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Employee {
  fullName: string;
  fatherName: string;
  dateOfBirth: string;
  gender: string;
  employeeId: string;
  designation: string;
  department: string;
  joiningDate: string;
  // ... other fields
}

export interface SupportMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'New' | 'In Progress' | 'Resolved';
  createdAt: Date;
  updatedAt: Date;
}
