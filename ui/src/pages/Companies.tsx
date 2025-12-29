import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import toast from 'react-hot-toast';
import { FiUsers, FiSearch, FiFilter, FiEye, FiToggleLeft, FiToggleRight, FiLoader } from 'react-icons/fi';

interface Company {
  id: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
}

type FilterStatus = 'all' | 'active' | 'inactive';

const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<FilterStatus>('all');
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('/companies');
      setCompanies(response.data.companies);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error ?? 'Failed to load companies');
      } else {
        toast.error('Failed to load companies');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleCompanyStatus = async (companyId: string, currentStatus: boolean) => {
    if (updatingIds.has(companyId)) return;
    
    setUpdatingIds(prev => new Set(prev).add(companyId));
    
    const originalCompanies = [...companies];
    const newCompanies = companies.map(company =>
      company.id === companyId ? { ...company, active: !currentStatus } : company
    );
    setCompanies(newCompanies);

    try {
      const response = await axios.patch(
        `/companies/${companyId}/toggle-status`
      );
      
      toast.success(response.data.message || 'Company status updated successfully');
    } catch (error: unknown) {

      setCompanies(originalCompanies);
      
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error ?? 'Failed to update company status');
      } else {
        toast.error('Failed to update company status');
      }
    } finally {
      setUpdatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(companyId);
        return newSet;
      });
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === 'all' ||
                         (filterActive === 'active' && company.active) ||
                         (filterActive === 'inactive' && !company.active);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600 mt-2">Manage all registered companies</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {companies.length} Total
          </span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search companies by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FiFilter className="text-gray-400 mr-2" />
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value as FilterStatus)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompanies.map((company) => {
                const isUpdating = updatingIds.has(company.id);
                
                return (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <FiUsers className="text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{company.name}</div>
                          <div className="text-sm text-gray-500">{company.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleCompanyStatus(company.id, company.active)}
                          disabled={isUpdating}
                          className="relative inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUpdating ? (
                            <>
                              <FiLoader className="animate-spin text-gray-500" size={32} />
                              <span className="ml-2 text-sm font-medium text-gray-600">Updating...</span>
                            </>
                          ) : company.active ? (
                            <>
                              <FiToggleRight className="text-green-500" size={32} />
                              <span className="ml-2 text-sm font-medium text-green-600">Active</span>
                            </>
                          ) : (
                            <>
                              <FiToggleLeft className="text-gray-400" size={32} />
                              <span className="ml-2 text-sm font-medium text-gray-600">Inactive</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(company.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        disabled={isUpdating}
                      >
                        <FiEye className="inline mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No companies found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search or filter' : 'No companies are registered yet'}
            </p>
          </div>
        )}

        {/* Stats Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              Showing <span className="font-medium">{filteredCompanies.length}</span> of{' '}
              <span className="font-medium">{companies.length}</span> companies
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>{companies.filter(c => c.active).length} Active</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                <span>{companies.filter(c => !c.active).length} Inactive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companies;