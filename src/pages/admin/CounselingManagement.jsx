import React, { useState, useEffect } from 'react';
import StatusBadge from '../../components/common/StatusBadge';
import { counselingService } from '../../services/counselingService';

const CounselingManagement = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    setCases(counselingService.getAll() || []);
  }, []);

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h3 fw-bold text-dark">Counseling Case Management</h1>
        <p className="text-muted small mb-0">Factual record tracking and session logs. (Non-clinical overview)</p>
      </div>

      {!selectedCase ? (
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Case ID</th>
                    <th>Student Name</th>
                    <th>Assigned Counselor</th>
                    <th>Latest Session</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map(c => (
                    <tr key={c.id}>
                      <td className="fw-semibold">{c.id}</td>
                      <td>{c.studentName}</td>
                      <td>{c.counselorName}</td>
                      <td>{c.lastSessionDate || 'N/A'}</td>
                      <td><StatusBadge status={c.status} /></td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedCase(c)}>
                          View Record
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">Case Record: {selectedCase.id}</h5>
            <button className="btn btn-sm btn-secondary" onClick={() => setSelectedCase(null)}>Back to List</button>
          </div>
          <div className="card-body">
            <div className="row mb-4">
              <div className="col-md-6">
                <p className="mb-1 text-muted small">Student Name</p>
                <p className="fw-semibold">{selectedCase.studentName}</p>
              </div>
              <div className="col-md-6">
                <p className="mb-1 text-muted small">Assigned Counselor</p>
                <p className="fw-semibold">{selectedCase.counselorName}</p>
              </div>
            </div>
            
            <h6 className="fw-bold mb-3 border-bottom pb-2">Session Logs</h6>
            <div className="table-responsive">
              <table className="table table-sm table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Duration</th>
                    <th>Factual Notes / Action Items</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedCase.sessions || []).map((session, idx) => (
                    <tr key={idx}>
                      <td style={{ width: '15%' }}>{session.date}</td>
                      <td style={{ width: '15%' }}>{session.duration} mins</td>
                      <td>{session.notes}</td>
                    </tr>
                  ))}
                  {(!selectedCase.sessions || selectedCase.sessions.length === 0) && (
                    <tr>
                      <td colSpan="3" className="text-center text-muted">No session logs recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounselingManagement;