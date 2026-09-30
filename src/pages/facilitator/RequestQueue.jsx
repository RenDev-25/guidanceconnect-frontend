import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { requestService } from '../../services/requestService';
import { REQUEST_STATUSES } from '../../constants/statusFlow';

const RequestQueue = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: 'All' });

  useEffect(() => {
    const fetchRequests = () => {
      const allRequests = requestService.getAll() || [];
      // Hide completed/rejected requests from the active queue by default
      const activeQueue = allRequests.filter(
        req => req.status !== REQUEST_STATUSES.COMPLETED && req.status !== REQUEST_STATUSES.REJECTED
      );
      setRequests(activeQueue);
      setFilteredRequests(activeQueue);
    };
    fetchRequests();
  }, []);

  useEffect(() => {
    let result = requests;
    
    if (filters.status !== 'All') {
      result = result.filter(r => r.status === filters.status);
    }
    
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(r => 
        r.studentName?.toLowerCase().includes(query) || 
        r.id.toLowerCase().includes(query) ||
        r.type.toLowerCase().includes(query)
      );
    }
    
    setFilteredRequests(result);
  }, [filters, requests]);

  const columns = [
    { key: 'id', label: 'Request ID' },
    { key: 'studentName', label: 'Student' },
    { key: 'type', label: 'Service Type' },
    { key: 'dateSubmitted', label: 'Date Submitted' },
    { 
      key: 'status', 
      label: 'Status', 
      render: (item) => <StatusBadge status={item.status} /> 
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Request Queue</h1>
          <p className="text-gray-600">Manage and route incoming student requests.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
        {/* Filter Controls */}
        <div className="flex gap-4 mb-4">
          <input 
            type="text" 
            placeholder="Search student, ID, or type..." 
            className="border border-gray-300 rounded-md px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          <select 
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="All">All Active Statuses</option>
            <option value={REQUEST_STATUSES.PENDING}>Pending</option>
            <option value={REQUEST_STATUSES.IN_PROGRESS}>In Progress</option>
            <option value={REQUEST_STATUSES.NEEDS_REVISION}>Needs Revision</option>
          </select>
        </div>

        <DataTable 
          columns={columns} 
          data={filteredRequests} 
          onRowClick={(row) => navigate(`/facilitator/requests/${row.id}`)}
        />
      </div>
    </div>
  );
};

export default RequestQueue;