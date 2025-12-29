import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuth';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FiActivity,
  FiUsers,
  FiKey,
  FiCalendar,
  FiArrowUp,
  FiArrowDown,
  FiTrendingUp,
  FiSettings,
} from 'react-icons/fi';

interface DashboardStats {
  totalCompanies: number;
  activeCompanies: number;
  apiKeysGenerated: number;
  newRegistrations: number;
  totalCompaniesChange: string;
  activeCompaniesChange: string;
  apiKeysChange: string;
  newRegistrationsChange: string;
}

const Dashboard: React.FC = () => {
  const { company } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Use the new dedicated stats endpoint
      const response = await axios.get('/api/dashboard/stats');
      setStats(response.data.stats);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error ?? 'Failed to load dashboard stats');
      } else {
        toast.error('Failed to load dashboard stats');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Companies',
      value: stats?.totalCompanies || 0,
      icon: FiUsers,
      color: 'bg-blue-500',
      change: stats?.totalCompaniesChange || '+0%',
      trend: stats?.totalCompaniesChange?.startsWith('+') ? 'up' : 'down',
    },
    {
      title: 'Active Companies',
      value: stats?.activeCompanies || 0,
      icon: FiActivity,
      color: 'bg-green-500',
      change: stats?.activeCompaniesChange || '+0%',
      trend: stats?.activeCompaniesChange?.startsWith('+') ? 'up' : 'down',
    },
    {
      title: 'API Keys',
      value: stats?.apiKeysGenerated || 0,
      icon: FiKey,
      color: 'bg-purple-500',
      change: stats?.apiKeysChange || '+0%',
      trend: stats?.apiKeysChange?.startsWith('+') ? 'up' : 'down',
    },
    {
      title: 'New This Week',
      value: stats?.newRegistrations || 0,
      icon: FiCalendar,
      color: 'bg-orange-500',
      change: stats?.newRegistrationsChange || '+0%',
      trend: stats?.newRegistrationsChange?.startsWith('+') ? 'up' : 'down',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {company?.name}!</h1>
            <p className="text-blue-100 mt-2">
              Here's what's happening with your platform today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-blue-500 rounded-full p-4">
              <FiTrendingUp size={32} />
            </div>
          </div>
        </div>
        <div className="mt-4 text-sm">
          <p>Email: {company?.email} | Joined: {new Date(company?.createdAt || '').toLocaleDateString()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const isUp = stat.trend === 'up';
          const isDown = stat.trend === 'down';
          
          return (
            <div key={index} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {isUp ? (
                      <FiArrowUp className="text-green-500 mr-1" />
                    ) : isDown ? (
                      <FiArrowDown className="text-red-500 mr-1" />
                    ) : null}
                    <span className={`text-sm ${isUp ? 'text-green-600' : isDown ? 'text-red-600' : 'text-gray-600'}`}>
                      {stat.change} from last week
                    </span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>


      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.href = '/api-key'}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
          >
            <FiKey className="mx-auto text-gray-400" size={24} />
            <p className="mt-2 font-medium">Generate API Key</p>
            <p className="text-sm text-gray-600">Create a new API key</p>
          </button>
          
          <button
            onClick={() => window.location.href = '/companies'}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
          >
            <FiUsers className="mx-auto text-gray-400" size={24} />
            <p className="mt-2 font-medium">View Companies</p>
            <p className="text-sm text-gray-600">See all registered companies</p>
          </button>
          
          <button
            onClick={() => window.location.href = '/settings'}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
          >
            <FiSettings className="mx-auto text-gray-400" size={24} />
            <p className="mt-2 font-medium">Settings</p>
            <p className="text-sm text-gray-600">Update your preferences</p>
          </button>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;