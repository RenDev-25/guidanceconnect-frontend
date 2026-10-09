import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaClipboardList,
  FaFolderOpen,
  FaCalendarDay,
  FaUsers,
  FaTasks,
  FaArrowRight,
  FaExclamationTriangle,
  FaHistory,
} from 'react-icons/fa';

import StatCard from '../../components/common/StatCard';
import LoadingState from '../../components/common/LoadingState';
import StatusBadge from '../../components/common/StatusBadge';
import Card from '../../components/common/Card';
import DataTable from '../../components/common/DataTable';
import EmptyState from '../../components/common/EmptyState';
import DashboardGrid from '../../components/dashboard/DashboardGrid';

import { useDashboardStats } from '../../hooks/useDashboardStats';
import { requestService } from '../../services/requestService';

const PRIORITY_ORDER = {
  Urgent: 1,
  High: 2,
  Normal: 3,
  Low: 4,
};

const ACTIVE_REQUEST_STATUSES = [
  'Pending',
  'Processing',
  'In Progress',
];

const getRequestDate = (request) =>
  request?.dateSubmitted || request?.createdAt || '';

const sortRequestsByPriority = (requests) => {
  return [...requests].sort((a, b) => {
    const priorityA = PRIORITY_ORDER[a.priority] || 5;
    const priorityB = PRIORITY_ORDER[b.priority] || 5;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return getRequestDate(a).localeCompare(getRequestDate(b));
  });
};

