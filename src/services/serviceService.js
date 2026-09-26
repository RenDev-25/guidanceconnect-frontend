import { initTable, getTable } from "../utils/mockDb";
import rawServices from "../data/services.json";

const TABLE = "gc_services";

initTable(TABLE, rawServices);

export const serviceService = {
  getAll: () => {
    return getTable(TABLE);
  },

  getById: (id) => {
    return getTable(TABLE).find(
      (service) => service.id === id
    );
  },

  getByCategory: (category) => {
    return getTable(TABLE).filter(
      (service) => service.category === category
    );
  },

  getActiveServices: () => {
    return getTable(TABLE).filter(
      (service) => service.status === "Active"
    );
  },
};