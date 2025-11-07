// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Briefcase, Users, Search, TrendingUp, Mail, Loader2, Clock, FileText } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeJobs: 0,
    totalApplicants: 0,
    supportMessages: 0,
    newMessages: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setIsLoading(true);
    try {
      // Fetch all data in parallel
        const [jobsData, employeesData, applicantsData, messagesData] = await Promise.all([
        fetch('/api/jobs').then(res => res.json()),
        fetch('/api/employees').then(res => res.json()),
        fetch('/api/applicants').then(res => res.json()),
        fetch('/api/contact').then(res => res.json())
        ]);

     
      
      if (jobsData.success && employeesData.success && applicantsData.success && messagesData.success) {
        const activeJobs = jobsData.data.filter((job: any) => job.status === 'Active').length;
        const newMessages = messagesData.data.filter((msg: any) => msg.status === 'New').length;
        
        setStats({
          totalEmployees: employeesData.count || 0,
          activeJobs: activeJobs,
          totalApplicants: applicantsData.count || 0,
          supportMessages: messagesData.count || 0,
          newMessages: newMessages
        });
      }
      else throw new Error(jobsData.error || employeesData.error || applicantsData.error || messagesData.error)
    } catch (error) {
      alert(error+ "Please reload..")
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tiles = [
    {
      title: 'Add Job Opening',
      description: 'Post new job positions for recruitment',
      icon: Briefcase,
      href: '/admin/add-job',
      color: 'bg-amber-50 border-amber-200',
      iconColor: 'text-amber-600'
    },
    {
      title: 'All Jobs',
      description: 'View and manage all job postings',
      icon: FileText,
      href: '/admin/all-jobs',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Add Employee',
      description: 'Register new employee details',
      icon: Users,
      href: '/admin/add-employee',
      color: 'bg-gray-50 border-gray-200',
      iconColor: 'text-gray-900'
    },
    {
      title: 'Search Employee',
      description: 'Find and manage employee records',
      icon: Search,
      href: '/admin/search-employee',
      color: 'bg-amber-50 border-amber-200',
      iconColor: 'text-amber-600'
    },
    {
      title: 'Support Messages',
      description: 'View and respond to customer inquiries',
      icon: Mail,
      href: '/admin/support-messages',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
      badge: stats.newMessages > 0 ? stats.newMessages : null
    }
  ];

  const statsCards = [
    { 
      label: 'Total Employees', 
      value: stats.totalEmployees, 
      icon: Users,
      color: 'bg-gray-100',
      textColor: 'text-gray-900'
    },
    { 
      label: 'Active Jobs', 
      value: stats.activeJobs, 
      icon: Briefcase,
      color: 'bg-green-100',
      textColor: 'text-green-600'
    },
    { 
      label: 'Total Applicants', 
      value: stats.totalApplicants, 
      icon: TrendingUp,
      color: 'bg-amber-100',
      textColor: 'text-amber-600'
    },
    { 
      label: 'Support Messages', 
      value: stats.supportMessages, 
      icon: Mail,
      color: 'bg-blue-100',
      textColor: 'text-blue-600',
      badge: stats.newMessages > 0 ? `${stats.newMessages} New` : null
    }
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage jobs, employees, and recruitment operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              {stat.badge && (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                  {stat.badge}
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions Section */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      </div>

      {/* Operation Tiles */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiles.map((tile, index) => (
          <Link
            key={index}
            href={tile.href}
            className={`${tile.color} border-2 rounded-lg p-6 hover:shadow-lg transition-shadow relative`}
          >
            {tile.badge && (
              <div className="absolute top-4 right-4">
                <span className="flex items-center justify-center w-8 h-8 bg-red-500 text-white text-xs font-bold rounded-full">
                  {tile.badge}
                </span>
              </div>
            )}
            <div className={`w-12 h-12 ${tile.color} rounded-lg flex items-center justify-center mb-4`}>
              <tile.icon className={`w-6 h-6 ${tile.iconColor}`} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{tile.title}</h3>
            <p className="text-gray-600">{tile.description}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">System Overview</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-600" />
              Recruitment Status
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Active Job Postings</span>
                <span className="font-semibold text-gray-900">{stats.activeJobs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Applications</span>
                <span className="font-semibold text-gray-900">{stats.totalApplicants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Applications/Job</span>
                <span className="font-semibold text-gray-900">
                  {stats.activeJobs > 0 
                    ? Math.round(stats.totalApplicants / stats.activeJobs) 
                    : 0}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5 text-green-600" />
              Support & Communication
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Messages</span>
                <span className="font-semibold text-gray-900">{stats.supportMessages}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New Messages</span>
                <span className="font-semibold text-green-600 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {stats.newMessages}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Response Rate</span>
                <span className="font-semibold text-gray-900">
                  {stats.supportMessages > 0 
                    ? Math.round(((stats.supportMessages - stats.newMessages) / stats.supportMessages) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
