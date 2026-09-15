import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ResponseLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [responderId, setResponderId] = useState('RESP-2023-01');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e) => {
    e.preventDefault();
    login('response', { name: 'Response Officer', id: responderId || 'RESP-2023-01' });
    navigate('/response/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary p-3 rounded-full mb-4">
            <ShieldAlert className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Response Team Login</h1>
          <p className="text-slate-500 text-sm mt-1">Responder Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input 
            label="Responder ID / Email" 
            type="text" 
            placeholder="e.g. RESP-2023-01" 
            value={responderId}
            onChange={(e) => setResponderId(e.target.value)}
            required
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="w-full">
            Login as Responder
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 space-x-4">
          <span>Switch Portal:</span>
          <Link to="/student/login" className="text-primary hover:underline font-medium">Student Portal</Link>
          <span>•</span>
          <Link to="/admin/login" className="text-primary hover:underline font-medium">Admin Portal</Link>
        </div>
      </Card>
    </div>
  );
};

export default ResponseLogin;
