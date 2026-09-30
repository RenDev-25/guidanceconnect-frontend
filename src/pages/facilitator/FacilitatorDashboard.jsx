import React, { useState, useEffect } from 'react';
import StatusBadge from '../../components/common/StatusBadge';
import { requestService } from '../../services/requestService';
import { appointmentService } from '../../services/appointmentService';
import { walkInService } from '../../services/walkInService';

const FacilitatorDashboard = () => {
  const [stats, setStats] = useState({
    pendingRequests: 0,
    todayAppointments: 0,
    walkInsWaiting: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    const allReqs = requestService.getAll() || [];
    const pendingReqs = allReqs.filter(r => r.status === 'Pending' || r.status === 'Processing');
    const today = new Date().toISOString().split('T')[0];
    const appts = (appointmentService.getAll() || []).filter(a => a.date === today);
    const walkIns = walkInService.getAll() || [];

    setStats({
      pendingRequests: pendingReqs.length,
      todayAppointments: appts.length,
      walkInsWaiting: walkIns.length,
    });
    setRecentRequests(allReqs.slice(0, 5));
  }, []);

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark">Facilitator Operations Dashboard</h1>
          <p className="text-muted small">Daily guidance office flow, appointment counts, and walk-in queues.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 border-start border-primary border-4 h-100">
            <div className="card-body">
              <p className="text-muted small mb-1">Pending Requests</p>
              <h2 className="fw-bold text-dark mb-0">{stats.pendingRequests}</h2>
              <small className="text-muted">Requires review</small>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 border-start border-info border-4 h-100">
            <div className="card-body">
              <p className="text-muted small mb-1">Today's Appointments</p>
              <h2 className="fw-bold text-dark mb-0">{stats.todayAppointments}</h2>
              <small className="text-muted">Scheduled for today</small>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 border-start border-warning border-4 h-100">
            <div className="card-body">
              <p className="text-muted small mb-1">Walk-Ins Waiting</p>
              <h2 className="fw-bold text-dark mb-0">{stats.walkInsWaiting}</h2>
              <small className="text-muted">Currently in lobby</small>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Requests Summary */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h5 className="fw-bold text-dark mb-0">Recent Service Requests</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Service Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.length > 0 ? (
                  recentRequests.map((req) => (
                    <tr key={req.id}>
                      <td className="fw-semibold">{req.id}</td>
                      <td>{req.studentName || req.studentId}</td>
                      <td>{req.serviceType || req.type}</td>
                      <td><StatusBadge status={req.status} /></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">No recent requests.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilitatorDashboard;