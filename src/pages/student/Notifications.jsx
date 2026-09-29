import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import NotificationItem from '../../components/common/NotificationItem';
import Button from '../../components/common/Button';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import { notificationService } from '../../services/notificationService';

const CURRENT_STUDENT_ID = 'STU-001';

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setNotifications(notificationService.getByUser(CURRENT_STUDENT_ID) || []);
      setLoading(false);
    }, 400);
  }, []);

  const handleMarkRead = (id) => {
    notificationService.markAsRead(id);
    setNotifications(notificationService.getByUser(CURRENT_STUDENT_ID) || []);
  };

  const handleMarkAllRead = () => {
    notifications.forEach((n) => notificationService.markAsRead(n.id));
    setNotifications(notificationService.getByUser(CURRENT_STUDENT_ID) || []);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">Notifications</h3>
        {unreadCount > 0 && (
          <Button variant="outline-primary" size="sm" onClick={handleMarkAllRead}>
            Mark All as Read ({unreadCount})
          </Button>
        )}
      </div>

      <Card>
        {loading ? (
          <LoadingState message="Loading notifications..." />
        ) : notifications.length === 0 ? (
          <EmptyState message="You have no notifications." icon="bi-bell-slash" />
        ) : (
          <div className="list-group list-group-flush">
            {notifications.map((item) => (
              <NotificationItem
                key={item.id}
                notification={item}
                onMarkRead={handleMarkRead}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Notifications;