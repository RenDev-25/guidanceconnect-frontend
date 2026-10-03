
import React from 'react';

const DashboardGrid = ({
  children,
  className = '',
  gap = 4,
}) => {
  return (
    <div className={`row g-${gap} mb-4 ${className}`.trim()}>
      {children}
    </div>
  );
};

export default DashboardGrid;
