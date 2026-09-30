import React, { useState, useEffect } from 'react';
import { requestService } from '../../services/requestService';
import { appointmentService } from '../../services/appointmentService';
import { documentService } from '../../services/documentService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    todayAppointments: 0,
    completedServices: 0,
    pendingDocs: 0,
    overdueFollowUps: 2 
  });

  useEffect(() => {
    const requests = requestService.getAll() || [];
    const appointments = appointmentService.getAll() || [];
    const documents = documentService.getAll() || [];

    const pendingReqs = requests.filter(r => r.status === 'Pending' || r.status === 'In Progress').length;
    const today = new Date().toISOString().split('T')[0];
    const todayAppts = appointments.filter(a => a.date === today).length;
    const completed = requests.filter(r => r.status === 'Completed').length;
    const pendingDocuments = documents.filter(d => d.status === 'Pending').length;

    setStats({
      totalRequests: requests.length,
      pendingRequests: pendingReqs,
      todayAppointments: todayAppts,
      completedServices: completed,
      pendingDocs: pendingDocuments,
      overdueFollowUps: 2
    });
  }, []);

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark">Admin Command Center</h1>
          <p className="text-muted small">Office-wide operational snapshot and real-time activity metrics.</p>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card shadow-sm border-0 border-start border-primary border-4 h-100">
            <div className="card-body">
              <p className="text-muted small mb-1">Pending Requests</p>
              <h2 className="fw-bold text-dark mb-1">{stats.pendingRequests}</h2>
              <p className="text-muted extra-small mb-0">Total System Requests: {stats.totalRequests}</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card shadow-sm border-0 border-start border-info border-4 h-100">
            <div className="card-body">
              <p className="text-muted small mb-1">Today's Appointments</p>
              <h2 className="fw-bold text-dark mb-1">{stats.todayAppointments}</h2>
              <p className="text-muted extra-small mb-0">Scheduled for today</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card shadow-sm border-0 border-start border-success border-4 h-100">
            <div className="card-body">
              <p className="text-muted small mb-1">Completed Services</p>
              <h2 className="fw-bold text-dark mb-1">{stats.completedServices}</h2>
              <p className="text-muted extra-small mb-0">Successfully resolved cases</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card shadow-sm border-0 border-start border-warning border-4 h-100">
            <div className="card-body">
              <p className="text-muted small mb-1">Pending Documents</p>
              <h2 className="fw-bold text-dark mb-1">{stats.pendingDocs}</h2>
              <p className="text-muted extra-small mb-0">Awaiting document verification</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card shadow-sm border-0 border-start border-danger border-4 h-100">
            <div className="card-body">
              <p className="text-muted small mb-1">Overdue Follow-Ups</p>
              <h2 className="fw-bold text-dark mb-1">{stats.overdueFollowUps}</h2>
              <p className="text-danger extra-small mb-0">Requires immediate attention</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h5 className="fw-bold text-dark mb-2">Quick Navigation</h5>
          <p className="text-muted small mb-0">Use the sidebar navigation to manage specific office modules, audit logs, user configurations, and system settings.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;