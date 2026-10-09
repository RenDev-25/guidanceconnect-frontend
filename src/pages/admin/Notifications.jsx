
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
    const timer = setTimeout(() => {
      setNotifications(
        notificationService.getByUser(CURRENT_STUDENT_ID) || []
      );
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleMarkRead = (id) => {
    notificationService.markAsRead(id);
    setNotifications(
      notificationService.getByUser(CURRENT_STUDENT_ID) || []
    );
  };

  const handleMarkAllRead = () => {
    notifications
      .filter((notification) => !notification.isRead)
      .forEach((notification) => {
        notificationService.markAsRead(notification.id);
      });

    setNotifications(
      notificationService.getByUser(CURRENT_STUDENT_ID) || []
    );
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div className="container-fluid py-3 py-md-4 responsive-list-page">
      <div className="responsive-page-heading notifications-heading">
        <div>
          <h3 className="fw-bold mb-1">Notifications</h3>
          <p className="text-muted mb-0">
            Stay updated on your requests and appointments.
          </p>
        </div>

        {!loading && unreadCount > 0 && (
          <Button
            variant="outline-primary"
            size="sm"
            className="mark-all-read-button"
            onClick={handleMarkAllRead}
          >
            Mark All as Read ({unreadCount})
          </Button>
        )}
      </div>

      <Card className="responsive-list-card">
        {loading ? (
          <LoadingState message="Loading notifications..." />
        ) : notifications.length === 0 ? (
          <EmptyState
            message="You have no notifications."
            icon="bi-bell-slash"
          />
        ) : (
          <div className="list-group list-group-flush notification-list">
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
