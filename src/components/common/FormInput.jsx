
/**
 * Standard Form Input with built-in error handling and labels
 * @param {Object} props
 * @param {string} props.label
 * @param {string} props.name
 * @param {string} [props.type='text']
 * @param {string|number} props.value
 * @param {function} props.onChange
 * @param {string} [props.error] - Error message to display below input
 * @param {string} [props.placeholder]
 */
const FormInput = ({ label, name, type = 'text', value, onChange, error, placeholder, ...props }) => {
  return (
    <div className="mb-3 text-start">
      {label && <label htmlFor={name} className="form-label fw-semibold">{label}</label>}
      <input
        type={type}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default FormInput;