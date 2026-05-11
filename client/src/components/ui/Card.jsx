import React from 'react';

export const Card = ({ children, className = '', hoverable = false }) => {
  return (
    <div className={`glass-card p-6 ${hoverable ? 'glass-card-hover' : ''} ${className}`}>
      {children}
    </div>
  );
};
