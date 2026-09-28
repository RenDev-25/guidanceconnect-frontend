import React from 'react';

/**
 * Reusable Dropdown Select
 * @param {Object} props
 * @param {string} props.label
 * @param {string} props.name
 * @param {string|number} props.value
 * @param {Array} props.options - [{ value: '1', label: 'Option 1' }]
 * @param {function} props.onChange
 * @param {string} [props.error]
 */
const SelectInput = ({ label, name, value, options, onChange, error, ...props }) => {
  return (
    <div className="mb-3 text-start">
      {label && <label htmlFor={name} className="form-label fw-semibold">{label}</label>}
      <select
        className={`form-select ${error ? 'is-invalid' : ''}`}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        {...props}
      >
        <option value="" disabled>Select an option...</option>
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default SelectInput;