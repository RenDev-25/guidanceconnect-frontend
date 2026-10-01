import React, { useState, useEffect } from 'react';
import StatusBadge from '../../components/common/StatusBadge';
import { goodMoralService } from '../../services/goodMoralService';
import { auditLogService } from '../../services/auditLogService';

const GoodMoralManagement = () => {
  const [requests, setRequests] = useState([]);
  const [selectedReq, setSelectedReq] = useState(null);
  const [denyReason, setDenyReason] = useState('');

  const fetchRequests = () => setRequests(goodMoralService.getAll() || []);

  useEffect(() => fetchRequests(), []);

  const handleExport = () => {
    const user = JSON.parse(localStorage.getItem('user')) || { id: 'USR-ADMIN' };
    auditLogService.log(user.id, `Batch exported Good Moral Requests list`);
    alert("Batch export initiated. Downloading CSV...");
  };

  const handleAction = (status) => {
    const user = JSON.parse(localStorage.getItem('user')) || { id: 'USR-ADMIN' };
    
    if (status === 'Rejected' && !denyReason) {
      alert("Please provide a reason for denial.");
      return;
    }

    goodMoralService.updateStatus(selectedReq.id, status);
    const actionDesc = status === 'Completed' ? 'Approved' : `Denied (Reason: ${denyReason})`;
    auditLogService.log(user.id, `${actionDesc} Good Moral request ${selectedReq.id}`);

    setDenyReason('');
    setSelectedReq(null);
    fetchRequests();
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark">Good Moral Issuance</h1>
          <p className="text-muted small mb-0">Approve, deny, and batch export clearance certificates.</p>
        </div>
        <button className="btn btn-outline-success btn-sm" onClick={handleExport}>
          📥 Export List
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Student Name</th>
                  <th>Date Requested</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id}>
                    <td className="fw-semibold">{req.id}</td>
                    <td>{req.studentName}</td>
                    <td>{req.dateRequested || req.date}</td>
                    <td><StatusBadge status={req.status} /></td>
                    <td>
                      {req.status === 'Pending' ? (
                        <button className="btn btn-sm btn-primary" onClick={() => setSelectedReq(req)}>Review</button>
                      ) : (
                        <span className="text-muted small">Processed</span>
                      )}
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
                <h5 className="modal-title fw-bold">Review Application: {selectedReq.id}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedReq(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Student:</strong> {selectedReq.studentName}</p>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Denial Reason (if rejecting):</label>
                  <textarea 
                    className="form-control form-control-sm" 
                    rows="2" 
                    placeholder="Enter reason for academic or disciplinary hold..."
                    value={denyReason}
                    onChange={(e) => setDenyReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger btn-sm" onClick={() => handleAction('Rejected')}>Deny Request</button>
                <button className="btn btn-success btn-sm" onClick={() => handleAction('Completed')}>Approve for Release</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoodMoralManagement;