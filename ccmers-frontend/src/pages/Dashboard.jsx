import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard & Component Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="danger">Danger Button</Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Form Inputs</h2>
          <div className="space-y-4">
            <Input label="Email Address" placeholder="Enter your email" type="email" />
            <Select 
              label="Location" 
              options={[
                { value: 'library', label: 'Main Library' },
                { value: 'hostel', label: 'Boys Hostel A' },
                { value: 'cafeteria', label: 'Cafeteria' },
              ]}
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Status Badges</h2>
          <div className="flex flex-wrap gap-3">
            <StatusBadge status="Reported" />
            <StatusBadge status="Assigned" />
            <StatusBadge status="In Progress" />
            <StatusBadge status="Resolved" />
            <StatusBadge status="Closed" />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Severity Badges</h2>
          <div className="flex flex-wrap gap-3">
            <SeverityBadge severity="Low" />
            <SeverityBadge severity="Medium" />
            <SeverityBadge severity="High" />
            <SeverityBadge severity="Critical" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
