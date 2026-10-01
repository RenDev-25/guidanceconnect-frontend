import React, { useState } from 'react';

const FollowUpManagement = () => {
  const [followUps, setFollowUps] = useState([
    { id: 'FU-882', studentName: 'Renzy', reason: 'Post-Counseling Check-in', dueDate: '2026-09-29', status: 'Overdue' },
    { id: 'FU-883', studentName: 'Mark Lee', reason: 'Academic Probation Monitoring', dueDate: '2026-10-05', status: 'Pending' }
  ]);

  const markComplete = (id) => {
    setFollowUps(prev => prev.map(f => f.id === id ? { ...f, status: 'Completed' } : f));
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h3 fw-bold text-dark">Follow-Up Tasks</h1>
        <p className="text-muted small">Monitor required check-ins sorted by due dates. Overdue items require immediate action.</p>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Task ID</th>
                  <th>Student</th>
                  <th>Reason</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {followUps.map((item) => {
                  const isOverdue = item.status === 'Overdue';
                  return (
                    <tr key={item.id} className={isOverdue ? 'table-danger' : ''}>
                      <td><span className="fw-medium">{item.id}</span></td>
                      <td>{item.studentName}</td>
                      <td>{item.reason}</td>
                      <td className={isOverdue ? 'text-danger fw-bold' : ''}>{item.dueDate}</td>
                      <td>
                        <span className={`badge ${item.status === 'Completed' ? 'bg-success' : isOverdue ? 'bg-danger' : 'bg-warning text-dark'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-success" 
                            onClick={() => markComplete(item.id)}
                            disabled={item.status === 'Completed'}
                          >
                            <i className="bi bi-check2"></i> Complete
                          </button>
                          <button className="btn btn-sm btn-outline-secondary" disabled={item.status === 'Completed'}>
                            Reschedule
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowUpManagement;