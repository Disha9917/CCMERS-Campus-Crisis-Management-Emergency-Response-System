import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidentContext } from '../../context/IncidentContext';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { List } from 'lucide-react';

const MyIncidents = () => {
  const navigate = useNavigate();
  const { incidents } = useIncidentContext();

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Incidents</h1>
        <p className="text-slate-500 mt-1">Track the status of your reported emergencies.</p>
      </div>

      {incidents.length === 0 ? (
        <Card>
          <EmptyState 
            icon={List}
            title="No Incidents Found" 
            description="You haven't reported any incidents yet." 
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {incidents.map((incident) => (
                  <tr 
                    key={incident.id} 
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/student/incident-details/${incident.id}`)}
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">{incident.id}</td>
                    <td className="px-6 py-4">{incident.title}</td>
                    <td className="px-6 py-4">{incident.category}</td>
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
  );
};

export default MyIncidents;
