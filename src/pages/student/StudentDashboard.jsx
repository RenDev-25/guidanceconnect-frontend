
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaFolderOpen,
  FaPlus,
  FaArrowRight,
} from 'react-icons/fa';

import { useAuth } from '../../context/AuthContext';
import { useDashboardStats } from '../../hooks/useDashboardStats';

import StatCard from '../../components/common/StatCard';
import DashboardGrid from '../../components/dashboard/DashboardGrid';
import Card from '../../components/common/Card';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';

const formatDate = (value) => {
  if (!value) return 'Date not available';

  // Preserve ISO date-only values as local calendar dates.
  const date = /^\d{4}-\d{2}-\d{2}$/.test(String(value))
    ? new Date(`${value}T12:00:00`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  /*
   * The current demo authentication record has a numeric ID,
   * while the mock student service records use STU-001.
   *
   * Prefer a real studentId when authentication provides one.
   */
  const studentId =
    user?.studentId ||
    (user?.role === 'student' ? 'STU-001' : user?.id);

  const { stats, loading } = useDashboardStats(
    'student',
    studentId
  );

  if (loading || !stats) {
    return (
      <LoadingState message="Loading your student dashboard..." />
    );
  }

  const studentName =
    user?.name?.trim().split(/\s+/)[0] || 'Student';

  const nextAppointment = stats.nextAppointment;

  const recentActivityColumns = [
    {
      key: 'id',
      label: 'Reference ID',
    },
    {
      key: 'serviceType',
      label: 'Service',
    },
    {
      key: 'dateSubmitted',
      label: 'Date Submitted',
      renderCell: (row) => formatDate(row.dateSubmitted),
    },
    {
      key: 'status',
      label: 'Status',
      renderCell: (row) => (
        <StatusBadge status={row.status} />
      ),
    },
  ];

  return (
    <div className="container-fluid py-4">
      {/* Page heading and quick action */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <p className="text-danger fw-semibold small text-uppercase mb-1">
            Student Portal
          </p>

          <h2 className="fw-bold mb-2">
            Welcome back, {studentName}!
          </h2>

          <p className="text-muted mb-0">
            Here is an overview of your requests and appointments.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-danger d-inline-flex align-items-center justify-content-center gap-2"
          onClick={() => navigate('/student/service-request')}
        >
          <FaPlus aria-hidden="true" />
          New Request
        </button>
      </div>

      {/* Student statistics */}
      <DashboardGrid>
        <StatCard
          title="Active Requests"
          value={stats.activeRequests}
          subtitle="Requests still being processed"
          icon={<FaFileAlt size={20} />}
          borderTheme="danger"
        />

        <StatCard
          title="Upcoming Appointments"
          value={stats.upcomingAppointments}
          subtitle="Future scheduled appointments"
          icon={<FaCalendarAlt size={20} />}
          borderTheme="warning"
        />

        <StatCard
          title="Pending Documents"
          value={stats.pendingDocuments}
          subtitle="Documents awaiting action"
          icon={<FaFolderOpen size={20} />}
          borderTheme="primary"
        />

        <StatCard
          title="Completed Services"
          value={stats.completedServices}
          subtitle="Successfully completed requests"
          icon={<FaCheckCircle size={20} />}
          borderTheme="success"
        />
      </DashboardGrid>

      {/* Next appointment highlight */}
      <Card
        title="Next Appointment"
        className="mb-4"
      >
        {nextAppointment ? (
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div className="d-flex align-items-start gap-3">
              <div className="rounded-3 bg-danger-subtle text-danger p-3">
                <FaCalendarAlt size={24} />
              </div>

              <div>
                <h5 className="fw-bold mb-1">
                  {nextAppointment.type || 'Counseling Appointment'}
                </h5>

                <p className="text-muted mb-1">
                  <FaCalendarAlt className="me-2" />
                  {formatDate(nextAppointment.date)}
                </p>

                {nextAppointment.time && (
                  <p className="text-muted mb-1">
                    <FaClock className="me-2" />
                    {nextAppointment.time}
                  </p>
                )}

                {nextAppointment.counselor && (
                  <p className="text-muted small mb-2">
                    Counselor: {nextAppointment.counselor}
                  </p>
                )}

                <StatusBadge status={nextAppointment.status} />
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline-danger align-self-md-center"
              onClick={() => navigate('/student/appointments')}
            >
              View Appointments
              <FaArrowRight className="ms-2" />
            </button>
          </div>
        ) : (
          <EmptyState
            message="You don't have any upcoming appointments."
            icon="bi-calendar-x"
            action={
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => navigate('/student/appointments')}
              >
                View Appointments
              </button>
            }
          />
        )}
      </Card>

      {/* Recent activity */}
      <Card
        title="Recent Activity"
        headerActions={
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => navigate('/student/service-request')}
          >
            View Requests
            <FaArrowRight className="ms-2" />
          </button>
        }
      >
        {(Array.isArray(stats.recentActivity) ? stats.recentActivity  : [] ).length > 0 ? (
          <DataTable
            columns={recentActivityColumns}
            data={
              Array.isArray(stats.recentActivity)
                ? stats.recentActivity
                : []
            }
            keyField="id"
          />
        ) : (
          <EmptyState
            message="You haven't submitted any service requests yet."
            icon="bi-inbox"
            action={
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => navigate('/student/service-request')}
              >
                <FaPlus className="me-2" />
                Create Your First Request
              </button>
            }
          />
        )}
      </Card>
    </div>
  );
};

export default StudentDashboard;
