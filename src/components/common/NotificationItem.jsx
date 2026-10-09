
import React from 'react';

/**
 * Individual notification item.
 *
 * @param {Object} props
 * @param {Object} props.notification
 * @param {Function} props.onMarkRead
 */
const NotificationItem = ({ notification, onMarkRead }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onMarkRead(notification.id);
    }
  };

  return (
    <div
      className={`notification-item ${
        notification.isRead
          ? 'notification-item-read'
          : 'notification-item-unread'
      }`}
      role="button"
      tabIndex={0}
      aria-label={`${notification.title}. ${
        notification.isRead ? 'Already read' : 'Unread. Mark as read'
      }`}
      onClick={() => onMarkRead(notification.id)}
      onKeyDown={handleKeyDown}
    >
      <div className="notification-item-icon" aria-hidden="true">
        <i
          className={`bi ${
            notification.isRead
              ? 'bi-envelope-open'
              : 'bi-envelope-fill'
          }`}
        />
      </div>

      <div className="notification-item-content">
        <h6
          className={`notification-item-title ${
            notification.isRead ? 'text-muted' : 'fw-bold'
          }`}
        >
          {notification.title}
        </h6>

        <p className="notification-item-message">
          {notification.message}
        </p>

        <small className="notification-item-date">
          {new Date(notification.createdAt).toLocaleString()}
        </small>
      </div>

      {!notification.isRead && (
        <span className="notification-unread-indicator">
          <span className="visually-hidden">Unread notification</span>
        </span>
      )}
    </div>
  );
};

export default NotificationItem;
