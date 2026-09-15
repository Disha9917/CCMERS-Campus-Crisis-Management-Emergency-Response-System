import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const role = currentUser?.role || 'student';

  const handleLogout = () => {
    logout();
    navigate(`/${role}/login`);
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 z-10 sticky top-0">
      <div className="flex items-center">
        {/* Page / System Title */}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 mr-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
            <User className="w-4 h-4 text-slate-500" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-700 capitalize">
              {currentUser?.name || `${role} User`}
            </p>
            <p className="text-xs text-slate-500">
              Role: <span className="font-semibold text-slate-800 uppercase">{role}</span>
            </p>
          </div>
        </div>
        
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleLogout}
          className="text-slate-600 border-slate-200"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
