import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';

const FacilitatorNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications(notificationService.getAll() || []);
  }, []);

  const handleMarkRead = (id) => {
    notificationService.markAsRead(id);
    setNotifications(notificationService.getAll());
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div> 
          <h1 className="h3 fw-bold text-dark">Facilitator Notifications</h1>
          <p className="text-muted small">System updates, new requests, and queue alerts.</p>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="list-group list-group-flush">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div key={n.id} className={`list-group-item py-3 ${!n.read ? 'bg-light' : ''}`}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-bold mb-1">{n.title}</h6>
                    <p className="mb-1 text-muted small">{n.message}</p>
                    <small className="text-secondary">{n.date || 'Just now'}</small>
                  </div>
                  {!n.read && (
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleMarkRead(n.id)}
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5 text-muted">
              No notifications available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacilitatorNotifications;