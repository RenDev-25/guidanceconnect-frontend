
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
    const timer = setTimeout(() => {
      setAppointments(
        appointmentService.getByStudent(CURRENT_STUDENT_ID) || []
      );
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenCancel = (appointment) => {
    setSelectedAppt(appointment);
    setCancelModalOpen(true);
  };

  const handleCloseCancel = () => {
    setCancelModalOpen(false);
    setSelectedAppt(null);
  };

  const handleConfirmCancel = () => {
    if (selectedAppt) {
      appointmentService.updateStatus(selectedAppt.id, 'Cancelled');

      setAppointments(
        appointmentService.getByStudent(CURRENT_STUDENT_ID) || []
      );
    }

    handleCloseCancel();
  };

  const columns = [
    { key: 'id', label: 'Appointment ID', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'time', label: 'Time' },
    { key: 'type', label: 'Type' },
    {
      key: 'status',
      label: 'Status',
      renderCell: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      renderCell: (row) =>
        row.status === 'Scheduled' ? (
          <Button
            variant="outline-danger"
            size="sm"
            className="responsive-row-action"
            onClick={() => handleOpenCancel(row)}
          >
            Cancel
          </Button>
        ) : (
          <span className="text-muted small">No actions</span>
        ),
    },
  ];

  return (
    <div className="container-fluid py-3 py-md-4 responsive-list-page">
      <div className="responsive-page-heading">
        <div>
          <h3 className="fw-bold mb-1">My Appointments</h3>
          <p className="text-muted mb-0">
            View your appointments and manage scheduled sessions.
          </p>
        </div>
      </div>

      <Card className="responsive-list-card">
        {loading ? (
          <LoadingState message="Loading appointments..." />
        ) : (
          <DataTable
            columns={columns}
            data={appointments}
          />
        )}
      </Card>

      <ConfirmDialog
        isOpen={cancelModalOpen}
        onClose={handleCloseCancel}
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
