import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import {
  FiHome,
  FiKey,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiChevronDown,
} from 'react-icons/fi';

const Sidebar: React.FC = () => {
  const { company, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: FiHome },
    { name: 'API Key', to: '/api-key', icon: FiKey },
    { name: 'Companies', to: '/companies', icon: FiUsers },
    { name: 'Settings', to: '/settings', icon: FiSettings },
  ];

  return (
    <aside className="hidden lg:block fixed top-0 left-0 z-40 h-screen w-64 bg-white text-gray-800 border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">OrganiseAccess</h1>
        <p className="text-gray-500 text-sm mt-1">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-gray-200 text-gray-900 font-semibold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <item.icon className="mr-3" size={20} />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Profile Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <span className="font-semibold">
                  {company?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3 text-left">
                <p className="text-sm font-medium text-gray-900">{company?.name}</p>
                <p className="text-xs text-gray-500 truncate max-w-30">
                  {company?.email}
                </p>
              </div>
            </div>
            <FiChevronDown
              className={`transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 z-10">
              <button
                onClick={() => {
                  logout();
                  setIsProfileOpen(false);
                }}
                className="flex items-center w-full p-3 text-left text-red-500 hover:bg-gray-100 transition-colors"
              >
                <FiLogOut className="mr-3" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;