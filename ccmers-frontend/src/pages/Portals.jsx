import React from 'react';
import Card from '../components/Card';

export const StudentPortal = () => (
  <div>
    <h1 className="text-2xl font-bold text-slate-900 mb-6">Student Portal</h1>
    <Card>
      <p className="text-slate-600">Report an emergency or track your reported incidents here.</p>
    </Card>
  </div>
);

export const ResponseTeam = () => (
  <div>
    <h1 className="text-2xl font-bold text-slate-900 mb-6">Response Team Portal</h1>
    <Card>
      <p className="text-slate-600">View and manage assigned emergency incidents.</p>
    </Card>
  </div>
);

export const AdminPanel = () => (
  <div>
    <h1 className="text-2xl font-bold text-slate-900 mb-6">Admin Panel</h1>
    <Card>
      <p className="text-slate-600">Manage users, campus zones, and view analytics.</p>
    </Card>
  </div>
);
