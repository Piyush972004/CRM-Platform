
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, BarChart3, MessageSquare, Settings, Home, Database, UserCheck } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: UserCheck, label: 'Segment Builder', path: '/segments' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: MessageSquare, label: 'Create Campaign', path: '/campaigns/new' },
    { icon: BarChart3, label: 'Campaign History', path: '/campaigns' },
    { icon: Database, label: 'Data Ingestion', path: '/data' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Mini CRM</h1>
        </div>
      </div>
      
      <nav className="mt-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
                          (item.path === '/segments' && location.pathname === '/audience');
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
