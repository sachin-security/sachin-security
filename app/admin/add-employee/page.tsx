// app/admin/add-employee/page.tsx
'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function AddEmployeePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    fatherName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    maritalStatus: '',
    
    // Contact Information
    mobileNumber: '',
    alternateNumber: '',
    email: '',
    currentAddress: '',
    permanentAddress: '',
    city: '',
    state: '',
    pincode: '',
    
    // Government IDs
    aadharNumber: '',
    panNumber: '',
    
    // Employment Details
    employeeId: '',
    designation: '',
    department: '',
    joiningDate: '',
    employmentType: 'Full-time',
    reportingManager: '',
    workLocation: '',
    
    // Salary & Benefits
    basicSalary: '',
    hra: '',
    otherAllowances: '',
    pfNumber: '',
    esiNumber: '',
    uanNumber: '',
    
    // Bank Details
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branchName: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactNumber: '',
    emergencyContactRelation: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Employee added successfully!');
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Employee</h1>
        <p className="text-gray-600">Register new employee with complete details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Father's Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fatherName}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Group
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marital Status
              </label>
              <select
                value={formData.maritalStatus}
                onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alternate Number
              </label>
              <input
                type="tel"
                value={formData.alternateNumber}
                onChange={(e) => setFormData({ ...formData, alternateNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Address <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={formData.currentAddress}
                onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permanent Address
              </label>
              <textarea
                rows={2}
                value={formData.permanentAddress}
                onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PIN Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Government IDs */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Government IDs</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aadhar Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={12}
                value={formData.aadharNumber}
                onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="XXXX XXXX XXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PAN Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={10}
                value={formData.panNumber}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="ABCDE1234F"
              />
            </div>
          </div>
        </div>

        {/* Employment Details */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Employment Details</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Joining Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.joiningDate}
                onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Type
              </label>
              <select
                value={formData.employmentType}
                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Location
              </label>
              <input
                type="text"
                value={formData.workLocation}
                onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Salary & Benefits */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Salary & Benefits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Basic Salary
              </label>
              <input
                type="number"
                value={formData.basicSalary}
                onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HRA
              </label>
              <input
                type="number"
                value={formData.hra}
                onChange={(e) => setFormData({ ...formData, hra: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other Allowances
              </label>
              <input
                type="number"
                value={formData.otherAllowances}
                onChange={(e) => setFormData({ ...formData, otherAllowances: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PF Number
              </label>
              <input
                type="text"
                value={formData.pfNumber}
                onChange={(e) => setFormData({ ...formData, pfNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ESI Number
              </label>
              <input
                type="text"
                value={formData.esiNumber}
                onChange={(e) => setFormData({ ...formData, esiNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UAN Number
              </label>
              <input
                type="text"
                value={formData.uanNumber}
                onChange={(e) => setFormData({ ...formData, uanNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Bank Details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IFSC Code
              </label>
              <input
                type="text"
                value={formData.ifscCode}
                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch Name
              </label>
              <input
                type="text"
                value={formData.branchName}
                onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Emergency Contact</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Name
              </label>
              <input
                type="text"
                value={formData.emergencyContactName}
                onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                value={formData.emergencyContactNumber}
                onChange={(e) => setFormData({ ...formData, emergencyContactNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relation
              </label>
              <input
                type="text"
                value={formData.emergencyContactRelation}
                onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Adding Employee...
              </>
            ) : (
              'Add Employee'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
