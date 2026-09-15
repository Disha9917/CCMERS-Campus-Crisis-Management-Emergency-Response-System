import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidentContext } from '../../context/IncidentContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import AnimatedCounter from '../../components/AnimatedCounter';
import EmptyState from '../../components/EmptyState';
import { AlertTriangle, Clock, CheckCircle, FileText } from 'lucide-react';

const ResponseDashboard = () => {
  const navigate = useNavigate();
  const { incidents } = useIncidentContext();
  
  const assigned = incidents.filter(i => i.status !== 'Reported').length;
  const inProgress = incidents.filter(i => i.status === 'In Progress').length;
  const resolved = incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;

  const recentAssigned = incidents.filter(i => i.status !== 'Reported').slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Response Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage and respond to emergencies effectively.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hoverable className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 font-medium text-sm">Total Assigned</span>
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <span className="text-4xl font-bold text-slate-800"><AnimatedCounter value={assigned} /></span>
        </Card>
        
        <Card hoverable className="p-6 border-t-4 border-t-amber-500">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 font-medium text-sm">In Progress</span>
            <div className="p-2 bg-amber-50 rounded-lg">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <span className="text-4xl font-bold text-slate-800"><AnimatedCounter value={inProgress} /></span>
        </Card>
        
        <Card hoverable className="p-6 border-t-4 border-t-emerald-500">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 font-medium text-sm">Resolved</span>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          <span className="text-4xl font-bold text-slate-800"><AnimatedCounter value={resolved} /></span>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-800">Recent Assignments</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/response/assigned-incidents')}>View All</Button>
        </div>

        {recentAssigned.length === 0 ? (
          <Card>
            <EmptyState 
              icon={FileText}
              title="No Assignments" 
              description="You have no recent assignments in your queue." 
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
                  {recentAssigned.map((incident) => (
                    <tr 
                      key={incident.id} 
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/response/incident-details/${incident.id}`)}
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

export default ResponseDashboard;
