import React, { useState, useEffect } from 'react';
import StatusBadge from '../../components/common/StatusBadge';
import { requestService } from '../../services/requestService';
import { auditLogService } from '../../services/auditLogService';

const RequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selectedReq, setSelectedReq] = useState(null);

  const fetchRequests = () => setRequests(requestService.getAll() || []);

  useEffect(() => fetchRequests(), []);

  const handleUpdateStatus = (id, newStatus, isEscalation = false) => {
    const user = JSON.parse(localStorage.getItem('user')) || { id: 'USR-ADMIN' };
    
    // If it's an escalation, we might append an 'Escalated' flag in a real DB
    // Here we just update status and log heavily.
    requestService.updateStatus(id, newStatus);
    
    const logMsg = isEscalation 
      ? `ESCALATED request ${id} to Office Head` 
      : `Updated request ${id} status to ${newStatus}`;
      
    auditLogService.log(user.id, logMsg);

    fetchRequests();
    setSelectedReq(null);
  };

  const filteredRequests = requests.filter(r => filter === 'All' || r.status === filter);

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark">Request Management (Admin)</h1>
          <p className="text-muted small mb-0">Oversight of all service requests with escalation capabilities.</p>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2 mb-4">
            {['All', 'Pending', 'Processing', 'Completed', 'Rejected'].map(status => (
              <button
                key={status}
                className={`btn btn-sm ${filter === status ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Request ID</th>
                  <th>Student Name</th>
                  <th>Service Type</th>
                  <th>Date Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(req => (
                  <tr key={req.id}>
                    <td className="fw-semibold">{req.id}</td>
                    <td>{req.studentName}</td>
                    <td>{req.serviceType}</td>
                    <td>{req.dateSubmitted}</td>
                    <td><StatusBadge status={req.status} /></td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedReq(req)}>
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedReq && (
        <div className="modal show d-block fade" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Request Oversight: {selectedReq.id}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedReq(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Student:</strong> {selectedReq.studentName}</p>
                <p><strong>Service:</strong> {selectedReq.serviceType}</p>
                <p><strong>Status:</strong> <StatusBadge status={selectedReq.status} /></p>
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button 
                  className="btn btn-outline-danger btn-sm" 
                  onClick={() => handleUpdateStatus(selectedReq.id, 'Processing', true)}
                >
                  ⚠️ Escalate to Head
                </button>
                <div>
                  <button className="btn btn-secondary btn-sm me-2" onClick={() => setSelectedReq(null)}>Close</button>
                  <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(selectedReq.id, 'Completed')}>Force Complete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestManagement;