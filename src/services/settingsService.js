import { initTable, getTable, saveTable } from "../utils/mockDb";

const TABLE = "gc_settings";
const DEFAULTS = { 
  pendingRequestThreshold: 10, 
  completionRateThreshold: 50, 
  cancelledAppointmentThreshold: 5, 
  pendingGoodMoralThreshold: 5 
};

initTable(TABLE, DEFAULTS);

export const settingsService = {
  get: () => getTable(TABLE),
  update: (updates) => {
    const current = getTable(TABLE);
    const merged = { ...current, ...updates };
    saveTable(TABLE, merged);
    return merged;
  },
};