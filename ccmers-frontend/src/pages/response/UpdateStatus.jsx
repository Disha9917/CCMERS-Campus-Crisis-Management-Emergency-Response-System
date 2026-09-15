import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIncidentContext } from '../../context/IncidentContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Select from '../../components/Select';
import { ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

const UpdateStatus = () => {
  const { id: urlId } = useParams();
  const navigate = useNavigate();
  const { incidents, updateIncident } = useIncidentContext();

  const [selectedId, setSelectedId] = useState(urlId || '');
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState('');

  // Find selected incident
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
      setStatus(currentIncident.status);
      setRemarks(currentIncident.resolutionRemarks || '');
    }
  }, [currentIncident]);

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!currentIncident) return;

    updateIncident(currentIncident.id, { 
      status: status, 
      resolutionRemarks: remarks 
    });
    navigate('/response/assigned-incidents');
  };

  const statusOptions = ['Reported', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Update Incident Status</h1>
          <p className="text-sm text-slate-500 mt-1">Manage progress & resolution remarks for reported incidents.</p>
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
          {/* Incident Selector Dropdown */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <Select 
              label="Select Incident to Update"
              value={selectedId || (currentIncident ? currentIncident.id : '')}
              onChange={(e) => setSelectedId(e.target.value)}
              options={incidents.map(inc => ({
                value: inc.id,
                label: `${inc.id} - ${inc.title} [${inc.status}]`
              }))}
            />

            {currentIncident && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600 pt-3 border-t border-slate-200">
                <div><span className="font-semibold text-slate-700">Category:</span> {currentIncident.category}</div>
                <div><span className="font-semibold text-slate-700">Location:</span> {currentIncident.location}</div>
                <div><span className="font-semibold text-slate-700">Assigned To:</span> {currentIncident.assignedDepartment || 'Unassigned'}</div>
              </div>
            )}
          </div>

          {currentIncident && (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Update Status Stage
                </label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setStatus(opt)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                        status === opt 
                          ? 'bg-primary text-white border-primary shadow-sm' 
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {status === opt && <CheckCircle2 className="inline-block w-4 h-4 mr-1.5 mb-0.5" />}
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Resolution Remarks & Actions Taken
                </label>
                <textarea
                  className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px]"
                  placeholder="Describe resolution steps, dispatched teams, or ongoing investigation updates..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="secondary" onClick={() => navigate('/response/assigned-incidents')}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save & Update Status
                </Button>
              </div>
            </form>
          )}
        </Card>
      )}
    </div>
  );
};

export default UpdateStatus;
