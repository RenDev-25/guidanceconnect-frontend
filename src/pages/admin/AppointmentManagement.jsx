import React, { useState } from 'react';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([
    { id: 'APT-101', studentName: 'Renzy', purpose: 'Follow-up', date: '2026-10-02', time: '10:00 AM', counselor: 'Dr. Smith', status: 'Scheduled' },
    { id: 'APT-102', studentName: 'John Smith', purpose: 'Career Guidance', date: '2026-10-02', time: '01:00 PM', counselor: 'Prof. Adams', status: 'Pending' }
  ]);

  const handleCancel = (id) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'studentName', label: 'Student' },
    { key: 'purpose', label: 'Purpose' },
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time' },
    { key: 'counselor', label: 'Counselor' },
    { key: 'status', label: 'Status', render: (item) => <StatusBadge status={item.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (item) => (
        <div className="flex gap-2">
          <Button size="small" variant="secondary">Reschedule</Button>
          <Button size="small" variant="danger" onClick={() => handleCancel(item.id)} disabled={item.status === 'Cancelled'}>Cancel</Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Office Appointments</h1>
        <p className="text-gray-600">Manage all scheduled consultations across the counseling staff.</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <DataTable columns={columns} data={appointments} />
      </div>
    </div>
  );
};

export default AppointmentManagement;