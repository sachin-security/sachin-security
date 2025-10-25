// app/admin/page.tsx
import { Briefcase, Users, Search, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
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
    }
  ];

  const stats = [
    { label: 'Total Employees', value: '1,234', icon: Users },
    { label: 'Active Jobs', value: '12', icon: Briefcase },
    { label: 'This Month Hired', value: '45', icon: TrendingUp }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage jobs, employees, and recruitment operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-gray-900" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Operation Tiles */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiles.map((tile, index) => (
          <Link
            key={index}
            href={tile.href}
            className={`${tile.color} border-2 rounded-lg p-6 hover:shadow-md`}
          >
            <div className={`w-12 h-12 ${tile.color} rounded-lg flex items-center justify-center mb-4`}>
              <tile.icon className={`w-6 h-6 ${tile.iconColor}`} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{tile.title}</h3>
            <p className="text-gray-600">{tile.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
