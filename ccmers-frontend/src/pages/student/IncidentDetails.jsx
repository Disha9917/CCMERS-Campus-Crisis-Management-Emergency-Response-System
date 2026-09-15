import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Stepper from '../../components/Stepper';
import StatusBadge from '../../components/StatusBadge';
import SeverityBadge from '../../components/SeverityBadge';
import Button from '../../components/Button';
import { useIncidentContext } from '../../context/IncidentContext';
import { ArrowLeft, MapPin, Calendar, Tag, ShieldAlert } from 'lucide-react';

const IncidentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { incidents } = useIncidentContext();
  
  const incident = incidents.find(inc => inc.id === id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/student/my-incidents')}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Incident Details</h1>
      </div>

      {!incident ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center">
           <ShieldAlert className="w-16 h-16 text-slate-300 mb-4" />
           <h2 className="text-xl font-bold text-slate-900 mb-2">Incident Not Found</h2>
           <p className="text-slate-500 mb-6">The incident you are looking for does not exist or has been removed.</p>
           <Button onClick={() => navigate('/student/my-incidents')}>Back to My Incidents</Button>
        </Card>
      ) : (
        <>
          <Card>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-semibold text-slate-500">{incident.id}</span>
                <StatusBadge status={incident.status} />
                <SeverityBadge severity={incident.severity} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{incident.title}</h2>
            </div>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                {incident.category}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {incident.location}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {incident.date}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Description</h3>
              <p className="text-slate-700 bg-slate-50 p-4 rounded-md border border-slate-200">
                {incident.description}
              </p>
            </div>
            
            {incident.resolutionRemarks && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Resolution Remarks</h3>
                <p className="text-slate-700 bg-green-50 p-4 rounded-md border border-green-200">
                  {incident.resolutionRemarks}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-slate-900 mb-2">Status Tracking</h2>
        <p className="text-sm text-slate-500 mb-8">Track the progress of your reported incident.</p>
        <Stepper currentStatus={incident.status} />
      </Card>
      </>
      )}
    </div>
  );
};

export default IncidentDetails;
