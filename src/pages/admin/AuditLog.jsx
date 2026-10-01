import React, { useState, useEffect } from 'react';
import { auditLogService } from '../../services/auditLogService';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLogs(auditLogService.getAll() || []);
  }, []);

  const filteredLogs = logs.filter(log => 
    log.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.timestamp?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark">System Audit Log</h1>
          <p className="text-muted small mb-0">Read-only immutable log of system actions, updates, and access activities.</p>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search by User ID, action, or date..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
            </div>
            <div className="col-md-6 text-end text-muted small">
              Showing {filteredLogs.length} of {logs.length} logged entries
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '20%' }}>Timestamp</th>
                  <th style={{ width: '15%' }}>User ID</th>
                  <th>Action Executed</th>
                  <th style={{ width: '15%' }}>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, idx) => (
                  <tr key={log.id || idx}>
                    <td className="small text-muted">{log.timestamp}</td>
                    <td className="fw-semibold text-primary">{log.userId}</td>
                    <td>{log.action}</td>
                    <td className="small text-muted">{log.ipAddress || '127.0.0.1'}</td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No audit log entries matched your filter.
                    </td>
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

export default AuditLog;