import React, { useState, useEffect } from 'react';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingState from '../../components/common/LoadingState';
import { requestService } from '../../services/requestService';
import { appointmentService } from '../../services/appointmentService';

// Temporary mock user ID until Auth is implemented
const CURRENT_STUDENT_ID = 'STU-001'; 

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Simulate API fetch delay
    setTimeout(() => {
      setRequests(requestService.getByStudent(CURRENT_STUDENT_ID) || []);
      setAppointments(appointmentService.getByStudent(CURRENT_STUDENT_ID) || []);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <LoadingState message="Loading dashboard..." />;

  const activeRequests = requests.filter(r => r.status !== 'Completed' && r.status !== 'Rejected').length;
  const upcomingAppointments = appointments.filter(a => a.status === 'Scheduled').length;
  const completedServices = requests.filter(r => r.status === 'Completed').length;

  const recentActivityColumns = [
    { key: 'id', label: 'ID' },
    { key: 'serviceType', label: 'Service Type' },
    { key: 'dateSubmitted', label: 'Date' },
    { key: 'status', label: 'Status', renderCell: (row) => <StatusBadge status={row.status} /> }
  ];

  return (
    <div className="container-fluid py-4">
      <h3 className="fw-bold mb-4">Welcome back, Student!</h3>
      
      <div className="row mb-4">
        <div className="col-md-3">
          <StatCard label="Active Requests" value={activeRequests} icon="bi-file-earmark-text" color="primary" />
        </div>
        <div className="col-md-3">
          <StatCard label="Upcoming Appointments" value={upcomingAppointments} icon="bi-calendar-event" color="warning" />
        </div>
        <div className="col-md-3">
          <StatCard label="Pending Documents" value="0" icon="bi-folder-x" color="danger" />
        </div>
        <div className="col-md-3">
          <StatCard label="Completed Services" value={completedServices} icon="bi-check-circle" color="success" />
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <Card title="Recent Activity">
            <DataTable
              columns={recentActivityColumns} 
              data={requests.slice(0, 5)} // Show only top 5 recent
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;