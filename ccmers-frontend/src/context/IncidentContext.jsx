import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { initialIncidents, initialDepartments } from '../data/mockIncidents';

const IncidentContext = createContext();

export const IncidentProvider = ({ children }) => {
  const [incidents, setIncidents] = useState(() => {
    try {
      const saved = localStorage.getItem('ccmers_incidents');
      return saved && JSON.parse(saved).length > 0 ? JSON.parse(saved) : initialIncidents;
    } catch {
      return initialIncidents;
    }
  });

  const [departments, setDepartments] = useState(() => {
    try {
      const saved = localStorage.getItem('ccmers_departments');
      return saved && JSON.parse(saved).length > 0 ? JSON.parse(saved) : initialDepartments;
    } catch {
      return initialDepartments;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ccmers_incidents', JSON.stringify(incidents));
    } catch (e) {
      console.error('Failed to save incidents to localStorage', e);
    }
  }, [incidents]);

  useEffect(() => {
    try {
      localStorage.setItem('ccmers_departments', JSON.stringify(departments));
    } catch (e) {
      console.error('Failed to save departments to localStorage', e);
    }
  }, [departments]);
  
  // Basic user info for the session
  const [user, setUser] = useState({
    name: '',
    id: '',
    department: '',
    email: '',
    phone: ''
  });

  const addIncident = (incident) => {
    const newIncident = {
      ...incident,
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Reported',
      date: new Date().toISOString().split('T')[0],
      dateTime: new Date().toLocaleString(),
      resolutionRemarks: '',
      resolutionTimeHours: 0
    };
    setIncidents(prev => [newIncident, ...prev]);
    toast.success('Incident Reported Successfully!', { icon: '🚨' });
  };

  const updateIncident = (id, updates) => {
    setIncidents(prev => prev.map(inc => 
      inc.id === id ? { ...inc, ...updates } : inc
    ));
    toast.success(`Incident ${id} Updated!`, { icon: '✅' });
  };

  const getSummary = () => {
    return {
      total: incidents.length,
      open: incidents.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length,
      resolved: incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length
    };
  };

  const getResponseSummary = () => {
    return {
      assigned: incidents.filter(i => i.status === 'Assigned' || i.status === 'Reported').length,
      inProgress: incidents.filter(i => i.status === 'In Progress').length,
      resolved: incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length
    };
  };

  const getAdminSummary = () => {
    return {
      total: incidents.length,
      open: incidents.filter(i => i.status === 'Reported').length,
      inProgress: incidents.filter(i => i.status === 'Assigned' || i.status === 'In Progress').length,
      resolved: incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length,
      critical: incidents.filter(i => i.severity === 'Critical').length
    };
  };

  return (
    <IncidentContext.Provider value={{ 
      incidents, 
      setIncidents,
      addIncident, 
      updateIncident,
      getSummary, 
      getResponseSummary,
      getAdminSummary,
      user, 
      setUser,
      departments,
      setDepartments
    }}>
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncidentContext = () => useContext(IncidentContext);
