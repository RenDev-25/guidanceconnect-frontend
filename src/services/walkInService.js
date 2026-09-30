import { initTable, getTable, saveTable } from "../utils/mockDb";
import rawWalkIns from "../data/walkIns.json";

const TABLE = "gc_walk_ins";
initTable(TABLE, rawWalkIns);

export const walkInService = {
  getAll: () => getTable(TABLE).filter((w) => w.status === "Waiting"),
  getAllIncludingServed: () => getTable(TABLE),
  callNext: () => {
    const queue = getTable(TABLE).filter((w) => w.status === "Waiting");
    if (queue.length === 0) return null;
    const next = queue[0];
    const updated = getTable(TABLE).map((w) =>
      w.id === next.id ? { ...w, status: "Serving" } : w
    );
    saveTable(TABLE, updated);
    return next;
  },
  markServed: (id) => {
    const updated = getTable(TABLE).map((w) =>
      w.id === id ? { ...w, status: "Served" } : w
    );
    saveTable(TABLE, updated);
  },
  addWalkIn: (data) => {
    const table = getTable(TABLE);
    const newEntry = {
      id: `WLK-${String(table.length + 1).padStart(4, "0")}`,
      status: "Waiting",
      ...data,
    };
    saveTable(TABLE, [...table, newEntry]);
    return newEntry;
  },
};