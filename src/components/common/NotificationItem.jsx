import React from 'react';

/**
 * Individual row for a notification list/dropdown
 * @param {Object} props
 * @param {Object} props.notification - { id, title, message, type, isRead, createdAt }
 * @param {function} props.onMarkRead
 */
const NotificationItem = ({ notification, onMarkRead }) => {
  return (
    <div 
      className={`p-3 border-bottom d-flex align-items-start ${notification.isRead ? 'bg-white' : 'bg-light'}`}
      style={{ cursor: 'pointer' }}     
      onClick={() => onMarkRead(notification.id)}
    >
      <div className={`text-${notification.isRead ? 'muted' : 'primary'} mt-1 me-3`}>
        <i className={`bi ${notification.isRead ? 'bi-envelope-open' : 'bi-envelope-fill'} fs-5`}></i>
      </div>
      <div className="flex-grow-1">
        <h6 className={`mb-1 ${notification.isRead ? 'text-muted' : 'fw-bold'}`}>
          {notification.title}
        </h6>
        <p className="mb-1 text-secondary small">{notification.message}</p>
        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
          {new Date(notification.createdAt).toLocaleString()}
        </small>
      </div>
      {!notification.isRead && (
        <span className="badge bg-primary rounded-circle p-1 ms-2">
          <span className="visually-hidden">New alert</span>
        </span>
      )}
    </div>
  );
};

export default NotificationItem;  