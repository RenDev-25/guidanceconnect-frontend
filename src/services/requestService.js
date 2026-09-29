import {
  initTable,
  getTable,
  saveTable,
} from "../utils/mockDb";

import rawRequests from "../data/requests.json";

const TABLE = "gc_requests";

initTable(TABLE, rawRequests);

const getRequests = () => {
  const records = getTable(TABLE);

  return Array.isArray(records) ? records : [];
};

export const requestService = {
  getAll: () => {
    return getRequests();
  },

  getById: (id) => {
    const records = getRequests();

    return records.find(
      (request) => request.id === id
    );
  },

  getByStudent: (studentId) => {
    const records = getRequests();

    return records.filter(
      (request) => request.studentId === studentId
    );
  },

  getByStatus: (status) => {
    const records = getRequests();

    return records.filter(
      (request) => request.status === status
    );
  },

  create: (data) => {
    const requests = getRequests();

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
    const requests = getRequests();

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