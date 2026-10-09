
import React from 'react';

const DashboardGrid = ({ children, className = '' }) => {
  return (
    <div className={`row g-3 dashboard-grid ${className}`.trim()}>
      {children}
    </div>
  );
};

export default DashboardGrid;
