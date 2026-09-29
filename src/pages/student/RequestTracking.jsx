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
    setTimeout(() => {
      setRequests(requestService.getByStudent(CURRENT_STUDENT_ID) || []);
      setLoading(false);
    }, 400);
  }, []);

  const filters = ['All', 'Pending', 'In Progress', 'Completed', 'Rejected'];

  const filteredRequests = requests.filter(req => {
    if (activeFilter === 'All') return true;
    return req.status === activeFilter;
  });

  const columns = [
    { key: 'id', label: 'Tracking ID', sortable: true },
    { key: 'serviceType', label: 'Service', sortable: true },
    { key: 'dateSubmitted', label: 'Date Submitted', sortable: true },
    { key: 'status', label: 'Current Status', renderCell: (row) => <StatusBadge status={row.status} /> },
    { 
      key: 'actions', 
      label: 'Actions', 
      renderCell: (row) => (
        <button className="btn btn-sm btn-outline-primary">View Details</button>
      ) 
    }
  ];

  return (
    <div className="container-fluid py-4">
      <h3 className="fw-bold mb-4">Request Tracking</h3>
      <Card>
        <FilterBar 
          filters={filters} 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />
        {loading ? (
          <LoadingState />
        ) : (
          <DataTable columns={columns} data={filteredRequests} />
        )}
      </Card>
    </div>
  );
};

export default RequestTracking;