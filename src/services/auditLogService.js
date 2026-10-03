
import { initTable, getTable, saveTable } from "../utils/mockDb";
import initialAuditLogs from "../data/auditLog.json";

const TABLE = "gc_audit_logs";

initTable(TABLE, initialAuditLogs);

const normalizeLogs = (data) => {
  if (Array.isArray(data)) return data;
  return data ? [data] : [];
};

export const auditLogService = {
  getAll() {
    return normalizeLogs(getTable(TABLE)).sort(
      (a, b) =>
        new Date(b.timestamp || 0).getTime() -
        new Date(a.timestamp || 0).getTime()
    );
  },

  log(userId, action) {
    const logs = normalizeLogs(getTable(TABLE));

    const newLog = {
      id: `AUD-${Date.now()}`,
      userId: String(userId || "UNKNOWN"),
      action: String(action || "Unspecified action"),
      timestamp: new Date().toISOString(),
      ipAddress: "127.0.0.1",
    };

    saveTable(TABLE, [newLog, ...logs]);

    return newLog;
  },
};
