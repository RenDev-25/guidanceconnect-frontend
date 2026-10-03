
import React from 'react';

const FilterBar = ({
  filters = [],
  activeFilter = '',
  onFilterChange = () => {},
  onSearch,
  searchPlaceholder = 'Search...',
}) => {
  const safeFilters = Array.isArray(filters) ? filters : [];

  return (
    <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
      {typeof onSearch === 'function' && (
        <input
          type="text"
          className="form-control"
          placeholder={searchPlaceholder}
          onChange={(event) => onSearch(event.target.value)}
          style={{ maxWidth: '300px' }}
        />
      )}

      {safeFilters.map((filter, index) => {
        const label =
          typeof filter === 'string' ? filter : filter.label;

        const value =
          typeof filter === 'string' ? filter : filter.value;

        return (
          <button
            type="button"
            key={`${label}-${index}`}
            className={`btn btn-sm rounded-pill px-3 ${
              activeFilter === value
                ? 'btn-primary'
                : 'btn-outline-secondary'
            }`}
            onClick={() => onFilterChange(value)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;
