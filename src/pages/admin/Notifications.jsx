import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('All');

  const fetchNotifications = () => {
    const data = notificationService.getAdminNotifications() || [];
    setNotifications(data);
  };

  useEffect(() => fetchNotifications(), []);

  const handleMarkAsRead = (id) => {
    notificationService.markAsRead(id);
    fetchNotifications();
  };

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead('admin');
    fetchNotifications();
  };

  const filteredList = notifications.filter(n => {
    if (filter === 'Unread') return !n.read;
    if (filter === 'Read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark">Admin Notifications</h1>
          <p className="text-muted small mb-0">System alerts, escalation notices, and pending action triggers.</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-outline-primary btn-sm" onClick={handleMarkAllRead}>
            ✓ Mark All as Read
          </button>
        )}
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <div className="btn-group btn-group-sm">
            {['All', 'Unread', 'Read'].map(f => (
              <button
                key={f}
                className={`btn ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFilter(f)}
              >
                {f} {f === 'Unread' && unreadCount > 0 && `(${unreadCount})`}
              </button>
            ))}
          </div>
          <span className="text-muted small">Total: {notifications.length}</span>
        </div>
        <div className="card-body p-0">
          <div className="list-group list-group-flush">
            {filteredList.map(item => (
              <div 
                key={item.id} 
                className={`list-group-item p-3 border-0 border-bottom ${!item.read ? 'bg-light' : ''}`}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="me-3">
                    <div className="d-flex align-items-center mb-1">
                      <span className={`badge ${item.type === 'Alert' ? 'bg-danger' : 'bg-primary'} me-2`}>
                        {item.type || 'System'}
                      </span>
                      <h6 className={`mb-0 ${!item.read ? 'fw-bold text-dark' : 'text-secondary'}`}>
                        {item.title}
                      </h6>
                    </div>
                    <p className="text-muted small mb-1">{item.message}</p>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>{item.timestamp || item.date}</small>
                  </div>
                  {!item.read && (
                    <button 
                      className="btn btn-sm btn-link text-decoration-none p-0" 
                      onClick={() => handleMarkAsRead(item.id)}
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filteredList.length === 0 && (
              <div className="p-4 text-center text-muted">
                No notifications found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;