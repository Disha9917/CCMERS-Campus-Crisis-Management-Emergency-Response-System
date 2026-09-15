import React from 'react';

const Input = ({ label, id, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-slate-50 disabled:text-slate-500 transition-colors ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
