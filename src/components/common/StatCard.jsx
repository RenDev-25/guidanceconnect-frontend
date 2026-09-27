import React from 'react';

/**
 * Dashboard Statistic Card
 * @param {Object} props
 * @param {string} props.label - Metric name (e.g., 'Total Requests')
 * @param {number|string} props.value - The metric value
 * @param {string} [props.icon] - Bootstrap icon class (e.g., 'bi-file-earmark')
 * @param {string} [props.color='primary'] - Bootstrap color theme
 */
const StatCard = ({ label, value, icon, color = 'primary' }) => {
  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body d-flex align-items-center">
        {icon && (
          <div className={`bg-${color} bg-opacity-10 text-${color} p-3 rounded me-3 d-flex align-items-center justify-content-center`} style={{ width: '60px', height: '60px' }}>
            <i className={`bi ${icon} fs-3`}></i>
          </div>
        )}
        <div>
          <h6 className="text-muted mb-1">{label}</h6>
          <h3 className="mb-0 fw-bold">{value}</h3>
        </div>
      </div>
    </div>
  );
};

export default StatCard;