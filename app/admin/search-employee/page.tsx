// app/admin/search-employee/page.tsx
'use client';

import { useState } from 'react';
import { Search, Filter, X, Loader2, Download, Eye, Edit, Trash2 } from 'lucide-react';

// Sample employee data (would come from API/database)
const sampleEmployees = [
  {
    employeeId: 'SS001',
    fullName: 'Rajesh Kumar',
    designation: 'Security Guard',
    department: 'Operations',
    city: 'Vadodara',
    state: 'Gujarat',
    gender: 'Male',
    joiningDate: '2022-01-15',
    mobileNumber: '+91 98765 43210',
    email: 'rajesh.kumar@sachinsecurity.com',
    aadharNumber: '1234 5678 9012',
    panNumber: 'ABCDE1234F',
    status: 'Active',
    workLocation: 'Corporate Park, Vadodara'
  },
  {
    employeeId: 'SS002',
    fullName: 'Priya Sharma',
    designation: 'Security Supervisor',
    department: 'Operations',
    city: 'Ahmedabad',
    state: 'Gujarat',
    gender: 'Female',
    joiningDate: '2021-06-10',
    mobileNumber: '+91 87654 32109',
    email: 'priya.sharma@sachinsecurity.com',
    aadharNumber: '2345 6789 0123',
    panNumber: 'BCDEF2345G',
    status: 'Active',
    workLocation: 'Tech Mall, Ahmedabad'
  },
  {
    employeeId: 'SS003',
    fullName: 'Amit Patel',
    designation: 'Security Guard',
    department: 'Operations',
    city: 'Surat',
    state: 'Gujarat',
    gender: 'Male',
    joiningDate: '2023-03-20',
    mobileNumber: '+91 76543 21098',
    email: 'amit.patel@sachinsecurity.com',
    aadharNumber: '3456 7890 1234',
    panNumber: 'CDEFG3456H',
    status: 'Active',
    workLocation: 'Diamond Plaza, Surat'
  },
  {
    employeeId: 'SS004',
    fullName: 'Neha Singh',
    designation: 'Security Guard',
    department: 'Operations',
    city: 'Vadodara',
    state: 'Gujarat',
    gender: 'Female',
    joiningDate: '2023-07-12',
    mobileNumber: '+91 65432 10987',
    email: 'neha.singh@sachinsecurity.com',
    aadharNumber: '4567 8901 2345',
    panNumber: 'DEFGH4567I',
    status: 'Active',
    workLocation: 'City Hospital, Vadodara'
  },
  {
    employeeId: 'SS005',
    fullName: 'Vikram Mehta',
    designation: 'Area Manager',
    department: 'Management',
    city: 'Vadodara',
    state: 'Gujarat',
    gender: 'Male',
    joiningDate: '2020-02-01',
    mobileNumber: '+91 54321 09876',
    email: 'vikram.mehta@sachinsecurity.com',
    aadharNumber: '5678 9012 3456',
    panNumber: 'EFGHI5678J',
    status: 'Active',
    workLocation: 'Head Office, Vadodara'
  }
];

export default function SearchEmployeePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState<'name' | 'id'>('name');
  const [isSearching, setIsSearching] = useState(false);
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

  const [employees, setEmployees] = useState(sampleEmployees);
  const [filteredEmployees, setFilteredEmployees] = useState(sampleEmployees);

  // Search functionality
  const handleSearch = async () => {
    setIsSearching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let results = [...employees];
    
    if (searchQuery.trim()) {
      if (searchBy === 'name') {
        results = results.filter(emp => 
          emp.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else {
        results = results.filter(emp => 
          emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
    }
    
    setFilteredEmployees(results);
    setIsSearching(false);
  };

  // Apply filters
  const applyFilters = () => {
    let results = [...employees];
    
    // Apply search first
    if (searchQuery.trim()) {
      if (searchBy === 'name') {
        results = results.filter(emp => 
          emp.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else {
        results = results.filter(emp => 
          emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
    }
    
    // Apply filters
    if (filters.city) {
      results = results.filter(emp => emp.city === filters.city);
    }
    if (filters.state) {
      results = results.filter(emp => emp.state === filters.state);
    }
    if (filters.gender) {
      results = results.filter(emp => emp.gender === filters.gender);
    }
    if (filters.department) {
      results = results.filter(emp => emp.department === filters.department);
    }
    if (filters.designation) {
      results = results.filter(emp => emp.designation === filters.designation);
    }
    if (filters.status) {
      results = results.filter(emp => emp.status === filters.status);
    }
    if (filters.joiningDateFrom) {
      results = results.filter(emp => new Date(emp.joiningDate) >= new Date(filters.joiningDateFrom));
    }
    if (filters.joiningDateTo) {
      results = results.filter(emp => new Date(emp.joiningDate) <= new Date(filters.joiningDateTo));
    }
    
    setFilteredEmployees(results);
    setShowFilters(false);
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
    setFilteredEmployees(employees);
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
    alert('Export functionality would download employee data as CSV');
  };

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

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            {/* Joining Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Joined From</label>
              <input
                type="date"
                value={filters.joiningDateFrom}
                onChange={(e) => setFilters({ ...filters, joiningDateFrom: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Joining Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Joined To</label>
              <input
                type="date"
                value={filters.joiningDateTo}
                onChange={(e) => setFilters({ ...filters, joiningDateTo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
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
                          title="DownLoad PDF"
                        >
                          <Download className="w-4 h-4 text-black" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Employee Details</h2>
                <p className="text-gray-600">{selectedEmployee.employeeId}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
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
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium text-gray-900">{selectedEmployee.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-medium text-gray-900">{selectedEmployee.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mobile Number</p>
                    <p className="font-medium text-gray-900">{selectedEmployee.mobileNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{selectedEmployee.email}</p>
                  </div>
                </div>
              </div>

              {/* Employment Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Employment Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Designation</p>
                    <p className="font-medium text-gray-900">{selectedEmployee.designation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-medium text-gray-900">{selectedEmployee.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Joining Date</p>
                    <p className="font-medium text-gray-900">{selectedEmployee.joiningDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Work Location</p>
                    <p className="font-medium text-gray-900">{selectedEmployee.workLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {selectedEmployee.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Government IDs */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Government IDs</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Aadhar Number</p>
                    <p className="font-medium text-gray-900">{selectedEmployee.aadharNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">PAN Number</p>
                    <p className="font-medium text-gray-900">{selectedEmployee.panNumber}</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Location</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">City</p>
                    <p className="font-medium text-gray-900">{selectedEmployee.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">State</p>
                    <p className="font-medium text-gray-900">{selectedEmployee.state}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-4">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Close
              </button>
              <button
                className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 font-semibold"
              >
                Edit Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
