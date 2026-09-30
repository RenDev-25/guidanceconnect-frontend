import React, { useState, useEffect } from 'react';
import NotificationItem from '../../components/common/NotificationItem';
import Button from '../../components/common/Button';
import { notificationService } from '../../services/notificationService';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Assuming notificationService can filter by role or pull facilitator-specific alerts
    const fetchNotifications = () => {
      const allNotifs = notificationService.getAll() || [];
      // Mock filter: In a real app, this filters by facilitator ID or role
      const facilitatorNotifs = allNotifs.filter(n => n.targetRole === 'facilitator' || !n.targetRole);
      setNotifications(facilitatorNotifs);
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = (id) => {
    notificationService.markAsRead(id);
    // Optimistic UI update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    notifications.forEach(n => notificationService.markAsRead(n.id));
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <p className="text-gray-500">You have {unreadCount} unread alerts</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 divide-y divide-gray-100">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <NotificationItem 
              key={notif.id} 
              notification={notif} 
              onMarkAsRead={() => handleMarkAsRead(notif.id)} 
            />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            No new notifications.
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;