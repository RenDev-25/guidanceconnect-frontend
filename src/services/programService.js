import {
  initTable,
  getTable,
  saveTable,
} from "../utils/mockDb";

import rawPrograms from "../data/programs.json";

const TABLE = "gc_programs";

initTable(TABLE, rawPrograms);

export const programService = {
  getAll: () => {
    return getTable(TABLE);
  },

  getById: (id) => {
    return getTable(TABLE).find(
      (program) => program.id === id
    );
  },

  getByCategory: (category) => {
    return getTable(TABLE).filter(
      (program) =>
        program.category === category
    );
  },

  getActivePrograms: () => {
    return getTable(TABLE).filter(
      (program) =>
        program.status === "Active"
    );
  },

  create: (data) => {
    const programs = getTable(TABLE);

    const newProgram = {
      id: `PRG-${String(
        programs.length + 1
      ).padStart(4, "0")}`,
      ...data,
    };

    saveTable(TABLE, [
      ...programs,
      newProgram,
    ]);

    return newProgram;
  },

  update: (id, updates) => {
    const programs = getTable(TABLE);

    const updatedPrograms =
      programs.map((program) =>
        program.id === id
          ? {
              ...program,
              ...updates,
            }
          : program
      );

    saveTable(TABLE, updatedPrograms);

    return updatedPrograms.find(
      (program) => program.id === id
    );
  },
};