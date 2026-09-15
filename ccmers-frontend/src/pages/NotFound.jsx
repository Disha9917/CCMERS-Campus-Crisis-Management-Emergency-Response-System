import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { ShieldAlert } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <ShieldAlert className="h-20 w-20 text-slate-300 mb-6" />
      <h1 className="text-4xl font-bold text-slate-900 mb-2">404 - Access Denied / Not Found</h1>
      <p className="text-slate-500 max-w-md mx-auto mb-8">
        The page you are looking for doesn't exist or you don't have permission to access it. 
        Please navigate back to your respective portal.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate('/student/login')} variant="outline">Student Portal</Button>
        <Button onClick={() => navigate('/admin/login')}>Admin Portal</Button>
      </div>
    </div>
  );
};

export default NotFound;
