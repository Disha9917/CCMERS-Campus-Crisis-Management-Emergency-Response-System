import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';
import Button from '../../components/Button';
import { Upload } from 'lucide-react';
import { useIncidentContext } from '../../context/IncidentContext';

const ReportIncident = () => {
  const navigate = useNavigate();
  const { addIncident } = useIncidentContext();
  
  const [severity, setSeverity] = useState('Low');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addIncident({
      title,
      category,
      location,
      description,
      severity
    });
    navigate('/student/my-incidents');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Report New Incident</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select 
              label="Incident Category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: '', label: 'Select a category' },
                { value: 'Fire Hazard', label: 'Fire Hazard' },
                { value: 'Medical Emergency', label: 'Medical Emergency' },
                { value: 'Infrastructure / Power', label: 'Infrastructure / Power' },
                { value: 'Maintenance', label: 'Maintenance' },
                { value: 'Security', label: 'Security' }
              ]}
            />
            <Input 
              label="Location" 
              required 
              placeholder="e.g. Science Block, Room 402" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <Input 
            label="Incident Title" 
            required 
            placeholder="Brief summary of the issue" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <Textarea 
            label="Description" 
            required 
            placeholder="Provide detailed information about the incident..." 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">Severity Level</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                <label 
                  key={level} 
                  className={`flex items-center justify-center px-4 py-3 border rounded-md cursor-pointer transition-colors ${
                    severity === level ? 'bg-primary-light text-white border-primary-light' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="severity" 
                    value={level} 
                    checked={severity === level}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="sr-only"
                  />
                  <span className="font-medium">{level}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
             <label className="text-sm font-medium text-slate-700 block mb-2">Attachments (Optional)</label>
             <div className="border-2 border-dashed border-slate-300 rounded-md p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mb-2 text-slate-400" />
                <p className="text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-xs mt-1">SVG, PNG, JPG or GIF (max. 8MB)</p>
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="secondary" onClick={() => navigate('/student/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Report
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ReportIncident;
