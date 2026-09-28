

/**
 * Horizontal row of filter pills/buttons
 * @param {Object} props
 * @param {Array} props.filters - Array of string categories e.g., ['All', 'Pending', 'Completed']
 * @param {string} props.activeFilter - The currently selected filter
 * @param {function} props.onFilterChange - (filterName) => void
 */
const FilterBar = ({ filters, activeFilter, onFilterChange }) => {
  return (
    <div className="d-flex flex-wrap gap-2 mb-3">
      {filters.map((filter, index) => (
        <button
            type="button"
            key={index}
            className={`btn btn-sm rounded-pill px-3 ${
                activeFilter === filter
                ? 'btn-primary'
                : 'btn-outline-secondary'
            }`}
            onClick={() => onFilterChange(filter)}
            >
        </button>
      ))}
    </div>
  );
};

export default FilterBar;