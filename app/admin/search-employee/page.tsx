// app/admin/search-employee/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, Loader2, Download, Eye, Edit, Trash2, Mail } from 'lucide-react';

interface Employee {
  fullName: string;
  employeeId: string;
  designation: string;
  department: string;
  city: string;
  state: string;
  gender: string;
  joiningDate: string;
  mobileNumber: string;
  email: string;
  aadharNumber: string;
  panNumber: string;
  status: string;
  workLocation: string;
}

export default function SearchEmployeePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState<'name' | 'id'>('name');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    gender: '',
    department: '',
    designation: '',
    status: '',
    joiningDateFrom: '',
    joiningDateTo: ''
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);

  // Fetch all employees on load
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch employees from API
  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/employees');
      const data = await response.json();
      
      if (data.success) {
        setEmployees(data.data);
        setFilteredEmployees(data.data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Search functionality
  const handleSearch = async () => {
    setIsSearching(true);
    
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.append('search', searchQuery);
        params.append('searchBy', searchBy);
      }
      
      const response = await fetch(`/api/employees?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setFilteredEmployees(data.data);
      }
    } catch (error) {
      console.error('Error searching employees:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Apply filters
  const applyFilters = async () => {
    setIsSearching(true);
    
    try {
      const params = new URLSearchParams();
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery);
        params.append('searchBy', searchBy);
      }
      if (filters.city) params.append('city', filters.city);
      if (filters.state) params.append('state', filters.state);
      if (filters.gender) params.append('gender', filters.gender);
      if (filters.department) params.append('department', filters.department);
      if (filters.designation) params.append('designation', filters.designation);
      
      const response = await fetch(`/api/employees?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setFilteredEmployees(data.data);
      }
      setShowFilters(false);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      city: '',
      state: '',
      gender: '',
      department: '',
      designation: '',
      status: '',
      joiningDateFrom: '',
      joiningDateTo: ''
    });
    setSearchQuery('');
    fetchEmployees();
  };

  // Get unique values for filter dropdowns
  const uniqueCities = [...new Set(employees.map(emp => emp.city))];
  const uniqueStates = [...new Set(employees.map(emp => emp.state))];
  const uniqueDepartments = [...new Set(employees.map(emp => emp.department))];
  const uniqueDesignations = [...new Set(employees.map(emp => emp.designation))];

  // View employee details
  const handleViewDetails = (employee: any) => {
    setSelectedEmployee(employee);
    setShowDetailsModal(true);
  };

  // Export to CSV
  const handleExport = () => {
    const csv = [
      ['Employee ID', 'Name', 'Designation', 'Department', 'City', 'Gender', 'Joining Date', 'Mobile', 'Status'].join(','),
      ...filteredEmployees.map(emp => [
        emp.employeeId,
        emp.fullName,
        emp.designation,
        emp.department,
        emp.city,
        emp.gender,
        emp.joiningDate,
        emp.mobileNumber,
        emp.status
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Employee</h1>
        <p className="text-gray-600">Find and manage employee records</p>
      </div>

      {/* Search Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search By Toggle */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="searchBy"
                value="name"
                checked={searchBy === 'name'}
                onChange={(e) => setSearchBy('name')}
                className="w-4 h-4 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-gray-700 font-medium">Search by Name</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="searchBy"
                value="id"
                checked={searchBy === 'id'}
                onChange={(e) => setSearchBy('id')}
                className="w-4 h-4 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-gray-700 font-medium">Search by Employee ID</span>
            </label>
          </div>

          {/* Search Input */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={searchBy === 'name' ? 'Enter employee name...' : 'Enter employee ID...'}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-semibold disabled:bg-gray-300 flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search
                </>
              )}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Filter Employees</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <select
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Cities</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* State Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <select
                value={filters.state}
                onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All States</option>
                {uniqueStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Departments</option>
                {uniqueDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Designation Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
              <select
                value={filters.designation}
                onChange={(e) => setFilters({ ...filters, designation: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Designations</option>
                {uniqueDesignations.map(des => (
                  <option key={des} value={des}>{des}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Actions */}
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
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Search Results ({filteredEmployees.length})
            </h2>
            <p className="text-gray-600 text-sm">
              {filteredEmployees.length === employees.length 
                ? 'Showing all employees' 
                : `Filtered from ${employees.length} total employees`}
            </p>
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Employee Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Employee ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Designation</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Department</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Location</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Gender</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Joining Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No employees found matching your search criteria
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.employeeId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {employee.employeeId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{employee.fullName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{employee.designation}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{employee.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{employee.city}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{employee.gender}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{employee.joiningDate}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewDetails(employee)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title="Delete"
                        >
                          {/* <Trash2 className="w-4 h-4 text-red-600" /> */}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Details Modal */}
      {showDetailsModal && selectedEmployee && (
        <EmployeeDetailsModal
          employee={selectedEmployee}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
}

// Employee Details Modal Component
function EmployeeDetailsModal({ employee, onClose }: { employee: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{employee.fullName}</h2>
            <p className="text-gray-600">{employee.employeeId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-medium text-gray-900">{employee.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mobile Number</p>
                <p className="font-medium text-gray-900">{employee.mobileNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{employee.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Employment Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Designation</p>
                <p className="font-medium text-gray-900">{employee.designation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium text-gray-900">{employee.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Joining Date</p>
                <p className="font-medium text-gray-900">{employee.joiningDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Work Location</p>
                <p className="font-medium text-gray-900">{employee.workLocation || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Government IDs */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Government IDs</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Aadhar Number</p>
                <p className="font-medium text-gray-900">{employee.aadharNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">PAN Number</p>
                <p className="font-medium text-gray-900">{employee.panNumber}</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Location</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">City</p>
                <p className="font-medium text-gray-900">{employee.city}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">State</p>
                <p className="font-medium text-gray-900">{employee.state}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
