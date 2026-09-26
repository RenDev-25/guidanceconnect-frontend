import { initTable, getTable, saveTable } from "../utils/mockDb";
import rawStudents from "../data/students.json";

const TABLE = "gc_students";

initTable(TABLE, rawStudents);

export const studentService = {
  getAll: () => {
    return getTable(TABLE);
  },

  getById: (id) => {
    return getTable(TABLE).find(
      (student) => student.id === id
    );
  },

  getByProgram: (program) => {
    return getTable(TABLE).filter(
      (student) => student.program === program
    );
  },

  getByStatus: (status) => {
    return getTable(TABLE).filter(
      (student) => student.status === status
    );
  },

  updateStatus: (id, newStatus) => {
    const students = getTable(TABLE);

    const updatedStudents = students.map((student) =>
      student.id === id
        ? { ...student, status: newStatus }
        : student
    );

    saveTable(TABLE, updatedStudents);

    return updatedStudents.find(
      (student) => student.id === id
    );
  },
};