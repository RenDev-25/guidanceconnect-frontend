import React, { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { appointmentService } from '../../services/appointmentService';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '' });

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [targetStatus, setTargetStatus] = useState('');

  const fetchAppointments = () => {
    const allAppts = appointmentService.getAll() || [];
    // Sort by date and time (closest first)
    const sorted = allAppts.sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));
    setAppointments(sorted);
    setFilteredAppointments(sorted);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    let result = appointments;
    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(a => a.studentName?.toLowerCase().includes(term));
    }
    if (filters.status) {
      result = result.filter(a => a.status === filters.status);
    }
    setFilteredAppointments(result);
  }, [filters, appointments]);

  const handleActionClick = (appt, status) => {
    setSelectedAppt(appt);
    setTargetStatus(status);
    setDialogOpen(true);
  };

  const executeStatusChange = () => {
    if (selectedAppt) {
      appointmentService.updateStatus(selectedAppt.id, targetStatus);
      fetchAppointments();
    }
    setDialogOpen(false);
  };

  const columns = [
    { key: 'id', label: 'Appt ID' },
    { key: 'studentName', label: 'Student Name' },
    { key: 'type', label: 'Service Type' },
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time' },
    { 
      key: 'status', 
      label: 'Status',
      render: (item) => <StatusBadge status={item.status} /> 
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item) => {
        // Only show relevant buttons based on current status
        if (item.status === 'Completed' || item.status === 'No-Show' || item.status === 'Cancelled') {
          return <span className="text-gray-400 text-sm">Resolved</span>;
        }

        return (
          <div className="flex space-x-2">
            {item.status === 'Pending' && (
              <Button size="small" variant="primary" onClick={() => handleActionClick(item, 'Confirmed')}>
                Confirm
              </Button>
            )}
            {(item.status === 'Confirmed' || item.status === 'In Progress') && (
              <Button size="small" variant="primary" onClick={() => handleActionClick(item, 'Completed')}>
                Complete
              </Button>
            )}
            <Button 
              size="small" 
              variant="secondary" 
              className="text-red-600 border-red-200"
              onClick={() => handleActionClick(item, 'No-Show')}
            >
              No-Show
            </Button>
          </div>
        );
      }
    }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Completed', label: 'Completed' },
    { value: 'No-Show', label: 'No-Show' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Appointment Management</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
        <FilterBar 
          onSearch={(val) => setFilters(prev => ({ ...prev, search: val }))}
          onFilterChange={(val) => setFilters(prev => ({ ...prev, status: val }))}
          filterOptions={statusOptions}
          searchPlaceholder="Search by Student Name..."
        />
        
        <DataTable columns={columns} data={filteredAppointments} />
      </div>

      <ConfirmDialog 
        isOpen={dialogOpen}
        title={`Confirm ${targetStatus}`}
        message={`Are you sure you want to mark appointment ${selectedAppt?.id} as ${targetStatus}?`}
        onConfirm={executeStatusChange}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
};

export default AppointmentManagement;