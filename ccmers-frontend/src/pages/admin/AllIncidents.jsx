import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidentContext } from '../../context/IncidentContext';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import SeverityBadge from '../../components/SeverityBadge';
import Select from '../../components/Select';
import EmptyState from '../../components/EmptyState';
import { List } from 'lucide-react';

const AllIncidents = () => {
  const navigate = useNavigate();
  const { incidents } = useIncidentContext();
  
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  const filteredIncidents = incidents.filter(inc => {
    return (statusFilter ? inc.status === statusFilter : true) && 
           (severityFilter ? inc.severity === severityFilter : true);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">All Incidents</h1>
        <p className="text-slate-500 mt-1">Master view of all reported incidents in the system.</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-64">
            <Select 
              label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'Reported', label: 'Reported' },
                { value: 'Assigned', label: 'Assigned' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Resolved', label: 'Resolved' },
                { value: 'Closed', label: 'Closed' }
              ]}
            />
          </div>
          <div className="w-full md:w-64">
            <Select 
              label="Filter by Severity"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              options={[
                { value: '', label: 'All Severities' },
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' },
                { value: 'Critical', label: 'Critical' }
              ]}
            />
          </div>
        </div>

        {filteredIncidents.length === 0 ? (
          <EmptyState 
            icon={List}
            title="No Incidents Match" 
            description="No incidents found for the selected filters." 
          />
        ) : (
          <div className="overflow-x-auto -mx-6 -mb-6 border-t border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Severity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredIncidents.map((incident) => (
                  <tr 
                    key={incident.id} 
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/admin/incident-details/${incident.id}`)}
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">{incident.id}</td>
                    <td className="px-6 py-4">{incident.title}</td>
                    <td className="px-6 py-4">{incident.category}</td>
                    <td className="px-6 py-4"><SeverityBadge severity={incident.severity || 'Low'} /></td>
                    <td className="px-6 py-4"><StatusBadge status={incident.status} /></td>
                    <td className="px-6 py-4">{incident.assignedDepartment || '-'}</td>
                    <td className="px-6 py-4 text-slate-500">{incident.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AllIncidents;
