import React, { useState, useEffect } from 'react';
import StatusBadge from '../../components/common/StatusBadge';
import { referralService } from '../../services/referralService';
import { auditLogService } from '../../services/auditLogService';

const ReferralManagement = () => {
  const [referrals, setReferrals] = useState([]);
  const [selectedRef, setSelectedRef] = useState(null);

  const fetchReferrals = () => setReferrals(referralService.getAll() || []);

  useEffect(() => fetchReferrals(), []);

  const handleUpdateStatus = (status) => {
    const user = JSON.parse(localStorage.getItem('user')) || { id: 'USR-ADMIN' };
    referralService.updateStatus(selectedRef.id, status);
    auditLogService.log(user.id, `Updated referral ${selectedRef.id} status to ${status}`);
    fetchReferrals();
    setSelectedRef(null);
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h3 fw-bold text-dark">Referral Pipeline</h1>
        <p className="text-muted small mb-0">Track student referrals to external specialists or internal offices.</p>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Student Name</th>
                  <th>Referred To</th>
                  <th>Reason</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map(r => (
                  <tr key={r.id}>
                    <td className="fw-semibold">{r.id}</td>
                    <td>{r.studentName}</td>
                    <td>{r.referredTo}</td>
                    <td className="text-truncate" style={{ maxWidth: '200px' }}>{r.reason}</td>
                    <td>{r.date}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedRef(r)}>Update</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedRef && (
        <div className="modal show d-block fade" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Update Referral Status</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedRef(null)}></button>
              </div>
              <div className="modal-body">
                <p>Tracking referral for <strong>{selectedRef.studentName}</strong> to <strong>{selectedRef.referredTo}</strong>.</p>
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-warning" onClick={() => handleUpdateStatus('In Progress')}>Mark as In Progress</button>
                  <button className="btn btn-outline-success" onClick={() => handleUpdateStatus('Resolved')}>Mark as Resolved</button>
                  <button className="btn btn-outline-secondary" onClick={() => handleUpdateStatus('Cancelled')}>Cancel Referral</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralManagement;