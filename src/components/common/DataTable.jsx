import React, { useState } from 'react';
import EmptyState from './EmptyState';

/**
 * Reusable Data Table with sorting
 * @param {Object} props
 * @param {Array} props.columns - [{ key: 'id', label: 'ID', sortable: true, renderCell: (row) => JSX }]
 * @param {Array} props.data - Array of data objects
 * @param {string} [props.keyField='id'] - Unique key for rows
 */
const DataTable = ({ columns, data, keyField = 'id' }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  if (!data || data.length === 0) {
    return <EmptyState message="No records found to display in this table." />;
  }

  const handleSort = (key) => {
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
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            {columns.map((col) => (
              <th 
                key={col.key} 
                onClick={() => col.sortable && handleSort(col.key)}
                style={{ cursor: col.sortable ? 'pointer' : 'default' }}
              >
                {col.label}
                {col.sortable && sortConfig.key === col.key && (
                  <i className={`bi bi-chevron-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1 small`}></i>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr key={row[keyField]}>
              {columns.map((col) => (
                <td key={`${row[keyField]}-${col.key}`}>
                  {col.renderCell ? col.renderCell(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;