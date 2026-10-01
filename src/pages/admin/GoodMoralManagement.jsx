import React, { useState } from 'react';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const GoodMoralManagement = () => {
  const [requests, setRequests] = useState([
    { id: 'GM-001', studentName: 'Renzy', purpose: 'Board Exam', submitted: '2026-10-01', status: 'Pending Clearance' },
    { id: 'GM-002', studentName: 'Jane Doe', purpose: 'Transfer', submitted: '2026-09-30', status: 'Ready for Release' }
  ]);
  const [modal, setModal] = useState({ open: false, item: null, action: '' });
  const [reason, setReason] = useState('');

  const confirmAction = () => {
    const newStatus = modal.action === 'Approve' ? 'Ready for Release' : 'Rejected';
    setRequests(prev => prev.map(r => r.id === modal.item.id ? { ...r, status: newStatus, reason } : r));
    setModal({ open: false, item: null, action: '' });
    setReason('');
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'studentName', label: 'Student' },
    { key: 'purpose', label: 'Purpose' },
    { key: 'submitted', label: 'Submitted' },
    { key: 'status', label: 'Status', render: (item) => <StatusBadge status={item.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (item) => (
        <div className="flex gap-2">
          <Button size="small" variant="primary" onClick={() => setModal({ open: true, item, action: 'Approve' })} disabled={item.status !== 'Pending Clearance'}>
            Approve
          </Button>
          <Button size="small" variant="danger" onClick={() => setModal({ open: true, item, action: 'Reject' })} disabled={item.status === 'Rejected'}>
            Deny
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Good Moral Certificates</h1>
          <p className="text-gray-600">Review and approve certificate issuance requests.</p>
        </div>
        <Button variant="secondary">Batch Export CSV</Button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <DataTable columns={columns} data={requests} />
      </div>

      {modal.open && (
        <ConfirmDialog
          title={`Confirm ${modal.action}`}
          message={`Are you sure you want to ${modal.action.toLowerCase()} request ${modal.item?.id}?`}
          onConfirm={confirmAction}
          onCancel={() => setModal({ open: false, item: null, action: '' })}
        >
          {modal.action === 'Reject' && (
            <textarea
              className="mt-4 w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="State the factual reason for denial (required)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          )}
        </ConfirmDialog>
      )}
    </div>
  );
};

export default GoodMoralManagement;