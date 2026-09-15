import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const AccessDenied = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const userRole = currentUser?.role || 'student';

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-6 shadow-xl border-red-100">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
          <ShieldAlert className="w-10 h-10" />
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
          <p className="text-slate-500 text-sm mt-2">
            You do not have authorization to view this page. You are currently logged in as{' '}
            <span className="font-semibold text-slate-800 capitalize">{userRole}</span>.
          </p>
        </div>

        <div className="pt-2">
          <Button 
            onClick={() => navigate(`/${userRole}/dashboard`)}
            className="w-full flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to My Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AccessDenied;
