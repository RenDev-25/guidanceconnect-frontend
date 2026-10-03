
import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';

const FacilitatorNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = () => {
    const data = notificationService.getAll();
    setNotifications(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = (id) => {
    notificationService.markAsRead(id);
    fetchNotifications();
  };

  const handleMarkAllRead = () => {
    notifications
      .filter((notification) => !notification.isRead)
      .forEach((notification) => {
        notificationService.markAsRead(notification.id);
      });

    fetchNotifications();
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark">
            Facilitator Notifications
          </h1>
          <p className="text-muted small">
            System updates, new requests, and queue alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={handleMarkAllRead}
          >
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      <div className="card shadow-sm border-0">
        <div className="list-group list-group-flush">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`list-group-item py-3 ${
                  !notification.isRead ? 'bg-light' : ''
                }`}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-bold mb-1">
                      {notification.title}
                    </h6>

                    <p className="mb-1 text-muted small">
                      {notification.message}
                    </p>

                    <small className="text-secondary">
                      {notification.date || 'Just now'}
                    </small>
                  </div>

                  {!notification.isRead && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleMarkRead(notification.id)}
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