const formatDate = (dateValue) => {
  if (!dateValue) return '—';

  const date = /^\d{4}-\d{2}-\d{2}$/.test(String(dateValue))
    ? new Date(`${dateValue}T12:00:00`)
    : new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const QuickLinkItem = ({ to, title, description, icon: Icon }) => (
  <Link
    to={to}
    className="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-3 px-3 border-0 border-bottom"
  >
    <div className="d-flex align-items-center gap-3">
      {Icon && (
        <div className="p-2 rounded bg-light text-primary d-flex align-items-center justify-content-center">
          <Icon size={16} />
        </div>
      )}
      <div>
        <div className="fw-semibold text-dark mb-0">{title}</div>
        <small className="text-muted">{description}</small>
      </div>
    </div>
    <FaArrowRight className="text-muted small" />
  </Link>
);

const FacilitatorDashboard = () => {
  const navigate = useNavigate();
  const { stats, loading } = useDashboardStats('facilitator');
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const allRequests = requestService.getAll() || [];
    setRequests(allRequests);
  }, []);

  const priorityRequests = useMemo(() => {
    const activeRequests = requests.filter((request) =>
      ACTIVE_REQUEST_STATUSES.includes(request.status)
    );

    return sortRequestsByPriority(activeRequests).slice(0, 5);
  }, [requests]);

  const recentRequests = useMemo(() => {
    return [...requests]
      .sort((a, b) =>
        getRequestDate(b).localeCompare(getRequestDate(a))
      )
      .slice(0, 5);
  }, [requests]);

  if (loading || !stats) {
    return (
      <div className="container-fluid py-4 dashboard-page">
        <LoadingState message="Loading facilitator dashboard..." />
      </div>
    );
  }

  // Priority Queue Table Columns
  const priorityQueueColumns = [
    {
      key: 'id',
      label: 'Request ID',
      renderCell: (row) => <span className="fw-semibold">{row.id}</span>,
    },
    {
      key: 'student',
      label: 'Student',
      renderCell: (row) =>
        row.studentName || row.studentId || 'Unknown Student',
    },
    {
      key: 'serviceType',
      label: 'Service',
      renderCell: (row) => row.serviceType || row.type || 'Service Request',
    },
    {
      key: 'priority',
      label: 'Priority',
      renderCell: (row) => (
        <span
          className={`badge ${
            row.priority === 'Urgent'
              ? 'bg-danger'
              : row.priority === 'High'
                ? 'bg-warning text-dark'
                : 'bg-secondary'
          }`}
        >
          {row.priority || 'Normal'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      renderCell: (row) => <StatusBadge status={row.status} />,
    },
  ];

  // Recent Requests Table Columns
  const recentRequestsColumns = [
    {
      key: 'id',
      label: 'Request ID',
      renderCell: (row) => <span className="fw-semibold">{row.id}</span>,
    },
    {
      key: 'student',
      label: 'Student',
      renderCell: (row) =>
        row.studentName || row.studentId || 'Unknown Student',
    },
    {
      key: 'serviceType',
      label: 'Service Type',
      renderCell: (row) => row.serviceType || row.type || 'Service Request',
    },
    {
      key: 'dateSubmitted',
      label: 'Date Submitted',
      renderCell: (row) => formatDate(getRequestDate(row)),
    },
    {
      key: 'status',
      label: 'Status',
      renderCell: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="container-fluid py-4 dashboard-page">
      {/* Header and Quick Action */}
      <div className="dashboard-page-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <p className="text-danger fw-semibold small text-uppercase mb-1">
            Facilitator Portal
          </p>
          <h2 className="fw-bold mb-1">Facilitator Dashboard</h2>
          <p className="text-muted mb-0">
            Monitor service requests, document verifications, appointments, and walk-in queues.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-danger dashboard-primary-action d-inline-flex align-items-center justify-content-center gap-2"
          onClick={() => navigate('/facilitator/requests')}
        >
          <FaClipboardList aria-hidden="true" />
          Open Request Queue
        </button>
      </div>

      {/* Summary Stat Cards */}
      <DashboardGrid>
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests ?? 0}
          subtitle="Requests awaiting initial review"
          icon={<FaClipboardList size={20} />}
          borderTheme="primary"
        />

        <StatCard
          title="Documents for Verification"
          value={stats.documentsForVerification ?? 0}
          subtitle="Documents awaiting checking"
          icon={<FaFolderOpen size={20} />}
          borderTheme="warning"
        />

        <StatCard
          title="Today's Appointments"
          value={stats.todaysAppointments ?? stats.todayAppointments ?? 0}
          subtitle="Appointments scheduled today"
          icon={<FaCalendarDay size={20} />}
          borderTheme="info"
        />

        <StatCard
          title="Walk-In Queue"
          value={stats.walkInQueueCount ?? stats.walkInsWaiting ?? 0}
          subtitle="Students waiting to be assisted"
          icon={<FaUsers size={20} />}
          borderTheme="danger"
        />

        <StatCard
          title="Tasks Remaining"
          value={stats.tasksRemaining ?? 0}
          subtitle="Active tasks in progress"
          icon={<FaTasks size={20} />}
          borderTheme="success"
        />
      </DashboardGrid>

      {/* Secondary Content: Priority Queue & Quick Links */}
      <div className="row g-4 mb-4">
        {/* Priority Queue Preview (Top 5) */}
        <div className="col-12 col-lg-7 col-xl-8">
          <Card
            title="Priority Queue Preview"
            className="h-100"
            headerActions={
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => navigate('/facilitator/requests')}
              >
                Open Queue
                <FaArrowRight className="ms-2" />
              </button>
            }
          >
            <p className="text-muted small mb-3">
              <FaExclamationTriangle className="text-warning me-1" />
              Active requests sorted by priority (Urgent first), then submission date.
            </p>

            {priorityRequests.length === 0 ? (
              <EmptyState
                message="There are no active requests in the priority queue."
                icon="bi-check-circle"
              />
            ) : (
              <DataTable
                columns={priorityQueueColumns}
                data={priorityRequests}
                keyField="id"
              />
            )}
          </Card>
        </div>

        {/* Quick Links */}
        <div className="col-12 col-lg-5 col-xl-4">
          <Card title="Quick Links" className="h-100">
            <div className="list-group list-group-flush border rounded-3 overflow-hidden">
              <QuickLinkItem
                to="/facilitator/requests"
                title="Service Requests"
                description="Review and process requests"
                icon={FaClipboardList}
              />
              <QuickLinkItem
                to="/facilitator/verification"
                title="Document Verification"
                description="Check submitted documents"
                icon={FaFolderOpen}
              />
              <QuickLinkItem
                to="/facilitator/appointments"
                title="Appointment Management"
                description="View and manage appointments"
                icon={FaCalendarDay}
              />
              <QuickLinkItem
                to="/facilitator/walk-ins"
                title="Walk-In Queue"
                description="Monitor waiting students"
                icon={FaUsers}
              />
              <QuickLinkItem
                to="/facilitator/students"
                title="Student Records"
                description="View student information"
                icon={FaTasks}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Service Requests Section */}
      <Card
        title="Recent Service Requests"
        headerActions={
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => navigate('/facilitator/requests')}
          >
            View All
            <FaArrowRight className="ms-2" />
          </button>
        }
      >
        {recentRequests.length === 0 ? (
          <EmptyState
            message="No service requests have been submitted yet."
            icon="bi-inbox"
          />
        ) : (
          <DataTable
            columns={recentRequestsColumns}
            data={recentRequests}
            keyField="id"
          />
        )}
      </Card>
    </div>
  );
};

export default FacilitatorDashboard;