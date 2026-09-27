import React from 'react';

/**
 * Generic Card wrapper
 * @param {Object} props
 * @param {string} [props.title]
 * @param {React.ReactNode} [props.headerActions]
 * @param {string} [props.className]
 */
const Card = ({ title, headerActions, className = '', children }) => {
  return (
    <div className={`card shadow-sm border-0 mb-4 ${className}`}>
      {(title || headerActions) && (
        <div className="card-header bg-white border-bottom-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
          {title && <h5 className="mb-0 fw-bold">{title}</h5>}
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default Card;