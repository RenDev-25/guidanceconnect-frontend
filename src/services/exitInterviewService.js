
import { initTable, getTable, saveTable } from "../utils/mockDb";

const TABLE = "gc_exit_interviews";

initTable(TABLE, []);

const normalizeRecords = (data) => {
  if (Array.isArray(data)) return data;
  return data ? [data] : [];
};

export const exitInterviewService = {
  getAll() {
    return normalizeRecords(getTable(TABLE));
  },

  create(record) {
    const records = normalizeRecords(getTable(TABLE));

    const newRecord = {
      ...record,
      id: record.id || `EXIT-${Date.now()}`,
    };

    saveTable(TABLE, [newRecord, ...records]);

    return newRecord;
  },
};
