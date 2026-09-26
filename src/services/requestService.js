import {
  initTable,
  getTable,
  saveTable,
} from "../utils/mockDb";

import rawRequests from "../data/requests.json";

const TABLE = "gc_requests";

initTable(TABLE, rawRequests);

export const requestService = {
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
      (request) => request.studentId === studentId
    );
  },

  getByStatus: (status) => {
    return getTable(TABLE).filter(
      (request) => request.status === status
    );
  },

  create: (data) => {
    const requests = getTable(TABLE);

    const newRequest = {
      id: `REQ-${String(requests.length + 1).padStart(4, "0")}`,
      ...data,
    };

    const updatedRequests = [
      ...requests,
      newRequest,
    ];

    saveTable(TABLE, updatedRequests);

    return newRequest;
  },

  updateStatus: (id, status) => {
    const requests = getTable(TABLE);

    const updatedRequests = requests.map((request) =>
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