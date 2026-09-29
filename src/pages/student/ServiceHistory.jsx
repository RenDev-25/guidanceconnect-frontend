import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingState from '../../components/common/LoadingState';
import SearchBar from '../../components/common/SearchBar';
import { requestService } from '../../services/requestService';

const CURRENT_STUDENT_ID = 'STU-001';

const ServiceHistory = () => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setTimeout(() => {
      const allRequests = requestService.getByStudent(CURRENT_STUDENT_ID) || [];
      
      const completedRequests = allRequests.filter(req => 
        req.status === 'Completed' || req.status === 'Rejected'
      );
      setHistory(completedRequests);
      setLoading(false);
    }, 400);
  }, []);

  const filteredHistory = history.filter(item => 
    item.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'serviceType', label: 'Service Type', sortable: true },
    { key: 'dateSubmitted', label: 'Date Completed', sortable: true }, 
    { key: 'status', label: 'Final Status', renderCell: (row) => <StatusBadge status={row.status} /> }
  ];

  return (
    <div className="container-fluid py-4">
      <h3 className="fw-bold mb-4">Service History</h3>
      
      <Card>
        <div className="row mb-3">
          <div className="col-md-4">
            <SearchBar 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Search history by ID or Service..." 
            />
          </div>
        </div>
        
        {loading ? (
          <LoadingState message="Loading history..." />
        ) : (
          <DataTable columns={columns} data={filteredHistory} />
        )}
      </Card>
    </div>
  );
};

export default ServiceHistory;