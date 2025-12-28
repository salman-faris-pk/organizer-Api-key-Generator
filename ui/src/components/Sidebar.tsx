import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import {
  FiHome,
  FiKey,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronDown,
} from 'react-icons/fi';

const Sidebar: React.FC = () => {
  const { company, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: FiHome },
    { name: 'API Key', to: '/api-key', icon: FiKey },
    { name: 'Companies', to: '/companies', icon: FiUsers },
    { name: 'Settings', to: '/settings', icon: FiSettings },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
      >
        {isCollapsed ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(false)}
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen bg-gray-900 text-white
          transition-transform duration-300 ease-in-out
          ${isCollapsed ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
         w-64
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">Company Portal</h1>
          <p className="text-gray-400 text-sm mt-1">Admin Dashboard</p>
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
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                  onClick={() => setIsCollapsed(false)}
                >
                  <item.icon className="mr-3" size={20} />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="font-semibold">
                    {company?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3 text-left">
                  <p className="text-sm font-medium">{company?.name}</p>
                  <p className="text-xs text-gray-400 truncate max-w-35">
                    {company?.email}
                  </p>
                </div>
              </div>
              <FiChevronDown
                className={`transition-transform ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  className="flex items-center w-full p-3 text-left text-red-400 hover:bg-gray-700 transition-colors"
                >
                  <FiLogOut className="mr-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;