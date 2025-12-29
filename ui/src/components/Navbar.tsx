import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../auth/useAuth';
import { FiBell, FiSearch } from 'react-icons/fi';

const Navbar: React.FC = () => {
  const { company, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          <div className="lg:hidden">
            <h1 className="text-xl font-bold text-gray-900">OrganiseAccess</h1>
          </div>

          {/* Search bar (desktop) */}
          <div className="hidden lg:block flex-1 max-w-2xl">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 lg:space-x-4 ml-auto lg:ml-0">
            <button className="lg:hidden p-2 text-gray-600">
              <FiSearch size={20} />
            </button>

            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <FiBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
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

            <div className="relative lg:hidden" ref={menuRef}>
              <div
                onClick={() => setOpen(!open)}
                className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold cursor-pointer"
              >
                {company?.name?.charAt(0).toUpperCase()}
              </div>

              {open && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-50">
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search */}
        <div className="lg:hidden mt-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
