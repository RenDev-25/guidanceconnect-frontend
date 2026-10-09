
import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import FilterBar from '../../components/common/FilterBar';
import LoadingState from '../../components/common/LoadingState';
import { requestService } from '../../services/requestService';

const CURRENT_STUDENT_ID = 'STU-001';

const RequestTracking = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const timer = setTimeout(() => {
      setRequests(
        requestService.getByStudent(CURRENT_STUDENT_ID) || []
      );
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const filters = [
    'All',
    'Pending',
    'In Progress',
    'Completed',
    'Rejected',
  ];

  const filteredRequests = requests.filter((request) => {
    if (activeFilter === 'All') return true;
    return request.status === activeFilter;
  });

  const columns = [
    { key: 'id', label: 'Tracking ID', sortable: true },
    { key: 'serviceType', label: 'Service', sortable: true },
    { key: 'dateSubmitted', label: 'Date Submitted', sortable: true },
    {
      key: 'status',
      label: 'Current Status',
      renderCell: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      renderCell: () => (
        <button
          type="button"
          className="btn btn-sm btn-outline-primary responsive-row-action"
        >
          View Details
        </button>
      ),
    },
  ];

  return (
    <div className="container-fluid py-3 py-md-4 responsive-list-page">
      <div className="responsive-page-heading">
        <div>
          <h3 className="fw-bold mb-1">Request Tracking</h3>
          <p className="text-muted mb-0">
            Track the status of your submitted service requests.
          </p>
        </div>
      </div>

      <Card className="responsive-list-card">
        <div className="responsive-filter-bar">
          <FilterBar
            filters={filters}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        {!loading && (
          <p className="small text-muted mb-3" aria-live="polite">
            {filteredRequests.length}{' '}
            {filteredRequests.length === 1 ? 'request' : 'requests'} found
          </p>
        )}

        {loading ? (
          <LoadingState />
        ) : (
          <DataTable
            columns={columns}
            data={filteredRequests}
          />
        )}
      </Card>
    </div>
  );
};

export default RequestTracking;
