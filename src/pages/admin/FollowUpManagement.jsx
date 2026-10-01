import React, { useState, useEffect } from 'react';
import StatusBadge from '../../components/common/StatusBadge';
import { followUpService } from '../../services/followUpService';
import { auditLogService } from '../../services/auditLogService';

const FollowUpManagement = () => {
  const [followUps, setFollowUps] = useState([]);

  const fetchFollowUps = () => {
    const data = followUpService.getAll() || [];
    // Sort by due date ascending
    const sorted = data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    setFollowUps(sorted);
  };

  useEffect(() => fetchFollowUps(), []);

  const handleAction = (id, action) => {
    const user = JSON.parse(localStorage.getItem('user')) || { id: 'USR-ADMIN' };
    
    if (action === 'Complete') {
      followUpService.updateStatus(id, 'Completed');
      auditLogService.log(user.id, `Marked follow-up ${id} as completed`);
    }
    fetchFollowUps();
  };

  const isOverdue = (dueDate, status) => {
    return new Date(dueDate) < new Date() && status !== 'Completed';
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h3 fw-bold text-dark">Follow-Up Tracking</h1>
        <p className="text-muted small mb-0">Monitor required post-session actions and check-ins.</p>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Due Date</th>
                  <th>Student Name</th>
                  <th>Required Action</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {followUps.map(f => {
                  const overdue = isOverdue(f.dueDate, f.status);
                  return (
                    <tr key={f.id} className={overdue ? 'table-danger' : ''}>
                      <td>
                        <span className={`fw-semibold ${overdue ? 'text-danger' : ''}`}>{f.dueDate}</span>
                        {overdue && <span className="badge bg-danger ms-2">Overdue</span>}
                      </td>
                      <td>{f.studentName}</td>
                      <td>{f.actionRequired}</td>
                      <td><StatusBadge status={f.status} /></td>
                      <td>
                        {f.status !== 'Completed' && (
                          <button 
                            className="btn btn-sm btn-success" 
                            onClick={() => handleAction(f.id, 'Complete')}
                          >
                            Mark Done
                          </button>
                        )}
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