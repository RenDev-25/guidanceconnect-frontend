import React, { useState } from 'react';

const ReferralManagement = () => {
  const [referrals, setReferrals] = useState([
    { id: 'REF-001', studentName: 'John Smith', referredTo: 'Psychiatric Services (External)', date: '2026-09-28', status: 'Pending Review' },
    { id: 'REF-002', studentName: 'Jane Doe', referredTo: 'University Clinic', date: '2026-09-30', status: 'In Progress' }
  ]);
  const [updateModal, setUpdateModal] = useState({ open: false, item: null, newStatus: '' });

  const confirmUpdate = () => {
    setReferrals(prev => prev.map(r => r.id === updateModal.item.id ? { ...r, status: updateModal.newStatus } : r));
    setUpdateModal({ open: false, item: null, newStatus: '' });
  };

  const getBadgeClass = (status) => {
    switch(status) {
      case 'Pending Review': return 'bg-warning text-dark';
      case 'In Progress': return 'bg-info text-white';
      case 'Resolved': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h3 fw-bold text-dark">Referral Pipeline</h1>
        <p className="text-muted small">Track and manage student referrals to external specialists or internal offices.</p>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Referral ID</th>
                  <th>Student Name</th>
                  <th>Referred To</th>
                  <th>Date Initiated</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((item) => (
                  <tr key={item.id}>
                    <td><span className="fw-medium">{item.id}</span></td>
                    <td>{item.studentName}</td>
                    <td>{item.referredTo}</td>
                    <td>{item.date}</td>
                    <td><span className={`badge ${getBadgeClass(item.status)}`}>{item.status}</span></td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setUpdateModal({ open: true, item, newStatus: 'Resolved' })}
                        disabled={item.status === 'Resolved'}
                      >
                        Mark Resolved
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {updateModal.open && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Update Referral Status</h5>
                <button type="button" className="btn-close" onClick={() => setUpdateModal({ open: false, item: null, newStatus: '' })}></button>
              </div>
              <div className="modal-body">
                <p>Change status of referral <strong>{updateModal.item?.id}</strong> to <span className="text-success fw-bold">Resolved</span>?</p>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-light" onClick={() => setUpdateModal({ open: false, item: null, newStatus: '' })}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={confirmUpdate}>Confirm Update</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralManagement;