import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { initialIncidents, initialDepartments } from '../data/mockIncidents';
import { apiRequest } from '../api/axios';

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

  // Sync with API on mount or refresh
  useEffect(() => {
    const fetchApiData = async () => {
      const incRes = await apiRequest('/incidents/my');
      if (incRes.ok && incRes.data && incRes.data.data) {
        setIncidents(incRes.data.data);
      }
      const deptRes = await apiRequest('/departments');
      if (deptRes.ok && deptRes.data && deptRes.data.data) {
        setDepartments(deptRes.data.data);
      }
    };
    fetchApiData();
  }, []);

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
  
  const [user, setUser] = useState({
    name: '',
    id: '',
    department: '',
    email: '',
    phone: ''
  });

  const addIncident = async (incident) => {
    const tempId = `INC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newIncident = {
      ...incident,
      id: tempId,
      status: 'Reported',
      date: new Date().toISOString().split('T')[0],
      dateTime: new Date().toLocaleString(),
      resolutionRemarks: '',
      resolutionTimeHours: 0
    };

    // Optimistic UI update
    setIncidents(prev => [newIncident, ...prev]);

    // Backend call
    const res = await apiRequest('/incidents', 'POST', incident);
    if (res.ok && res.data && res.data.data) {
      setIncidents(prev => prev.map(i => i.id === tempId ? res.data.data : i));
    }

    toast.success('Incident Reported Successfully!', { icon: '🚨' });
  };

  const updateIncident = async (id, updates) => {
    // Optimistic UI update
    setIncidents(prev => prev.map(inc => 
      inc.id === id ? { ...inc, ...updates } : inc
    ));

    // Backend API status update
    if (updates.status || updates.resolutionRemarks !== undefined) {
      await apiRequest(`/incidents/${id}/status`, 'PATCH', {
        status: updates.status,
        resolutionRemarks: updates.resolutionRemarks,
        resolutionTimeHours: updates.resolutionTimeHours
      });
    }

    if (updates.assignedDepartment || updates.severity) {
      await apiRequest(`/incidents/${id}/assign`, 'PATCH', {
        assignedDepartment: updates.assignedDepartment,
        severity: updates.severity,
        assignedTo: updates.assignedTo
      });
    }

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
