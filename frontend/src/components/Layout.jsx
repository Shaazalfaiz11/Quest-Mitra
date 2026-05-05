import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children ? children : <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
