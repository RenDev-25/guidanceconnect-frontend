import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  borderTheme = 'primary',
  icon = null,
}) => {
  return (
    <div className="col-12 col-sm-6 col-lg-4 col-xl">
      <div
        className={`card h-100 shadow-sm border-0 border-start border-${borderTheme} border-4`}
      >
        <div className="card-body d-flex justify-content-between align-items-start">
          <div>
            <p className="text-muted small fw-semibold mb-1">
              {title}
            </p>

            <h2 className="fw-bold text-dark mb-1">
              {value ?? 0}
            </h2>

            {subtitle && (
              <p
                className="text-muted mb-0"
                style={{ fontSize: '0.8rem' }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {icon && (
            <div className="text-muted fs-4 ms-3">
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;