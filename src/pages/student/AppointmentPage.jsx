import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingState from '../../components/common/LoadingState';
import { appointmentService } from '../../services/appointmentService';

const CURRENT_STUDENT_ID = 'STU-001';

const AppointmentPage = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setAppointments(appointmentService.getByStudent(CURRENT_STUDENT_ID) || []);
      setLoading(false);
    }, 400);
  }, []);

  const handleOpenCancel = (appt) => {
    setSelectedAppt(appt);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (selectedAppt) {
      appointmentService.updateStatus(selectedAppt.id, 'Cancelled');
      // Refresh list
      setAppointments(appointmentService.getByStudent(CURRENT_STUDENT_ID) || []);
    }
    setCancelModalOpen(false);
    setSelectedAppt(null);
  };

  const columns = [
    { key: 'id', label: 'Appt ID', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'time', label: 'Time' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status', renderCell: (row) => <StatusBadge status={row.status} /> },
    { 
      key: 'actions', 
      label: 'Actions', 
      renderCell: (row) => (
        row.status === 'Scheduled' ? (
          <Button variant="outline-danger" size="sm" onClick={() => handleOpenCancel(row)}>
            Cancel
          </Button>
        ) : (
          <span className="text-muted small">No actions</span>
        )
      ) 
    }
  ];

  return (
    <div className="container-fluid py-4">
      <h3 className="fw-bold mb-4">My Appointments</h3>
      
      <Card>
        {loading ? (
          <LoadingState message="Loading appointments..." />
        ) : (
          <DataTable columns={columns} data={appointments} />
        )}
      </Card>

      <ConfirmDialog 
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Appointment"
        message={`Are you sure you want to cancel your appointment on ${selectedAppt?.date} at ${selectedAppt?.time}? This action cannot be undone.`}
        confirmText="Yes, Cancel it"
        confirmVariant="danger"
      />
    </div>
  );
};

export default AppointmentPage;