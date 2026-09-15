import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIncidentContext } from '../../context/IncidentContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import SeverityBadge from '../../components/SeverityBadge';
import { ArrowLeft, Clock, MapPin, Tag, User, FileText } from 'lucide-react';

const AdminIncidentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { incidents } = useIncidentContext();
  
  const incident = incidents.find(i => i.id === id);

  if (!incident) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Incident Not Found</h2>
        <p className="text-slate-500 mb-6">The incident you are looking for does not exist.</p>
        <Button onClick={() => navigate('/admin/all-incidents')}>Back to All Incidents</Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/all-incidents')}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Incident Details (Admin)</h1>
        </div>
        <Button onClick={() => navigate(`/admin/assign-incident/${incident.id}`)}>
          Assign / Update Priority
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-slate-900">{incident.title}</h2>
              <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-mono">{incident.id}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Reported: {incident.date}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800">
              Status: {incident.status}
            </span>
            <SeverityBadge severity={incident.severity} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-1">
                  <Tag className="h-4 w-4" /> Category
                </h3>
                <p className="text-slate-900">{incident.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-1">
                  <User className="h-4 w-4" /> Assigned Department
                </h3>
                <p className="text-slate-900">{incident.assignedDepartment || 'Unassigned'}</p>
              </div>
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4" /> Location
                </h3>
                <p className="text-slate-900">{incident.location}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4" /> Description
            </h3>
            <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
              {incident.description}
            </p>
          </div>
        </div>

        {incident.resolutionRemarks && (
          <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="text-sm font-bold text-slate-700 mb-2">Resolution Remarks (From Response Team)</h3>
            <p className="text-slate-800 text-sm">{incident.resolutionRemarks}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminIncidentDetails;
