import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidentContext } from '../../context/IncidentContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import AnimatedCounter from '../../components/AnimatedCounter';
import EmptyState from '../../components/EmptyState';
import { AlertTriangle, List, CheckCircle, FileText } from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { getSummary, incidents } = useIncidentContext();
  const summary = getSummary();
  
  const recentIncidents = incidents.slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Student Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back. Report or track an emergency.</p>
        </div>
        <Button variant="danger" onClick={() => navigate('/student/report-incident')}>
          <AlertTriangle className="w-5 h-5 mr-2" />
          Report Emergency
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hoverable className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 font-medium text-sm">Total Reported</span>
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <span className="text-4xl font-bold text-slate-800"><AnimatedCounter value={summary.total} /></span>
        </Card>
        
        <Card hoverable className="p-6 border-t-4 border-t-amber-500">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 font-medium text-sm">Active</span>
            <div className="p-2 bg-amber-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <span className="text-4xl font-bold text-slate-800"><AnimatedCounter value={summary.open + summary.inProgress} /></span>
        </Card>
        
        <Card hoverable className="p-6 border-t-4 border-t-emerald-500">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 font-medium text-sm">Resolved</span>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          <span className="text-4xl font-bold text-slate-800"><AnimatedCounter value={summary.resolved} /></span>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-800">Recent Reports</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/student/my-incidents')}>View All</Button>
        </div>

        {recentIncidents.length === 0 ? (
          <Card>
            <EmptyState 
              icon={List}
              title="No Incidents Reported" 
              description="You haven't reported any incidents yet. Use the 'Report Emergency' button if you need help." 
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
                      onClick={() => navigate(`/student/incident-details/${incident.id}`)}
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

export default StudentDashboard;
