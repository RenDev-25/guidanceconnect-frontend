
let mockNotifications = [
  {
    id: 1,
    userId: 'STU-001',
    type: 'success',
    title: 'Request Approved',
    message: 'Your Good Moral Request has been approved.',
    isRead: false,
    date: '2 Hours ago',
  },
  {
    id: 2,
    userId: 'STU-001',
    type: 'info',
    title: 'Appointment Reminder',
    message: 'You have a counseling session tomorrow at 10:00 AM.',
    isRead: false,
    date: '1 Day ago',
  },
  {
    id: 3,
    userId: 'STU-001',
    type: 'warning',
    title: 'Missing Document',
    message: 'Please upload your ID for the clearance request.',
    isRead: true,
    date: '3 Days ago',
  },
];

export const notificationService = {
  // Return all notifications
  getAll: () => {
    return [...mockNotifications];
  },

  // Return notifications belonging to a specific user
  getByUser: (userId) => {
    return mockNotifications.filter(
      (notification) => notification.userId === userId
    );
  },

  // Mark one notification as read
  markAsRead: (id) => {
    mockNotifications = mockNotifications.map((notification) =>
      notification.id === id
        ? { ...notification, isRead: true }
        : notification
    );
  },

  // Mark all notifications for a specific user as read
  markAllAsRead: (userId) => {
    mockNotifications = mockNotifications.map((notification) =>
      notification.userId === userId
        ? { ...notification, isRead: true }
        : notification
    );
  },
};
