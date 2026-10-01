import React, { useState } from 'react';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const RequestManagement = () => {
  const [requests, setRequests] = useState([
    { id: 'REQ-001', studentName: 'Renzy', type: 'Counseling', submitted: '2026-10-01', status: 'Pending' },
    { id: 'REQ-002', studentName: 'Jane Doe', type: 'Exit Interview', submitted: '2026-09-28', status: 'In Progress' }
  ]);
  const [actionModal, setActionModal] = useState({ open: false, targetReq: null, targetStatus: '' });

  const handleOverride = (req, status) => {
    setActionModal({ open: true, targetReq: req, targetStatus: status });
  };

  const confirmOverride = () => {
    setRequests(prev => prev.map(r => r.id === actionModal.targetReq.id ? { ...r, status: actionModal.targetStatus } : r));
    setActionModal({ open: false, targetReq: null, targetStatus: '' });
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'studentName', label: 'Student Name' },
    { key: 'type', label: 'Service Type' },
    { key: 'submitted', label: 'Submitted' },
    { key: 'status', label: 'Status', render: (item) => <StatusBadge status={item.status} /> },
    {
      key: 'actions',
      label: 'Admin Actions',
      render: (item) => (
        <div className="flex gap-2">
          <Button size="small" variant="secondary" onClick={() => handleOverride(item, 'In Progress')}>Force Process</Button>
          <Button size="small" variant="danger" onClick={() => handleOverride(item, 'Escalated')}>Escalate</Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Global Request Management</h1>
        <p className="text-gray-600">Oversight and escalation controls for all office service requests.</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <DataTable columns={columns} data={requests} />
      </div>
      {actionModal.open && (
        <ConfirmDialog
          title="Confirm Status Override"
          message={`Are you sure you want to change the status of ${actionModal.targetReq?.id} to "${actionModal.targetStatus}"?`}
          onConfirm={confirmOverride}
          onCancel={() => setActionModal({ open: false, targetReq: null, targetStatus: '' })}
        />
      )}
    </div>
  );
};

export default RequestManagement;