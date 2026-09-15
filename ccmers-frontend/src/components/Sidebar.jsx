import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  List, 
  BarChart2, 
  Shield, 
  AlertTriangle, 
  Users, 
  User, 
  ShieldAlert 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { currentUser } = useAuth();

  const role = currentUser?.role || 'student';

  const sidebarConfig = {
    student: [
      { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/student/report-incident', label: 'Report Incident', icon: AlertTriangle },
      { path: '/student/my-incidents', label: 'My Incidents', icon: List },
      { path: '/student/profile', label: 'Profile', icon: User },
    ],
    response: [
      { path: '/response/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/response/assigned-incidents', label: 'Assigned Incidents', icon: FileText },
      { path: '/response/update-status', label: 'Update Status', icon: Shield },
    ],
    admin: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/admin/all-incidents', label: 'All Incidents', icon: List },
      { path: '/admin/assign-incident', label: 'Assign Incident', icon: ShieldAlert },
      { path: '/admin/department-management', label: 'Department Management', icon: Users },
      { path: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
    ]
  };

  const links = sidebarConfig[role] || sidebarConfig.student;

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col z-10 relative h-full">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          {role.charAt(0).toUpperCase() + role.slice(1)} Portal
        </h2>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={`relative flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive 
                  ? 'text-primary font-semibold' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute inset-0 bg-blue-50 rounded-lg -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <link.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
              <span className="z-10">{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
