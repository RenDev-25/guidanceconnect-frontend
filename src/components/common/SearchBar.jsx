

/**
 * Reusable Search Bar with an embedded icon
 * @param {Object} props
 * @param {string} props.value
 * @param {function} props.onChange
 * @param {string} [props.placeholder='Search...']
 */
const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="input-group mb-3 shadow-sm rounded">
      <span className="input-group-text bg-white border-end-0 text-muted">
        <i className="bi bi-search"></i>
      </span>
      <input
        type="text"
        className="form-control border-start-0 ps-0"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;