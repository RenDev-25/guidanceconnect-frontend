import React from 'react';

/**
 * Fallback UI for empty lists/tables
 * @param {Object} props
 * @param {string} props.message
 * @param {string} [props.icon='bi-inbox']
 * @param {React.ReactNode} [props.action] - Optional button to create new item
 */
const EmptyState = ({ message = "No data found.", icon = "bi-inbox", action }) => {
  return (
    <div className="text-center py-5 text-muted">
      <i className={`bi ${icon} display-4 mb-3 d-block text-secondary`}></i>
      <p className="lead">{message}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
};

export default EmptyState;