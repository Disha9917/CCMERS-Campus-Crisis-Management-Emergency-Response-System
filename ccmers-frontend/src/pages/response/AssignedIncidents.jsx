import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidentContext } from '../../context/IncidentContext';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import { FileText, Edit3 } from 'lucide-react';

const AssignedIncidents = () => {
  const navigate = useNavigate();
  const { incidents } = useIncidentContext();
  
  // Show all incidents for response view
  const assignedIncidents = incidents;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Assigned Incidents</h1>
          <p className="text-slate-500 mt-1">Manage and update your assigned response tasks.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/response/update-status')}
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Update Status
        </Button>
      </div>

      {assignedIncidents.length === 0 ? (
        <Card>
          <EmptyState 
            icon={FileText}
            title="No Assigned Tasks" 
            description="Your queue is currently empty." 
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
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {assignedIncidents.map((incident) => (
                  <tr 
                    key={incident.id} 
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td 
                      className="px-6 py-4 font-medium text-slate-900 cursor-pointer hover:text-primary"
                      onClick={() => navigate(`/response/incident-details/${incident.id}`)}
                    >
                      {incident.id}
                    </td>
                    <td 
                      className="px-6 py-4 cursor-pointer hover:text-primary"
                      onClick={() => navigate(`/response/incident-details/${incident.id}`)}
                    >
                      {incident.title}
                    </td>
                    <td className="px-6 py-4">{incident.category}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={incident.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-500">{incident.date}</td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/response/update-status/${incident.id}`);
                        }}
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                        Update Status
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AssignedIncidents;
