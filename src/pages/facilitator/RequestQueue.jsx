import React, { useState, useEffect } from 'react';
import StatusBadge from '../../components/common/StatusBadge';
import { requestService } from '../../services/requestService';

const RequestQueue = () => {
  const [requests, setRequests] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const fetchRequests = () => {
    setRequests(requestService.getAll() || []);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    requestService.updateStatus(id, newStatus);
    fetchRequests();
    setSelected(null);
  };

  const filteredRequests = requests.filter(
    (r) => activeFilter === 'All' || r.status === activeFilter
  );

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark">Request Processing Queue</h1>
          <p className="text-muted small">Review and update student document and guidance service requests.</p>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          {/* Filters */}
          <div className="d-flex flex-wrap gap-2 mb-4">
            {['All', 'Pending', 'Processing', 'Completed', 'Rejected'].map((filter) => (
              <button
                key={filter}
                className={`btn btn-sm ${activeFilter === filter ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Tracking ID</th>
                  <th>Student</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((row) => (
                    <tr key={row.id}>
                      <td className="fw-semibold">{row.id}</td>
                      <td>{row.studentName || row.studentId}</td>
                      <td>{row.serviceType || row.type}</td>
                      <td><StatusBadge status={row.status} /></td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelected(row)}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">No requests found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {selected && (
        <div className="modal show d-block fade" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Request Review: {selected.id}</h5>
                <button type="button" className="btn-close" onClick={() => setSelected(null)}></button>
              </div>
              <div className="modal-body">
                <p className="mb-2"><strong>Student:</strong> {selected.studentName || selected.studentId}</p>
                <p className="mb-2"><strong>Service:</strong> {selected.serviceType || selected.type}</p>
                <p className="mb-2"><strong>Date Submitted:</strong> {selected.dateSubmitted || selected.date}</p>
                <p className="mb-0"><strong>Current Status:</strong> <StatusBadge status={selected.status} /></p>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => setSelected(null)}
                >
                  Close
                </button>
                <button 
                  className="btn btn-warning btn-sm text-dark" 
                  onClick={() => handleStatusChange(selected.id, 'Processing')}
                >
                  Mark Processing
                </button>
                <button 
                  className="btn btn-danger btn-sm" 
                  onClick={() => handleStatusChange(selected.id, 'Rejected')}
                >
                  Reject
                </button>
                <button 
                  className="btn btn-success btn-sm" 
                  onClick={() => handleStatusChange(selected.id, 'Completed')}
                >
                  Approve / Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestQueue;