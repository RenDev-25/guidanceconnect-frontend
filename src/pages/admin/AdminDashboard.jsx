import React, { useState, useEffect } from 'react';
import StatusBadge from '../../components/common/StatusBadge';
import { requestService } from '../../services/requestService';
import { appointmentService } from '../../services/appointmentService';
import { goodMoralService } from '../../services/goodMoralService';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    pendingRequests: 0,
    todayAppointments: 0,
    pendingGoodMoral: 0,
    overdueFollowUps: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const requests = requestService.getAll() || [];
    const appointments = appointmentService.getAll() || [];
    const goodMorals = goodMoralService.getAll() || [];
    
    const today = new Date().toISOString().split('T')[0];
    
    setMetrics({
      pendingRequests: requests.filter(r => r.status === 'Pending').length,
      todayAppointments: appointments.filter(a => a.date === today).length,
      pendingGoodMoral: goodMorals.filter(g => g.status === 'Pending').length,
      overdueFollowUps: 2 // Mocked for now, will connect to followUpService later
    });

    setRecentActivity([...requests, ...appointments, ...goodMorals]
      .sort((a, b) => new Date(b.dateSubmitted || b.date) - new Date(a.dateSubmitted || a.date))
      .slice(0, 5));
  }, []);

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark">Office-Wide Operations</h1>
          <p className="text-muted small mb-0">Aggregated snapshot of all guidance center activities.</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 border-start border-primary border-4 h-100">
            <div className="card-body">
              <span className="text-muted small text-uppercase fw-semibold">Pending Requests</span>
              <h2 className="fw-bold text-dark my-1">{metrics.pendingRequests}</h2>
              <small className="text-muted">Awaiting triage</small>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 border-start border-info border-4 h-100">
            <div className="card-body">
              <span className="text-muted small text-uppercase fw-semibold">Today's Appointments</span>
              <h2 className="fw-bold text-dark my-1">{metrics.todayAppointments}</h2>
              <small className="text-muted">Scheduled sessions</small>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 border-start border-warning border-4 h-100">
            <div className="card-body">
              <span className="text-muted small text-uppercase fw-semibold">Pending Good Moral</span>
              <h2 className="fw-bold text-dark my-1">{metrics.pendingGoodMoral}</h2>
              <small className="text-muted">Clearance review required</small>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 border-start border-danger border-4 h-100">
            <div className="card-body">
              <span className="text-muted small text-uppercase fw-semibold">Overdue Follow-Ups</span>
              <h2 className="fw-bold text-dark my-1">{metrics.overdueFollowUps}</h2>
              <small className="text-danger fw-semibold">Requires immediate action</small>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h5 className="fw-bold text-dark mb-0">Recent Cross-Module Activity</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Student Name</th>
                  <th>Entity Type</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="fw-semibold">{item.id}</td>
                    <td>{item.studentName || item.studentId}</td>
                    <td>{item.serviceType || item.purpose || 'Appointment'}</td>
                    <td>{item.dateSubmitted || item.date || item.dateRequested}</td>
                    <td><StatusBadge status={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;