
import { useEffect, useState } from 'react';

import { requestService } from '../services/requestService';
import { appointmentService } from '../services/appointmentService';
import { documentService } from '../services/documentService';
import { followUpService } from '../services/followUpService';
import { walkInService } from '../services/walkInService';

const LOADING_DELAY = 800;

const ACTIVE_REQUEST_STATUSES = [
  'Pending',
  'In Progress',
  'Processing',
];

const ACTIVE_APPOINTMENT_STATUSES = [
  'Pending',
  'Confirmed',
  'Scheduled',
];

const PENDING_DOCUMENT_STATUSES = [
  'Pending',
  'Submitted',
  'For Verification',
  'Under Review',
];

const COMPLETED_FOLLOW_UP_STATUSES = [
  'Completed',
  'Cancelled',
];

const TERMINAL_APPOINTMENT_STATUSES = [
  'Completed',
  'Cancelled',
  'No-Show',
];

const getToday = () => {
  const today = new Date();

  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');
};

// Normalize demo IDs such as STU-001 and STU-0001.
const normalizeStudentId = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  const id = String(value).trim().toUpperCase();
  const match = id.match(/^STU-0*(\d+)$/);

  return match
    ? `STU-${Number(match[1])}`
    : id;
};

const belongsToStudent = (record, studentId) => {
  return (
    normalizeStudentId(record?.studentId) ===
    normalizeStudentId(studentId)
  );
};

// Read date-only strings without changing their calendar date.
const getDateKey = (value) => {
  if (!value) {
    return '';
  }

  const text = String(value);

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
};

const isUpcomingAppointment = (appointment) => {
  const appointmentDate = getDateKey(appointment.date);

  return (
    appointmentDate >= getToday() &&
    ACTIVE_APPOINTMENT_STATUSES.includes(
      appointment.status
    )
  );
};

const isOverdueFollowUp = (followUp) => {
  const dueDate = getDateKey(
    followUp?.dueDate || followUp?.scheduledDate
  );

  if (!dueDate) {
    return false;
  }

  if (
    COMPLETED_FOLLOW_UP_STATUSES.includes(
      followUp.status
    )
  ) {
    return false;
  }

  return dueDate < getToday();
};

const sortByDateDescending = (
  records,
  fields = ['dateSubmitted']
) => {
  return [...records].sort((a, b) => {
    const aDate =
      fields.map((field) => a?.[field]).find(Boolean) || '';

    const bDate =
      fields.map((field) => b?.[field]).find(Boolean) || '';

    return (
      new Date(bDate || 0).getTime() -
      new Date(aDate || 0).getTime()
    );
  });
};

const sortByDateAscending = (
  records,
  fields = ['date', 'time']
) => {
  return [...records].sort((a, b) => {
    const aDate = new Date(
      `${a?.[fields[0]] || ''} ${a?.[fields[1]] || ''}`
    ).getTime();

    const bDate = new Date(
      `${b?.[fields[0]] || ''} ${b?.[fields[1]] || ''}`
    ).getTime();

    return (
      (Number.isNaN(aDate) ? Infinity : aDate) -
      (Number.isNaN(bDate) ? Infinity : bDate)
    );
  });
};

const getStudentStats = (studentId) => {
  const requests = requestService
    .getByStudent(studentId)
    .filter((request) =>
      belongsToStudent(request, studentId)
    );

  const appointments = appointmentService
    .getAll()
    .filter((appointment) =>
      belongsToStudent(appointment, studentId)
    );

  const documents = documentService
    .getAll()
    .filter((document) =>
      belongsToStudent(document, studentId)
    );

  const upcomingAppointments = appointments.filter(
    isUpcomingAppointment
  );

  const recentActivity = sortByDateDescending(
    requests,
    ['dateSubmitted', 'createdAt']
  ).slice(0, 5);

  const nextAppointment =
    sortByDateAscending(upcomingAppointments)[0] || null;

  return {
    activeRequests: requests.filter((request) =>
      ACTIVE_REQUEST_STATUSES.includes(request.status)
    ).length,

    upcomingAppointments: upcomingAppointments.length,

    pendingDocuments: documents.filter((document) =>
      PENDING_DOCUMENT_STATUSES.includes(document.status)
    ).length,

    completedServices: requests.filter(
      (request) => request.status === 'Completed'
    ).length,

    nextAppointment,
    recentActivity,
  };
};

const getFacilitatorStats = () => {
  const requests = requestService.getAll();
  const documents = documentService.getAll();
  const appointments = appointmentService.getAll();
  const walkIns = walkInService.getAll();
  const today = getToday();

  const pendingRequests = requests.filter(
    (request) => request.status === 'Pending'
  );

  const priorityOrder = {
    Urgent: 0,
    High: 1,
    Normal: 2,
    Low: 3,
  };

  const priorityQueue = [...pendingRequests]
    .sort((a, b) => {
      const priorityDifference =
        (priorityOrder[a.priority] ?? 2) -
        (priorityOrder[b.priority] ?? 2);

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return (
        new Date(a.dateSubmitted || 0).getTime() -
        new Date(b.dateSubmitted || 0).getTime()
      );
    })
    .slice(0, 5);

  return {
    pendingRequests: pendingRequests.length,

    documentsForVerification: documents.filter(
      (document) =>
        PENDING_DOCUMENT_STATUSES.includes(document.status)
    ).length,

    todayAppointments: appointments.filter(
      (appointment) =>
        getDateKey(appointment.date) === today &&
        ACTIVE_APPOINTMENT_STATUSES.includes(
          appointment.status
        )
    ).length,

    walkInQueueCount: walkIns.length,

    tasksRemaining: requests.filter((request) =>
      ['In Progress', 'Processing'].includes(
        request.status
      )
    ).length,

    priorityQueue,
  };
};

const getCounselorStats = () => {
  const requests = requestService.getAll();
  const appointments = appointmentService.getAll();
  const documents = documentService.getAll();
  const followUps = followUpService.getAll();
  const today = getToday();

  return {
    totalRequests: requests.length,

    pendingRequests: requests.filter(
      (request) =>
        ACTIVE_REQUEST_STATUSES.includes(request.status)
    ).length,

    todayAppointments: appointments.filter(
      (appointment) =>
        getDateKey(appointment.date) === today &&
        !TERMINAL_APPOINTMENT_STATUSES.includes(
          appointment.status
        )
    ).length,

    completedServices: requests.filter(
      (request) => request.status === 'Completed'
    ).length,

    pendingDocuments: documents.filter(
      (document) =>
        PENDING_DOCUMENT_STATUSES.includes(document.status)
    ).length,

    overdueFollowUps: followUps.filter(
      isOverdueFollowUp
    ).length,
  };
};

export const useDashboardStats = (
  role,
  userId = null
) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    setStats(null);

    const timer = setTimeout(() => {
      if (!isMounted) {
        return;
      }

      try {
        let computedStats = {};

        if (role === 'student') {
          computedStats = getStudentStats(userId);
        } else if (role === 'facilitator') {
          computedStats = getFacilitatorStats();
        } else if (
          role === 'counselor' ||
          role === 'admin'
        ) {
          computedStats = getCounselorStats();
        }

        setStats(computedStats);
      } catch (error) {
        console.error(
          'Failed to load dashboard statistics:',
          error
        );

        setStats({});
      } finally {
        setLoading(false);
      }
    }, LOADING_DELAY);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [role, userId]);

  return {
    stats,
    loading,
  };
};

export default useDashboardStats;
