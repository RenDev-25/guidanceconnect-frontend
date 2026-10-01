import React, { useState } from 'react';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';

const CounselingManagement = () => {
  const [cases] = useState([
    { id: 'CS-2026-11', studentName: 'Renzy', counselor: 'Dr. Smith', lastSession: '2026-09-20', status: 'Active' },
    { id: 'CS-2026-14', studentName: 'Jane Doe', counselor: 'Prof. Adams', lastSession: '2026-08-15', status: 'Closed' }
  ]);

  const columns = [
    { key: 'id', label: 'Case ID' },
    { key: 'studentName', label: 'Student' },
    { key: 'counselor', label: 'Counselor' },
    { key: 'lastSession', label: 'Last Log Entry' },
    { key: 'status', label: 'Status', render: (item) => <StatusBadge status={item.status} /> },
    {
      key: 'actions',
      label: 'Case Records',
      render: (item) => (
        <Button size="small" variant="secondary" onClick={() => alert(`Opening factual log viewer for ${item.id}. No diagnostic tools loaded.`)}>
          View Session Logs
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Counseling Case Records</h1>
        <p className="text-gray-600">Strictly factual tracking of session logs, attendance, and administrative case notes.</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <DataTable columns={columns} data={cases} />
      </div>
    </div>
  );
};

export default CounselingManagement;