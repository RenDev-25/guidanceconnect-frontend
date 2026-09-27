import React from 'react';

/**
 * Fallback UI while data is fetching
 * @param {Object} props
 * @param {string} [props.message='Loading data...']
 */
const LoadingState = ({ message = "Loading data..." }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingState;