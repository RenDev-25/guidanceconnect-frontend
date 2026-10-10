
/**
 * Standard Form Input with built-in error handling and labels.
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {string} props.name
 * @param {string} [props.type='text']
 * @param {string|number} props.value
 * @param {function} props.onChange
 * @param {string} [props.error]
 * @param {string} [props.helpText]
 * @param {string} [props.placeholder]
 */

const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  helpText,
  placeholder,
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
        type={type}
        id={name}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-control ${error ? 'is-invalid' : ''}`}
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

export default FormInput;
