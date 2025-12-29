import React from 'react';
import { useAuth } from '../auth/useAuth';
import { FiBell, FiSearch } from 'react-icons/fi';

const Navbar: React.FC = () => {
  const { company } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          <div className="lg:hidden">
            <h1 className="text-xl font-bold text-gray-900">OrganiseAccess</h1>
          </div>

          {/* Search bar */}
          <div className="hidden lg:block flex-1 max-w-2xl">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 lg:space-x-4 ml-auto lg:ml-0">
            <button className="lg:hidden p-2 text-gray-600 hover:text-gray-900">
              <FiSearch size={20} />
            </button>
            
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <FiBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="hidden lg:flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {company?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{company?.name}</p>
                <p className="text-xs text-gray-500">{company?.email}</p>
              </div>
            </div>
            
            <div className="lg:hidden w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {company?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
        
        <div className="lg:hidden mt-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;