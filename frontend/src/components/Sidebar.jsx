import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  BarChart2, 
  MessageSquare, 
  Settings,
  Swords
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Tests', path: '/tests', icon: BookOpen },
    { name: 'Battle Room', path: '/battle', icon: Swords },
    { name: 'Groups', path: '/groups', icon: Users },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'AI Tutor', path: '/tutor', icon: MessageSquare },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-full flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <BookOpen className="text-purple-600 mr-2" size={24} />
        <span className="text-xl font-bold text-slate-800">Quest Mistra</span>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <item.icon className="mr-3 flex-shrink-0 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-purple-50 text-purple-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`
          }
        >
          <Settings className="mr-3 flex-shrink-0 h-5 w-5 text-slate-400" />
          Settings
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
