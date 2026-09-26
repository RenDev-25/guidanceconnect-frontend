import {
  initTable,
  getTable,
  saveTable,
} from "../utils/mockDb";

import rawRequests from "../data/goodMoralRequests.json";

const TABLE = "gc_good_moral_requests";

initTable(TABLE, rawRequests);

export const goodMoralService = {
  getAll: () => {
    return getTable(TABLE);
  },

  getById: (id) => {
    return getTable(TABLE).find(
      (request) => request.id === id
    );
  },

  getByStudent: (studentId) => {
    return getTable(TABLE).filter(
      (request) =>
        request.studentId === studentId
    );
  },

  getByStatus: (status) => {
    return getTable(TABLE).filter(
      (request) =>
        request.status === status
    );
  },

  create: (data) => {
    const requests = getTable(TABLE);

    const newRequest = {
      id: `GMR-${String(
        requests.length + 1
      ).padStart(4, "0")}`,
      ...data,
    };

    saveTable(TABLE, [
      ...requests,
      newRequest,
    ]);

    return newRequest;
  },

  updateStatus: (id, status) => {
    const requests = getTable(TABLE);

    const updatedRequests =
      requests.map((request) =>
        request.id === id
          ? { ...request, status }
          : request
      );

    saveTable(TABLE, updatedRequests);

    return updatedRequests.find(
      (request) => request.id === id
    );
  },
};