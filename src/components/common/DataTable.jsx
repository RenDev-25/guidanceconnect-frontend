
import React, { useState } from 'react';
import EmptyState from './EmptyState';

/**
 * Reusable responsive data table with sorting.
 *
 * @param {Object} props
 * @param {Array} props.columns - Column definitions:
 *   { key, label, sortable, renderCell }
 * @param {Array} props.data - Array of data objects
 * @param {string} [props.keyField='id'] - Unique key for rows
 */
const DataTable = ({ columns = [], data = [], keyField = 'id' }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc',
  });

  if (!data || data.length === 0) {
    return (
      <EmptyState message="No records found to display in this table." />
    );
  }

  const handleSort = (key) => {
    if (!key) return;

    let direction = 'asc';

    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    // Keep empty values at the end of the table.
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    // Compare numbers numerically and other values as text.
    let comparison = 0;

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else {
      comparison = String(aValue).localeCompare(String(bValue), undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    }

    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

  return (
    <div
      className="table-responsive data-table-wrapper"
      role="region"
      aria-label="Scrollable data table"
      tabIndex={0}
    >
      <table className="table table-hover table-striped align-middle data-table mb-0">
        <thead className="table-light">
          <tr>
            {columns.map((col) => {
              const isSorted = sortConfig.key === col.key;

              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={
                    col.sortable
                      ? isSorted
                        ? sortConfig.direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                      : undefined
                  }
                  className={col.sortable ? 'data-table-sortable' : ''}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      className="data-table-sort-button"
                      onClick={() => handleSort(col.key)}
                      aria-label={`Sort by ${col.label}${
                        isSorted
                          ? sortConfig.direction === 'asc'
                            ? ', currently ascending'
                            : ', currently descending'
                          : ''
                      }`}
                    >
                      <span>{col.label}</span>

                      <span className="data-table-sort-icon" aria-hidden="true">
                        {isSorted ? (
                          <i
                            className={`bi bi-chevron-${
                              sortConfig.direction === 'asc' ? 'up' : 'down'
                            }`}
                          />
                        ) : (
                          <i className="bi bi-arrow-down-up" />
                        )}
                      </span>
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {sortedData.map((row, rowIndex) => {
            const rowKey = row[keyField] ?? rowIndex;

            return (
              <tr key={rowKey}>
                {columns.map((col) => (
                  <td key={`${rowKey}-${col.key}`}>
                    {typeof col.renderCell === 'function'
                      ? col.renderCell(row)
                      : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
