import {
  initTable,
  getTable,
  saveTable,
} from "../utils/mockDb";

import rawAppointments from "../data/appointments.json";

const TABLE = "gc_appointments";

initTable(TABLE, rawAppointments);

export const appointmentService = {
  getAll: () => {
    return getTable(TABLE);
  },

  getById: (id) => {
    return getTable(TABLE).find(
      (appointment) => appointment.id === id
    );
  },

  getByStudent: (studentId) => {
    return getTable(TABLE).filter(
      (appointment) =>
        appointment.studentId === studentId
    );
  },

  getByDate: (date) => {
    return getTable(TABLE).filter(
      (appointment) =>
        appointment.date === date
    );
  },

  getByStatus: (status) => {
    return getTable(TABLE).filter(
      (appointment) =>
        appointment.status === status
    );
  },

  create: (data) => {
    const appointments = getTable(TABLE);

    const newAppointment = {
      id: `APT-${String(
        appointments.length + 1
      ).padStart(4, "0")}`,
      ...data,
    };

    saveTable(TABLE, [
      ...appointments,
      newAppointment,
    ]);

    return newAppointment;
  },

  update: (id, updates) => {
    const appointments = getTable(TABLE);

    const updatedAppointments =
      appointments.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              ...updates,
            }
          : appointment
      );

    saveTable(TABLE, updatedAppointments);

    return updatedAppointments.find(
      (appointment) =>
        appointment.id === id
    );
  },

  cancel: (id) => {
    return appointmentService.update(
      id,
      { status: "Cancelled" }
    );
  },
};