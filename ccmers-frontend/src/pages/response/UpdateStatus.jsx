import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIncidentContext } from '../../context/IncidentContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const UpdateStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { incidents, updateIncident } = useIncidentContext();
  
  const incident = incidents.find(i => i.id === id);

  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (incident) {
      setStatus(incident.status);
      setRemarks(incident.resolutionRemarks || '');
    }
  }, [incident]);

  if (!incident) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Incident Not Found</h2>
        <Button onClick={() => navigate('/response/assigned-incidents')}>Back to Assigned Incidents</Button>
      </div>
    );
  }

  const handleUpdate = (e) => {
    e.preventDefault();
    updateIncident(id, { 
      status: status, 
      resolutionRemarks: remarks 
    });
    navigate('/response/assigned-incidents');
  };

  const statusOptions = ['Reported', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

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
          <h1 className="text-2xl font-bold text-slate-900">Update Incident Status</h1>
          <p className="text-sm text-slate-500 mt-1">Incident ID: {incident.id}</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleUpdate} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Current Status Progression
            </label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setStatus(opt)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                    status === opt 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {status === opt && <CheckCircle2 className="inline-block w-4 h-4 mr-1 mb-0.5" />}
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Resolution Remarks (Optional)
            </label>
            <textarea
              className="w-full rounded-md border border-slate-300 p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[120px]"
              placeholder="Add notes about actions taken, updates, or resolution details..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit">
              Update Status
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UpdateStatus;
