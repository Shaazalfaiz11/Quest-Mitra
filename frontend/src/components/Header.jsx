import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Bell, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-6">
      <div className="flex-1 flex items-center">
        <div className="max-w-md w-full relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-colors"
            placeholder="Search tests, groups, concepts..."
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4 ml-4">
        <button className="p-2 text-slate-400 hover:text-slate-500 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
        </button>
        
        <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium text-slate-700">{user?.name || 'Student'}</span>
            <span className="text-xs text-slate-500">{user?.role || 'Guest'}</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </div>
          
          <button 
            onClick={handleLogout}
            className="ml-2 p-1.5 text-slate-400 hover:text-red-500 transition-colors"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
