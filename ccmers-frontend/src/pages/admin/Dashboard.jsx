import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidentContext } from '../../context/IncidentContext';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import AnimatedCounter from '../../components/AnimatedCounter';
import EmptyState from '../../components/EmptyState';
import { FileText, Users, BarChart3, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { getAdminSummary, incidents } = useIncidentContext();
  const summary = getAdminSummary();
  
  const recentIncidents = incidents.slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Campus-wide crisis overview and command center.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hoverable className="p-6 border-t-4 border-t-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 font-medium text-sm">Total</span>
            <div className="p-2 bg-slate-100 rounded-lg">
              <FileText className="w-5 h-5 text-slate-700" />
            </div>
          </div>
          <span className="text-4xl font-bold text-slate-800"><AnimatedCounter value={summary.total} /></span>
        </Card>
        
        <Card hoverable className="p-6 border-t-4 border-t-blue-500">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 font-medium text-sm">Open</span>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <span className="text-4xl font-bold text-slate-800"><AnimatedCounter value={summary.open} /></span>
        </Card>
        
        <Card hoverable className="p-6 border-t-4 border-t-emerald-500">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 font-medium text-sm">Resolved</span>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <span className="text-4xl font-bold text-slate-800"><AnimatedCounter value={summary.resolved} /></span>
        </Card>
        
        <Card hoverable className="p-6 border-t-4 border-t-red-500">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 font-medium text-sm">Critical</span>
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <span className="text-4xl font-bold text-slate-800"><AnimatedCounter value={summary.critical || 0} /></span>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-800">Recent Campus Incidents</h2>
          <button 
            onClick={() => navigate('/admin/all-incidents')}
            className="text-primary hover:text-primary-dark text-sm font-medium transition-colors"
          >
            View Full Log &rarr;
          </button>
        </div>

        {recentIncidents.length === 0 ? (
          <Card>
            <EmptyState 
              icon={FileText}
              title="No Incidents Reported" 
              description="The campus is currently clear." 
            />
          </Card>
        ) : (
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentIncidents.map((incident) => (
                    <tr 
                      key={incident.id} 
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/admin/incident-details/${incident.id}`)}
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">{incident.id}</td>
                      <td className="px-6 py-4">{incident.title}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={incident.status} />
                      </td>
                      <td className="px-6 py-4 text-slate-500">{incident.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
