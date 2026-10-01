import React, { useState, useEffect } from 'react';
import StatusBadge from '../../components/common/StatusBadge';
import { appointmentService } from '../../services/appointmentService';
import { auditLogService } from '../../services/auditLogService';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [viewMode, setViewMode] = useState('list'); 
  const [selectedAppt, setSelectedAppt] = useState(null);

  const fetchAppointments = () => setAppointments(appointmentService.getAll() || []);

  useEffect(() => fetchAppointments(), []);

  const handleAction = (id, action) => {
    const user = JSON.parse(localStorage.getItem('user')) || { id: 'USR-ADMIN' };
    
    if (action === 'Cancel') {
      appointmentService.update(id, { status: 'Cancelled' });
      auditLogService.log(user.id, `Cancelled appointment ${id}`);
    } else if (action === 'Reschedule') {
      appointmentService.update(id, { status: 'Rescheduled' });
      auditLogService.log(user.id, `Flagged appointment ${id} for rescheduling`);
    }
    
    fetchAppointments();
    setSelectedAppt(null);
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark">Office Appointment Oversight</h1>
          <p className="text-muted small mb-0">Manage all scheduled sessions, reassignments, and cancellations.</p>
        </div>
        <div className="btn-group btn-group-sm">
          <button className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setViewMode('list')}>List</button>
          <button className={`btn ${viewMode === 'calendar' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setViewMode('calendar')}>Grid</button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Date & Time</th>
                    <th>Student Name</th>
                    <th>Assigned Counselor</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a.id}>
                      <td>{a.date} <span className="text-muted small">{a.time}</span></td>
                      <td className="fw-semibold">{a.studentName}</td>
                      <td>{a.counselorName || 'Unassigned'}</td>
                      <td>{a.reason}</td>
                      <td><StatusBadge status={a.status} /></td>
                      <td>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedAppt(a)}>Modify</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {appointments.map(a => (
            <div key={a.id} className="col-12 col-md-4 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="badge bg-primary">{a.date}</span>
                    <span className="text-muted small">{a.time}</span>
                  </div>
                  <h6 className="fw-bold mb-1">{a.studentName}</h6>
                  <p className="small text-muted mb-2 text-truncate">{a.reason}</p>
                  <StatusBadge status={a.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAppt && (
        <div className="modal show d-block fade" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Modify Schedule</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedAppt(null)}></button>
              </div>
              <div className="modal-body">
                <p>Modify scheduling for <strong>{selectedAppt.studentName}</strong>.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger btn-sm" onClick={() => handleAction(selectedAppt.id, 'Cancel')}>Cancel</button>
                <button className="btn btn-warning btn-sm text-dark" onClick={() => handleAction(selectedAppt.id, 'Reschedule')}>Reschedule</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;