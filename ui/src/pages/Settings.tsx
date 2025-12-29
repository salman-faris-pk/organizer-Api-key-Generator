import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/useAuth';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUser, FiLock, FiSave, FiLoader } from 'react-icons/fi';

const Settings: React.FC = () => {
  const { company, updateCompany } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  
  // Profile settings
  const [name, setName] = useState(company?.name || '');
  
  // Password settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Load settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/settings');
      setName(response.data.name || '');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error ?? 'Failed to load settings');
      } else {
        toast.error('Failed to load settings');
      }
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.put('/api/settings/profile', {
        name: name.trim(),
      });
      
      toast.success(response.data.message);
      
      if (updateCompany && response.data.company) {
        updateCompany(response.data.company);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error ?? 'Failed to update profile');
      } else {
        toast.error('Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword) {
      toast.error('All password fields are required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.put('/api/settings/password', {
        currentPassword,
        newPassword,
      });
      
      toast.success(response.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error ?? 'Failed to update password');
      } else {
        toast.error('Failed to update password');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow p-4 sticky top-6">
            <nav className="space-y-2">
              <a href="#profile" className="flex items-center p-3 rounded-lg bg-blue-50 text-blue-600">
                <FiUser className="mr-3" />
                <span>Profile</span>
              </a>
              <a href="#security" className="flex items-center p-3 rounded-lg hover:bg-gray-50 text-gray-700">
                <FiLock className="mr-3" />
                <span>Security</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Right Column - Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div id="profile" className="bg-white rounded-xl shadow">
            <div className="p-6 border-b">
              <div className="flex items-center">
                <FiUser className="text-blue-600 mr-3" />
                <h2 className="text-lg font-semibold">Profile Information</h2>
              </div>
            </div>
            <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={company?.email || ''}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                  disabled
                />
                <p className="text-sm text-gray-500 mt-1">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Created
                </label>
                <input
                  type="text"
                  value={new Date(company?.createdAt || '').toLocaleDateString()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                  disabled
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Security Settings */}
          <div id="security" className="bg-white rounded-xl shadow">
            <div className="p-6 border-b">
              <div className="flex items-center">
                <FiLock className="text-red-600 mr-3" />
                <h2 className="text-lg font-semibold">Security</h2>
              </div>
            </div>
            <form onSubmit={handlePasswordUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  placeholder="Enter your current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  placeholder="Re-enter your new password"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;