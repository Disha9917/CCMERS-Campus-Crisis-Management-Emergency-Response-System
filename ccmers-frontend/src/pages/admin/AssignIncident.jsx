import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIncidentContext } from '../../context/IncidentContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Select from '../../components/Select';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

const AssignIncident = () => {
  const { id: urlId } = useParams();
  const navigate = useNavigate();
  const { incidents, updateIncident, departments } = useIncidentContext();
  
  const [selectedId, setSelectedId] = useState(urlId || '');
  const [assignedDepartment, setAssignedDepartment] = useState('');
  const [priority, setPriority] = useState('');

  const currentIncident = incidents.find(i => i.id === (selectedId || urlId)) || (incidents.length > 0 ? incidents[0] : null);

  useEffect(() => {
    if (urlId) {
      setSelectedId(urlId);
    } else if (incidents.length > 0 && !selectedId) {
      setSelectedId(incidents[0].id);
    }
  }, [urlId, incidents]);

  useEffect(() => {
    if (currentIncident) {
      setAssignedDepartment(currentIncident.assignedDepartment || 'Campus Security');
      setPriority(currentIncident.severity || 'Medium');
    }
  }, [currentIncident]);

  const handleAssign = (e) => {
    e.preventDefault();
    if (!currentIncident) return;
    if (!assignedDepartment || !priority) {
      alert('Please select both department and priority.');
      return;
    }
    
    updateIncident(currentIncident.id, { 
      assignedDepartment,
      severity: priority,
      status: currentIncident.status === 'Reported' ? 'Assigned' : currentIncident.status
    });
    
    navigate(`/admin/all-incidents`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Assign Incident</h1>
          <p className="text-sm text-slate-500 mt-1">Dispatch emergency response department & set priority level.</p>
        </div>
      </div>

      {incidents.length === 0 ? (
        <Card className="p-8 text-center">
          <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-800">No Incidents Available</h2>
          <p className="text-sm text-slate-500 mt-1">There are no incidents currently registered in the system.</p>
        </Card>
      ) : (
        <Card className="p-6 space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <Select 
              label="Select Incident to Assign"
              value={selectedId || (currentIncident ? currentIncident.id : '')}
              onChange={(e) => setSelectedId(e.target.value)}
              options={incidents.map(inc => ({
                value: inc.id,
                label: `${inc.id} - ${inc.title} [Current: ${inc.assignedDepartment || 'Unassigned'}]`
              }))}
            />
          </div>

          {currentIncident && (
            <form onSubmit={handleAssign} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Assign to Department
                </label>
                <select
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
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
                  {departments.length > 0 && departments.every(d => d.name !== 'Campus Security') && <option value="Campus Security">Campus Security</option>}
                  {departments.length > 0 && departments.every(d => d.name !== 'Medical Response') && <option value="Medical Response">Medical Response</option>}
                  {departments.length > 0 && departments.every(d => d.name !== 'Facilities & Maintenance') && <option value="Facilities & Maintenance">Facilities & Maintenance</option>}
                  {departments.length > 0 && departments.every(d => d.name !== 'IT Support') && <option value="IT Support">IT Support</option>}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Priority / Severity Level
                </label>
                <select
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
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

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Confirm Department Assignment
                </Button>
              </div>
            </form>
          )}
        </Card>
      )}
    </div>
  );
};

export default AssignIncident;
