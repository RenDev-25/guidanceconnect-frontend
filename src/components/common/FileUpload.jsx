;

/**
 * Styled file upload input wrapper
 * @param {Object} props
 * @param {string} props.label
 * @param {string} props.name
 * @param {function} props.onChange
 * @param {string} [props.accept] - e.g., '.pdf,.jpg,.png'
 * @param {string} [props.error]
 * @param {string} [props.helpText] - Note displayed below the input
 */
const FileUpload = ({ label, name, onChange, accept, error, helpText }) => {
  return (
    <div className="mb-3 text-start">
      {label && <label htmlFor={name} className="form-label fw-semibold">{label}</label>}
      <input 
        className={`form-control ${error ? 'is-invalid' : ''}`} 
        type="file" 
        id={name} 
        name={name}
        accept={accept}
        onChange={onChange} 
      />
      {helpText && !error && <div className="form-text">{helpText}</div>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default FileUpload;