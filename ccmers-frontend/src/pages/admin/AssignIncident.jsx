import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIncidentContext } from '../../context/IncidentContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { ArrowLeft } from 'lucide-react';

const AssignIncident = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { incidents, updateIncident, departments } = useIncidentContext();
  
  const incident = incidents.find(i => i.id === id);

  const [assignedDepartment, setAssignedDepartment] = useState('');
  const [priority, setPriority] = useState('');

  useEffect(() => {
    if (incident) {
      setAssignedDepartment(incident.assignedDepartment || '');
      setPriority(incident.severity || '');
    }
  }, [incident]);

  if (!incident) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Incident Not Found</h2>
        <Button onClick={() => navigate('/admin/all-incidents')}>Back to All Incidents</Button>
      </div>
    );
  }

  const handleAssign = (e) => {
    e.preventDefault();
    if (!assignedDepartment || !priority) {
      alert('Please select both department and priority.');
      return;
    }
    
    updateIncident(id, { 
      assignedDepartment,
      severity: priority, // mapping priority to severity
      status: incident.status === 'Reported' ? 'Assigned' : incident.status // update status if it's new
    });
    
    navigate(`/admin/incident-details/${id}`);
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Assign Incident</h1>
          <p className="text-sm text-slate-500 mt-1">ID: {incident.id} | {incident.title}</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleAssign} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Assign to Department
            </label>
            <select
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white"
              value={assignedDepartment}
              onChange={(e) => setAssignedDepartment(e.target.value)}
            >
              <option value="" disabled>Select department</option>
              {departments.length === 0 ? (
                <option value="Campus Security">Campus Security (Default)</option>
              ) : (
                departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))
              )}
              {/* Fallbacks if departments are empty but we want some defaults */}
              {departments.length > 0 && departments.every(d => d.name !== 'Medical Response') && <option value="Medical Response">Medical Response</option>}
              {departments.length > 0 && departments.every(d => d.name !== 'Facilities') && <option value="Facilities">Facilities</option>}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Priority / Severity
            </label>
            <select
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="" disabled>Select priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" className="w-full md:w-auto">
              Confirm Assignment
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AssignIncident;
