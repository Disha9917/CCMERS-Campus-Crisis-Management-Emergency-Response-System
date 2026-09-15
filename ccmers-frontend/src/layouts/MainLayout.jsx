import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Toaster } from 'react-hot-toast';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: 'border border-slate-200 shadow-lg text-slate-800 font-medium rounded-lg',
          duration: 4000,
        }}
      />
    </div>
  );
};

export default MainLayout;
