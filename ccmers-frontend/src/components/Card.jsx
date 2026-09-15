import React from 'react';

const Card = ({ children, className = '', hoverable = false }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-slate-200 ${
        hoverable ? 'transition-shadow hover:shadow-md' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
