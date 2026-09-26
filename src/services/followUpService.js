import {
  initTable,
  getTable,
  saveTable,
} from "../utils/mockDb";

import rawFollowUps from "../data/followUps.json";

const TABLE = "gc_follow_ups";

initTable(TABLE, rawFollowUps);

export const followUpService = {
  getAll: () => {
    return getTable(TABLE);
  },

  getById: (id) => {
    return getTable(TABLE).find(
      (followUp) => followUp.id === id
    );
  },

  getByStudent: (studentId) => {
    return getTable(TABLE).filter(
      (followUp) =>
        followUp.studentId === studentId
    );
  },

  getByStatus: (status) => {
    return getTable(TABLE).filter(
      (followUp) =>
        followUp.status === status
    );
  },

  create: (data) => {
    const followUps = getTable(TABLE);

    const newFollowUp = {
      id: `FUP-${String(
        followUps.length + 1
      ).padStart(4, "0")}`,
      ...data,
    };

    saveTable(TABLE, [
      ...followUps,
      newFollowUp,
    ]);

    return newFollowUp;
  },

  updateStatus: (id, status) => {
    const followUps = getTable(TABLE);

    const updatedFollowUps =
      followUps.map((followUp) =>
        followUp.id === id
          ? {
              ...followUp,
              status,
            }
          : followUp
      );

    saveTable(TABLE, updatedFollowUps);

    return updatedFollowUps.find(
      (followUp) =>
        followUp.id === id
    );
  },
};