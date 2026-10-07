import React from 'react';

const DashboardGrid = ({ children }) => {
  return (
    <div className="row g-4 mb-4">
      {children}
    </div>
  );
};

export default DashboardGrid;