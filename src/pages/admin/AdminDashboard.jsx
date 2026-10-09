import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaChartLine,
  FaClipboardList,
  FaCalendarDay,
  FaCheckCircle,
  FaFolderOpen,
  FaExclamationCircle,
  FaLightbulb,
  FaArrowRight,
  FaChartBar
} from 'react-icons/fa';

import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useAuth } from '../../context/AuthContext';

import StatCard from '../../components/common/StatCard';
import DashboardGrid from '../../components/dashboard/DashboardGrid';
import Card from '../../components/common/Card';
import LoadingState from '../../components/common/LoadingState';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  

  const { stats, loading } = useDashboardStats('admin');

  if (loading || !stats) {
    return <LoadingState message="Loading OGC command center..." />;
  }

  const adminName = user?.name?.trim().split(/\s+/)[0] || 'Administrator';

  return (
    <div className="container-fluid py-4 dashboard-page">
      {/* Page Heading and Quick Action */}
      <div className="dashboard-page-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <p className="text-primary fw-semibold small text-uppercase mb-1">
            OGC Command Center
          </p>
          <h2 className="fw-bold mb-2">
            Overview, {adminName}
          </h2>
          <p className="text-muted mb-0">
            Here is what's happening across the office today.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary dashboard-primary-action d-inline-flex align-items-center justify-content-center gap-2 shadow-sm"
          onClick={() => navigate('/admin/analytics')}
        >
          <FaChartLine aria-hidden="true" />
          View Analytics
        </button>
      </div>

      {/* Admin 6-Card Statistics Grid */}
      <DashboardGrid>
        <StatCard
          title="Total Requests"
          value={stats.totalRequests ?? 0}
          subtitle="System-wide all time"
          icon={<FaClipboardList size={20} />}
          borderTheme="secondary"
        />

        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests ?? 0}
          subtitle="Awaiting processing"
          icon={<FaFolderOpen size={20} />}
          borderTheme="primary"
        />

        <StatCard
          title="Today's Appointments"
          value={stats.todaysAppointments ?? stats.todayAppointments ?? 0}
          subtitle="Scheduled across all staff"
          icon={<FaCalendarDay size={20} />}
          borderTheme="info"
        />

        <StatCard
          title="Completed Services"
          value={stats.completedServices ?? 0}
          subtitle="Successfully resolved"
          icon={<FaCheckCircle size={20} />}
          borderTheme="success"
        />

        <StatCard
          title="Pending Documents"
          value={stats.pendingDocuments ?? stats.documentsForVerification ?? 0}
          subtitle="Awaiting verification"
          icon={<FaFolderOpen size={20} />}
          borderTheme="warning"
        />

        <StatCard
          title="Overdue Follow-ups"
          value={stats.overdueFollowUps ?? 0}
          subtitle="Requires immediate attention"
          icon={<FaExclamationCircle size={20} />}
          borderTheme="danger"
        />
      </DashboardGrid>

      {/* Secondary Content: Chart & Recommendations */}
      <div className="row g-4 mb-4">
        
        {/* Left Column: Analytics Trend Chart Placeholder */}
        <div className="col-12 col-lg-8">
          <Card
            title="System Activity (Last 7 Days)"
            className="h-100 shadow-sm"
            headerActions={
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => navigate('/admin/reports')}
              >
                Detailed Report
                <FaArrowRight className="ms-2" />
              </button>
            }
          >
            {/* 
              NOTE: Replace this placeholder div with your actual Chart.js or Recharts compo nent later.
              Example: <LineChart data={chartData} ... />
            */}
            <div 
              className="bg-light rounded-3 d-flex flex-column align-items-center justify-content-center w-100" 
              style={{ minHeight: '320px', border: '1px dashed #dee2e6' }}
            >
              <div className="p-3 bg-white rounded-circle shadow-sm mb-3">
                <FaChartBar size={32} className="text-primary" />
              </div>
              <h6 className="fw-bold text-dark mb-1">Analytics Visualization</h6>
              <p className="text-muted small mb-0 text-center px-4">
                Chart component will be rendered here.<br/>
                Showing request volume vs. completed services over time.
              </p>
            </div>
          </Card>
        </div>

        {/* Right Column: AI / Top Prescriptive Recommendation */}
        <div className="col-12 col-lg-4">
          <Card 
            title="Prescriptive Insights" 
            className="h-100 shadow-sm"
          >
            <div className="d-flex flex-column gap-3 h-100">
              
              <div className="alert alert-info border-0 rounded-3 shadow-sm mb-0">
                <div className="d-flex gap-3">
                  <div className="pt-1">
                    <FaLightbulb size={24} className="text-info" />
                  </div>
                  <div>
                    <h6 className="alert-heading fw-bold mb-1">Peak Walk-in Hours Detected</h6>
                    <p className="small mb-2">
                      Data shows a 45% increase in walk-in traffic between 1:00 PM and 3:00 PM on Tuesdays and Thursdays.
                    </p>
                    <hr className="my-2 border-info opacity-25" />
                    <p className="small fw-semibold mb-0">
                      Recommendation: Allocate an additional facilitator to the front desk during these hours to minimize wait times.
                    </p>
                  </div>
                </div>
              </div>

              <div className="alert alert-warning border-0 rounded-3 shadow-sm mb-0 mt-auto">
                <div className="d-flex gap-3">
                  <div className="pt-1">
                    <FaExclamationCircle size={24} className="text-warning" />
                  </div>
                  <div>
                    <h6 className="alert-heading fw-bold mb-1">Overdue Follow-ups</h6>
                    <p className="small mb-0">
                      You have <strong>{stats.overdueFollowUps ?? 0}</strong> follow-ups pending past their target date.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;