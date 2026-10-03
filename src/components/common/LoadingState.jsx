import React from 'react';

const LoadingState = ({ message = "Loading dashboard data..." }) => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-5 min-vh-50">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted small">{message}</p>
    </div>
  );
};

export default LoadingState;