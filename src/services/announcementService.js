let mockAnnouncements = [
  {
    id: 1,
    category: 'Events',
    title: 'Mental Health Awareness Month',
    content: 'Join us for a series of seminars and wellness activities starting next week at the CICS building.',
    date: '2026-09-28'
  },
  {
    id: 2,
    category: 'Deadlines',
    title: 'Good Moral Certificate Cutoff',
    content: 'The deadline for requesting Good Moral Certificates for this semester is October 15, 2026.',
    date: '2026-09-25'
  },
  {
    id: 3,
    category: 'General',
    title: 'New OGC Office Hours',
    content: 'Starting October, the Office of Guidance and Counseling will be open from 8:00 AM to 6:00 PM.',
    date: '2026-09-20'
  }
];

export const announcementService = {
  getAll: () => {
    return mockAnnouncements;
  },

  getById: (id) => {
    return mockAnnouncements.find(a => a.id === id);
  }
};