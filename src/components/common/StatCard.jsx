
import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  borderTheme = 'primary',
  icon = null,
}) => {
  return (
    <div className="col-12 col-sm-6 col-lg-4 col-xxl-3 dashboard-stat-column">
      <div
        className={`card dashboard-stat-card h-100 shadow-sm border-0 border-start border-${borderTheme} border-4`}
      >
        <div className="card-body d-flex justify-content-between align-items-start gap-3">
          <div className="dashboard-stat-content flex-grow-1">
            <p className="text-muted small fw-semibold mb-1 dashboard-stat-title">
              {title}
            </p>

            <h2 className="dashboard-stat-value fw-bold text-dark mb-1">
              {value ?? 0}
            </h2>

            {subtitle && (
              <p className="text-muted mb-0 dashboard-stat-subtitle">
                {subtitle}
              </p>
            )}
          </div>

          {icon && (
            <div className="dashboard-stat-icon text-muted flex-shrink-0">
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
