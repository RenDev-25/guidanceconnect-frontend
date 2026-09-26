import { requestService } from "./requestService";
import { appointmentService } from "./appointmentService";
import { goodMoralService } from "./goodMoralService";
import { counselingService } from "./counselingService";

export const analyticsService = {
  getRequestAnalytics: () => {
    const requests = requestService.getAll();

    const total = requests.length;

    const pending = requests.filter(
      (request) =>
        request.status === "Pending"
    ).length;

    const inProgress = requests.filter(
      (request) =>
        request.status === "In Progress"
    ).length;

    const approved = requests.filter(
      (request) =>
        request.status === "Approved"
    ).length;

    const rejected = requests.filter(
      (request) =>
        request.status === "Rejected"
    ).length;

    const completed = requests.filter(
      (request) =>
        request.status === "Completed"
    ).length;

    const completionRate =
      total > 0
        ? (completed / total) * 100
        : 0;

    return {
      total,
      pending,
      inProgress,
      approved,
      rejected,
      completed,
      completionRate:
        Number(completionRate.toFixed(2)),
    };
  },

  getAppointmentAnalytics: () => {
    const appointments =
      appointmentService.getAll();

    const total = appointments.length;

    const scheduled = appointments.filter(
      (appointment) =>
        appointment.status === "Scheduled"
    ).length;

    const completed = appointments.filter(
      (appointment) =>
        appointment.status === "Completed"
    ).length;

    const cancelled = appointments.filter(
      (appointment) =>
        appointment.status === "Cancelled"
    ).length;

    return {
      total,
      scheduled,
      completed,
      cancelled,
    };
  },

  getGoodMoralAnalytics: () => {
    const requests =
      goodMoralService.getAll();

    return {
      total: requests.length,

      pending: requests.filter(
        (request) =>
          request.status === "Pending"
      ).length,

      processing: requests.filter(
        (request) =>
          request.status === "In Progress"
      ).length,

      completed: requests.filter(
        (request) =>
          request.status === "Completed"
      ).length,

      rejected: requests.filter(
        (request) =>
          request.status === "Rejected"
      ).length,
    };
  },

  getCounselingAnalytics: () => {
    const records =
      counselingService.getAll();

    return {
      totalSessions: records.length,

      completed: records.filter(
        (record) =>
          record.status === "Completed"
      ).length,

      scheduled: records.filter(
        (record) =>
          record.status === "Scheduled"
      ).length,
    };
  },

  getDashboardAnalytics: () => {
    return {
      requests:
        analyticsService.getRequestAnalytics(),

      appointments:
        analyticsService.getAppointmentAnalytics(),

      goodMoral:
        analyticsService.getGoodMoralAnalytics(),

      counseling:
        analyticsService.getCounselingAnalytics(),
    };
  },
};