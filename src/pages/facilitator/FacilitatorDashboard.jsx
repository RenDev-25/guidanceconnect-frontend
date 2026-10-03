
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import StatCard from '../../components/common/StatCard';
import LoadingState from '../../components/common/LoadingState';
import StatusBadge from '../../components/common/StatusBadge';
import Card from '../../components/common/Card';
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
  request.dateSubmitted || request.createdAt || '';

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

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const QuickLink = ({ to, title, description }) => (
  <Link
    to={to}
    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3"
  >
    <div>
      <div className="fw-semibold text-dark">{title}</div>
      <small className="text-muted">{description}</small>
    </div>

    <span className="text-primary fw-semibold" aria-hidden="true">
      →
    </span>
  </Link>
);

const FacilitatorDashboard = () => {
  const { stats, loading } = useDashboardStats('facilitator');

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const allRequests = requestService.getAll() || [];

    setRequests(allRequests);
  }, []);

  const recentRequests = useMemo(() => {
    return [...requests]
      .sort((a, b) =>
        getRequestDate(b).localeCompare(getRequestDate(a))
      )
      .slice(0, 5);
  }, [requests]);

  const priorityRequests = useMemo(() => {
    const activeRequests = requests.filter((request) =>
      ACTIVE_REQUEST_STATUSES.includes(request.status)
    );

    return sortRequestsByPriority(activeRequests).slice(0, 5);
  }, [requests]);

  if (loading || !stats) {
    return (
      <div className="container-fluid py-4">
        <LoadingState message="Loading facilitator dashboard..." />
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Dashboard heading */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">
            Facilitator Dashboard
          </h1>

          <p className="text-muted mb-0">
            Monitor service requests, document verification,
            appointments, and the walk-in queue.
          </p>
        </div>

        <Link
          to="/facilitator/requests"
          className="btn btn-primary"
        >
          View Request Queue
        </Link>
      </div>

      {/* Summary cards */}
      <DashboardGrid>
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests ?? 0}
          subtitle="Requests awaiting review"
          borderTheme="primary"
        />

        <StatCard
          title="Documents for Verification"
          value={stats.documentsForVerification ?? 0}
          subtitle="Documents awaiting checking"
          borderTheme="warning"
        />

        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments ?? 0}
          subtitle="Appointments scheduled today"
          borderTheme="info"
        />

        <StatCard
          title="Walk-In Queue"
          value={stats.walkInQueueCount ?? stats.walkInsWaiting ?? 0}
          subtitle="Students waiting to be assisted"
          borderTheme="danger"
        />

        <StatCard
          title="Tasks Remaining"
          value={stats.tasksRemaining ?? 0}
          subtitle="Requests being processed"
          borderTheme="success"
        />
      </DashboardGrid>

      {/* Priority queue and quick links */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-xl-8">
          <Card
            title="Priority Queue Preview"
            headerActions={
              <Link
                to="/facilitator/requests"
                className="btn btn-sm btn-outline-primary"
              >
                Open Queue
              </Link>
            }
          >
            <p className="text-muted small mb-3">
              Active requests ordered by priority, with urgent
              requests displayed first.
            </p>

            {priorityRequests.length === 0 ? (
              <EmptyState message="There are no active requests in the priority queue." />
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Request ID</th>
                      <th scope="col">Student</th>
                      <th scope="col">Service</th>
                      <th scope="col">Priority</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {priorityRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="fw-semibold">
                          {request.id}
                        </td>

                        <td>
                          {request.studentName ||
                            request.studentId ||
                            'Unknown student'}
                        </td>

                        <td>
                          {request.serviceType ||
                            request.type ||
                            'Service request'}
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              request.priority === 'Urgent'
                                ? 'bg-danger'
                                : request.priority === 'High'
                                  ? 'bg-warning text-dark'
                                  : 'bg-secondary'
                            }`}
                          >
                            {request.priority || 'Normal'}
                          </span>
                        </td>

                        <td>
                          <StatusBadge status={request.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        <div className="col-12 col-xl-4">
          <Card title="Quick Links">
            <div className="list-group list-group-flush">
              <QuickLink
                to="/facilitator/requests"
                title="Service Requests"
                description="Review and process requests"
              />

              <QuickLink
                to="/facilitator/verification"
                title="Document Verification"
                description="Check submitted documents"
              />

              <QuickLink
                to="/facilitator/appointments"
                title="Appointment Management"
                description="View and manage appointments"
              />

              <QuickLink
                to="/facilitator/walk-ins"
                title="Walk-In Queue"
                description="Monitor waiting students"
              />

              <QuickLink
                to="/facilitator/students"
                title="Student Records"
                description="View student information"
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Recent service requests */}
      <Card
        title="Recent Service Requests"
        headerActions={
          <Link
            to="/facilitator/requests"
            className="btn btn-sm btn-outline-primary"
          >
            View All
          </Link>
        }
      >
        {recentRequests.length === 0 ? (
          <EmptyState message="No service requests have been submitted yet." />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Request ID</th>
                  <th scope="col">Student</th>
                  <th scope="col">Service Type</th>
                  <th scope="col">Date Submitted</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="fw-semibold">
                      {request.id}
                    </td>

                    <td>
                      {request.studentName ||
                        request.studentId ||
                        'Unknown student'}
                    </td>

                    <td>
                      {request.serviceType ||
                        request.type ||
                        'Service request'}
                    </td>

                    <td>{formatDate(getRequestDate(request))}</td>

                    <td>
                      <StatusBadge status={request.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FacilitatorDashboard;
