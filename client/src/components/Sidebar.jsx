import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Utensils, Dumbbell, Droplets, Moon, Sparkles, User } from 'lucide-react';

const Sidebar = () => {
  const links = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/meals', label: 'Meals', icon: <Utensils size={20} /> },
    { to: '/workouts', label: 'Workouts', icon: <Dumbbell size={20} /> },
    { to: '/water', label: 'Water', icon: <Droplets size={20} /> },
    { to: '/sleep', label: 'Sleep', icon: <Moon size={20} /> },
    { to: '/ai-suggestions', label: 'AI Coach', icon: <Sparkles size={20} /> },
    { to: '/profile', label: 'Profile', icon: <User size={20} /> },
  ];

  return (
    <div className="glass-card sticky top-6 h-[calc(100vh-3rem)] overflow-y-auto">
      <nav className="flex flex-col space-y-2 p-2">
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-4 mt-2">Menu</h3>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                isActive
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white hover:translate-x-1'
              }`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* Motivation Box */}
      <div className="absolute bottom-6 left-0 right-0 px-4">
        <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800/50">
          <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200 italic">
            "Push harder than yesterday if you want a different tomorrow."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
