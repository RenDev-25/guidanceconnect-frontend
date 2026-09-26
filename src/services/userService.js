import { initTable, getTable } from "../utils/mockDb";
import rawUsers from "../data/users.json";

const TABLE = "gc_users";

initTable(TABLE, rawUsers);

export const userService = {
  getAll: () => {
    return getTable(TABLE);
  },

  getById: (id) => {
    return getTable(TABLE).find(
      (user) => user.id === id
    );
  },

  getByRole: (role) => {
    return getTable(TABLE).filter(
      (user) => user.role === role
    );
  },

  getUserByStudentId: (studentId) => {
    return getTable(TABLE).find(
      (user) => user.studentId === studentId
    );
  },

  getActiveUsers: () => {
    return getTable(TABLE).filter(
      (user) => user.status === "Active"
    );
  },
};