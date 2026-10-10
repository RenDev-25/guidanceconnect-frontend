
import React from 'react';

/**
 * Styled file upload input with error handling and accessibility.
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {string} props.name
 * @param {function} props.onChange
 * @param {string} [props.accept] - e.g., '.pdf,.jpg,.png'
 * @param {string} [props.error]
 * @param {string} [props.helpText]
 */

const FileUpload = ({
  label,
  name,
  onChange,
  accept,
  error,
  helpText,
  ...props
}) => {
  const helpTextId = `${name}-help`;
  const errorId = `${name}-error`;

  return (
    <div className="mb-3 text-start">
      {label && (
        <label
          htmlFor={name}
          className="form-label fw-semibold"
        >
          {label}
        </label>
      )}

      <input
        className={`form-control ${error ? 'is-invalid' : ''}`}
        type="file"
        id={name}
        name={name}
        accept={accept}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={
          [
            helpText ? helpTextId : null,
            error ? errorId : null,
          ]
            .filter(Boolean)
            .join(' ') || undefined
        }
        {...props}
      />

      {helpText && (
        <div
          id={helpTextId}
          className="form-text text-muted"
        >
          {helpText}
        </div>
      )}

      {error && (
        <div
          id={errorId}
          className="invalid-feedback"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
