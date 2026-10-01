import React, { useState, useEffect } from 'react';
import { exitInterviewService } from '../../services/exitInterviewService';
import { auditLogService } from '../../services/auditLogService';

const ExitInterview = () => {
  const [interviews, setInterviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ studentName: '', studentId: '', reasonForLeaving: '', notes: '' });

  const fetchInterviews = () => setInterviews(exitInterviewService.getAll() || []);

  useEffect(() => fetchInterviews(), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user')) || { id: 'USR-ADMIN' };
    
    const newRecord = {
      ...formData,
      date: new Date().toISOString().split('T')[0]
    };
    
    exitInterviewService.create(newRecord);
    auditLogService.log(user.id, `Logged exit interview for ${formData.studentId}`);
    
    setFormData({ studentName: '', studentId: '', reasonForLeaving: '', notes: '' });
    setShowForm(false);
    fetchInterviews();
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark">Exit Interviews</h1>
          <p className="text-muted small mb-0">Log and review offboarding interviews for departing students.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Log New Interview'}
        </button>
      </div>

      {showForm && (
        <div className="card shadow-sm border-0 mb-4 border-start border-primary border-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Log Exit Interview</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Student Name</label>
                  <input type="text" className="form-control" value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Student ID</label>
                  <input type="text" className="form-control" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} required />
                </div>
                <div className="col-md-12">
                  <label className="form-label small fw-semibold">Primary Reason for Leaving</label>
                  <select className="form-select" value={formData.reasonForLeaving} onChange={e => setFormData({...formData, reasonForLeaving: e.target.value})} required>
                    <option value="">Select Reason...</option>
                    <option value="Graduation">Graduation</option>
                    <option value="Transfer">Transfering to another institution</option>
                    <option value="Financial">Financial Constraints</option>
                    <option value="Personal">Personal/Health Reasons</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-md-12">
                  <label className="form-label small fw-semibold">Factual Notes</label>
                  <textarea className="form-control" rows="3" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} required></textarea>
                </div>
                <div className="col-12 text-end">
                  <button type="submit" className="btn btn-success">Save Record</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Reason for Leaving</th>
                  <th>Interviewer Notes</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map(inv => (
                  <tr key={inv.id}>
                    <td className="fw-semibold">{inv.date}</td>
                    <td>{inv.studentId}</td>
                    <td>{inv.studentName}</td>
                    <td><span className="badge bg-secondary">{inv.reasonForLeaving}</span></td>
                    <td className="text-truncate" style={{ maxWidth: '300px' }}>{inv.notes}</td>
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

export default ExitInterview;