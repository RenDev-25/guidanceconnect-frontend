let mockNotifications = [
  {
    id: 1,
    userId: 'STU-001',
    type: 'success',
    title: 'Request Approved',
    message: 'Your Good Moral Request has been approved.',
    isRead: false,
    date: '2 Hours ago'
  },
  {
    id: 2,
    userId: 'STU-001',
    type: 'info',
    title: 'Appointment Reminder',
    message: 'You have a counseling session tomorrow at 10:00 AM.',
    isRead: false,
    date: '1 Day ago'
  },
  {
    id: 3,
    userId: 'STU-001',
    type: 'warning',
    title: 'Missing Document',
    message: 'Please upload your ID for the clearance request.',
    isRead: true,
    date: '3 Days ago'
  }
];

export const notificationService = {
  getByUser: (userId) => {
    return mockNotifications.filter(n => n.userId === userId);
  },
  
  markAsRead: (id) => {
    mockNotifications = mockNotifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
  },

  markAllAsRead: (userId) => {
    mockNotifications = mockNotifications.map(n => 
      n.userId === userId ? { ...n, isRead: true } : n
    );
  }
};