import React from 'react';

/**
 * Reusable Button component
 * @param {Object} props
 * @param {'primary'|'secondary'|'success'|'danger'|'warning'|'dark'|'outline-primary'} [props.variant='primary']
 * @param {'sm'|'lg'} [props.size]
 * @param {boolean} [props.isLoading]
 * @param {string} [props.className]
 */
const Button = ({ variant = 'primary', size, isLoading, className = '', children, disabled, ...props }) => {
  const sizeClass = size ? `btn-${size}` : '';
  return (
    <button
        type="button"
        className={`btn btn-${variant} ${sizeClass} ${className}`}
        disabled={isLoading || disabled}
        {...props}
        >
      {isLoading ? (
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;