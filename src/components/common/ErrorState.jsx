import React from 'react';

/**
 * Fallback UI for failed data fetches or crashes
 * @param {Object} props
 * @param {string} props.message
 */
const ErrorState = ({ message = "An error occurred while loading data." }) => {
  return (
    <div className="alert alert-danger d-flex align-items-center" role="alert">
      <i className="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
      <div>
        <strong>Error: </strong> {message}
      </div>
    </div>
  );
};

export default ErrorState;