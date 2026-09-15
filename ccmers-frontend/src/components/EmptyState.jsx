import React from 'react';
import { FileQuestion } from 'lucide-react';

const EmptyState = ({ icon: Icon = FileQuestion, title = "No data found", description = "There is currently no data to display here." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-slate-50 p-4 rounded-full mb-4">
        <Icon className="w-12 h-12 text-slate-300" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm">{description}</p>
    </div>
  );
};

export default EmptyState;
