import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusStyles = (statusVal) => {
    switch (statusVal) {
      case 'Reported':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Assigned':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'In Progress':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Resolved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(status)}`}>
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;
