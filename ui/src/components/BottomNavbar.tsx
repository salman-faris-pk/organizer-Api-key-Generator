import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiKey, FiUsers, FiSettings } from 'react-icons/fi';

const BottomNavbar: React.FC = () => {
  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: FiHome },
    { name: 'API Key', to: '/api-key', icon: FiKey },
    { name: 'Companies', to: '/companies', icon: FiUsers },
    { name: 'Settings', to: '/settings', icon: FiSettings },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      <div className="flex items-center justify-around h-16 px-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center p-2 min-w-16 ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`
            }
          >
            <item.icon size={20} />
            <span className="text-xs mt-1">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavbar;