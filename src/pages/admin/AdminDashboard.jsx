
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import StatCard from '../../components/common/StatCard';
import DashboardGrid from '../../components/dashboard/DashboardGrid';
import LoadingState from '../../components/common/LoadingState';
import Card from '../../components/common/Card';
import ChartContainer from '../../components/common/ChartContainer';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';

import { useDashboardStats } from '../../hooks/useDashboardStats';
import { requestService } from '../../services/requestService';
import { appointmentService } from '../../services/appointmentService';
import { goodMoralService } from '../../services/goodMoralService';
import { analyticsService } from '../../services/analyticsService';
import { recommendationService } from '../../services/recommendationService';

const getRecordDate = (record) =>
  record.dateSubmitted ||
  record.date ||
  record.requestDate ||
  record.createdDate ||
  '';

const formatDate = (value) => {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const priorityClass = (priority) => {
  if (priority === 'High') return 'bg-danger';
  if (priority === 'Medium') return 'bg-warning text-dark';

  return 'bg-secondary';
};

const AnalyticsTrendPreview = ({ analytics }) => {
  const totalRequests = analytics?.requests?.total ?? 0;
  const pendingRequests = analytics?.requests?.pending ?? 0;
  const completedRequests = analytics?.requests?.completed ?? 0;
  const inProgressRequests = analytics?.requests?.inProgress ?? 0;

  const values = [
    pendingRequests,
    inProgressRequests,
    completedRequests,
  ];

  const maxValue = Math.max(...values, 1);

  const bars = [
    {
      label: 'Pending',
      value: pendingRequests,
      color: '#f0ad4e',
    },
    {
      label: 'In Progress',
      value: inProgressRequests,
      color: '#0d6efd',
    },
    {
      label: 'Completed',
      value: completedRequests,
      color: '#198754',
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <p className="text-muted small mb-1">
            Current request overview
          </p>

          <h3 className="fw-bold mb-0">{totalRequests}</h3>

          <small className="text-muted">
            Total service requests
          </small>
        </div>

        <span className="badge bg-light text-secondary border">
          Preview
        </span>
      </div>

      <div className="d-flex align-items-end justify-content-around gap-3 px-2">
        {bars.map((bar) => {
          const height = Math.max(
            (bar.value / maxValue) * 150,
            bar.value > 0 ? 12 : 4
          );

          return (
            <div
              key={bar.label}
              className="d-flex flex-column align-items-center flex-fill"
            >
              <span className="small fw-semibold mb-2">
                {bar.value}
              </span>

              <div
                className="w-100 d-flex align-items-end"
                style={{ height: '160px', maxWidth: '72px' }}
              >
                <div
                  className="w-100 rounded-top"
                  style={{
                    height: `${height}px`,
                    backgroundColor: bar.color,
                    transition: 'height 0.3s ease',
                  }}
                  role="img"
                  aria-label={`${bar.label}: ${bar.value} requests`}
                />
              </div>

              <small className="text-muted text-center mt-2">
                {bar.label}
              </small>
            </div>
          );
        })}
      </div>

      <p className="text-muted small mb-0 mt-4">
        This is a status summary using current request records,
        not a historical trend. Historical trend data can be
        connected in a future analytics stage.
      </p>
    </div>
  );
};

const AdminDashboard = () => {
  const { stats, loading } = useDashboardStats('counselor');

  const [recentActivity, setRecentActivity] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [dataError, setDataError] = useState(false);

  useEffect(() => {
    try {
      const requests = requestService.getAll() || [];
      const appointments = appointmentService.getAll() || [];
      const goodMorals = goodMoralService.getAll() || [];

      const activity = [
        ...requests.map((item) => ({
          ...item,
          entityType: 'Service Request',
          activityDate: getRecordDate(item),
        })),

        ...appointments.map((item) => ({
          ...item,
          entityType: 'Appointment',
          activityDate: getRecordDate(item),
          serviceType: item.type || 'Appointment',
        })),

        ...goodMorals.map((item) => ({
          ...item,
          entityType: 'Good Moral Request',
          activityDate: getRecordDate(item),
          serviceType: item.purpose || 'Good Moral',
        })),
      ];

      activity.sort(
        (a, b) =>
          new Date(b.activityDate || 0) -
          new Date(a.activityDate || 0)
      );

      setRecentActivity(activity.slice(0, 5));

      setAnalytics(analyticsService.getDashboardAnalytics());

      setRecommendations(
        recommendationService.getPrescriptiveRecommendations() || []
      );
    } catch (error) {
      console.error('Unable to load admin dashboard data:', error);
      setDataError(true);
    }
  }, []);

  if (loading || !stats) {
    return (
      <div className="container-fluid py-4">
        <LoadingState message="Loading admin command center..." />
      </div>
    );
  }

  const topRecommendation = [...recommendations].sort(
    (a, b) => {
      const order = { High: 1, Medium: 2, Low: 3 };

      return (
        (order[a.priority] || 4) -
        (order[b.priority] || 4)
      );
    }
  )[0];

  return (
    <div className="container-fluid py-4">
      {/* Page heading */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">
            Admin Command Center
          </h1>

          <p className="text-muted mb-0">
            Monitor guidance office operations, service requests,
            appointments, and follow-up activities.
          </p>
        </div>

        <Link
          to="/admin/dashboard#analytics"
          className="btn btn-primary"
        >
          View Analytics
        </Link>
      </div>

      {dataError && (
        <div className="alert alert-warning" role="alert">
          Some dashboard sections could not be loaded. Please
          refresh the page and check the service data if the issue
          continues.
        </div>
      )}

      {/* Summary cards */}
      <DashboardGrid>
        <StatCard
          title="Total Requests"
          value={stats.totalRequests ?? 0}
          subtitle="All recorded service requests"
          borderTheme="primary"
        />

        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests ?? 0}
          subtitle="Requests needing attention"
          borderTheme="warning"
        />

        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments ?? 0}
          subtitle="Appointments scheduled today"
          borderTheme="info"
        />

        <StatCard
          title="Completed Services"
          value={stats.completedServices ?? 0}
          subtitle="Requests marked completed"
          borderTheme="success"
        />

        <StatCard
          title="Pending Documents"
          value={stats.pendingDocuments ?? 0}
          subtitle="Documents awaiting review"
          borderTheme="primary"
        />

        <StatCard
          title="Overdue Follow-Ups"
          value={stats.overdueFollowUps ?? 0}
          subtitle="Follow-ups past their scheduled date"
          borderTheme="danger"
        />
      </DashboardGrid>

      {/* Analytics and recommendation previews */}
      <div className="row g-4" id="analytics">
        <div className="col-12 col-xl-7">
          <ChartContainer title="Analytics Trend Chart">
            <div className="w-100">
              <AnalyticsTrendPreview analytics={analytics} />
            </div>
          </ChartContainer>
        </div>

        <div className="col-12 col-xl-5">
          <Card title="Top Prescriptive Recommendation">
            {!topRecommendation ? (
              <EmptyState
                message="No recommendations are currently triggered by the available rules."
              />
            ) : (
              <div>
                <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                  <span className="badge bg-light text-dark border">
                    {topRecommendation.category}
                  </span>

                  <span
                    className={`badge ${priorityClass(
                      topRecommendation.priority
                    )}`}
                  >
                    {topRecommendation.priority} Priority
                  </span>
                </div>

                <h6 className="fw-bold mb-2">
                  {topRecommendation.condition}
                </h6>

                <p className="text-muted small mb-2">
                  Suggested action
                </p>

                <p className="mb-3">
                  {topRecommendation.suggestedAction}
                </p>

                <div className="alert alert-light border small mb-0">
                  <strong>Note:</strong> This recommendation is
                  generated from the system's predefined rules.
                  Review the underlying records before taking
                  action.
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Recent activity */}
      <div className="mt-4">
        <Card
          title="Recent Cross-Module Activity"
          headerActions={
            <span className="text-muted small">
              Latest 5 records
            </span>
          }
        >
          {recentActivity.length === 0 ? (
            <EmptyState message="No recent activity is available." />
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Student</th>
                    <th scope="col">Module</th>
                    <th scope="col">Date</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentActivity.map((item, index) => (
                    <tr key={`${item.entityType}-${item.id || index}`}>
                      <td className="fw-semibold">
                        {item.id || '—'}
                      </td>

                      <td>
                        {item.studentName ||
                          item.studentId ||
                          'Unknown student'}
                      </td>

                      <td>
                        <div>{item.entityType}</div>
                        <small className="text-muted">
                          {item.serviceType || '—'}
                        </small>
                      </td>

                      <td>{formatDate(item.activityDate)}</td>

                      <td>
                        <StatusBadge status={item.status || 'Unknown'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
