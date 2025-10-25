// app/admin/add-job/page.tsx
'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function AddJobPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    experience: '',
    salary: '',
    eligibility: [''],
    description: '',
    responsibilities: ['']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Job posted successfully!');
    setIsSubmitting(false);
    // Reset form
    setFormData({
      title: '',
      department: '',
      location: '',
      type: 'Full-time',
      experience: '',
      salary: '',
      eligibility: [''],
      description: '',
      responsibilities: ['']
    });
  };

  const addField = (field: 'eligibility' | 'responsibilities') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const updateField = (field: 'eligibility' | 'responsibilities', index: number, value: string) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const removeField = (field: 'eligibility' | 'responsibilities', index: number) => {
    const updated = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updated });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Job Opening</h1>
        <p className="text-gray-600">Post a new job position for recruitment</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g., Security Guard"
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
                placeholder="e.g., Operations"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g., Vadodara, Gujarat"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Required
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g., 0-2 years"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary Range
              </label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g., ₹15,000 - ₹20,000/month"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Brief description of the role..."
          />
        </div>

        {/* Eligibility Criteria */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Eligibility Criteria</h2>
            <button
              type="button"
              onClick={() => addField('eligibility')}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium"
            >
              + Add Criteria
            </button>
          </div>
          <div className="space-y-3">
            {formData.eligibility.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateField('eligibility', index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., Minimum 10th pass"
                />
                {formData.eligibility.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField('eligibility', index)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Responsibilities */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Responsibilities</h2>
            <button
              type="button"
              onClick={() => addField('responsibilities')}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium"
            >
              + Add Responsibility
            </button>
          </div>
          <div className="space-y-3">
            {formData.responsibilities.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateField('responsibilities', index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., Monitor premises and personnel"
                />
                {formData.responsibilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField('responsibilities', index)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Posting Job...
              </>
            ) : (
              'Post Job Opening'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
