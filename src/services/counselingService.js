import {
  initTable,
  getTable,
  saveTable,
} from "../utils/mockDb";

import rawRecords from "../data/counselingRecords.json";

const TABLE = "gc_counseling_records";

initTable(TABLE, rawRecords);

export const counselingService = {
  getAll: () => {
    return getTable(TABLE);
  },

  getById: (id) => {
    return getTable(TABLE).find(
      (record) => record.id === id
    );
  },

  getByStudent: (studentId) => {
    return getTable(TABLE).filter(
      (record) =>
        record.studentId === studentId
    );
  },

  getByCounselor: (counselorId) => {
    return getTable(TABLE).filter(
      (record) =>
        record.counselorId === counselorId
    );
  },

  create: (data) => {
    const records = getTable(TABLE);

    const newRecord = {
      id: `CR-${String(
        records.length + 1
      ).padStart(4, "0")}`,
      ...data,
    };

    saveTable(TABLE, [
      ...records,
      newRecord,
    ]);

    return newRecord;
  },

  update: (id, updates) => {
    const records = getTable(TABLE);

    const updatedRecords = records.map(
      (record) =>
        record.id === id
          ? {
              ...record,
              ...updates,
            }
          : record
    );

    saveTable(TABLE, updatedRecords);

    return updatedRecords.find(
      (record) => record.id === id
    );
  },
};