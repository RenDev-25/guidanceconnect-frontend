import React, { useState, useEffect } from 'react';
import StatusBadge from '../../components/common/StatusBadge';
import { walkInService } from '../../services/walkInService';

const WalkInQueue = () => {
  const [queue, setQueue] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWalkIn, setNewWalkIn] = useState({ studentName: '', studentId: '', purpose: '' });

  const refreshQueue = () => {
    setQueue(walkInService.getAllIncludingServed() || []);
  };

  useEffect(() => {
    refreshQueue();
  }, []);

  const handleCallNext = () => {
    const next = walkInService.callNext();
    if (!next) {
      alert('No students currently waiting in queue.');
    }
    refreshQueue();
  };

  const handleMarkServed = (id) => {
    walkInService.markServed(id);
    refreshQueue();
  };

  const handleAddWalkIn = (e) => {
    e.preventDefault();
    if (!newWalkIn.studentName || !newWalkIn.purpose) return;
    
    walkInService.addWalkIn({
      ...newWalkIn,
      timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setNewWalkIn({ studentName: '', studentId: '', purpose: '' });
    setShowAddModal(false);
    refreshQueue();
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark">Walk-In Queue Management</h1>
          <p className="text-muted small">Call lobby students and track active guidance office consultations.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-success btn-sm" onClick={handleCallNext}>
            📢 Call Next Student
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            + Add Walk-In
          </button>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Queue ID</th>
                  <th>Student Name</th>
                  <th>Purpose</th>
                  <th>Time In</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {queue.length > 0 ? (
                  queue.map((item) => (
                    <tr key={item.id} className={item.status === 'Serving' ? 'table-warning' : ''}>
                      <td className="fw-semibold">{item.id}</td>
                      <td>{item.studentName} <small className="text-muted">({item.studentId})</small></td>
                      <td>{item.purpose}</td>
                      <td>{item.timeIn}</td>
                      <td><StatusBadge status={item.status} /></td>
                      <td>
                        {item.status === 'Serving' && (
                          <button 
                            className="btn btn-sm btn-success"
                            onClick={() => handleMarkServed(item.id)}
                          >
                            Mark Served
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">Queue is currently empty.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Walk-In Modal */}
      {showAddModal && (
        <div className="modal show d-block fade" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handleAddWalkIn}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Register Lobby Walk-In</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Student Name</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      required 
                      value={newWalkIn.studentName}
                      onChange={(e) => setNewWalkIn({ ...newWalkIn, studentName: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Student ID</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      value={newWalkIn.studentId}
                      onChange={(e) => setNewWalkIn({ ...newWalkIn, studentId: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Purpose</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      required 
                      placeholder="e.g. Good Moral Certificate, Inquiry"
                      value={newWalkIn.purpose}
                      onChange={(e) => setNewWalkIn({ ...newWalkIn, purpose: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm">Add to Queue</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalkInQueue;