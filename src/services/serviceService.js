import { initTable, getTable } from "../utils/mockDb";
import rawServices from "../data/services.json";

const TABLE = "gc_services";

// Initialize the mock services table
initTable(TABLE, rawServices);

export const serviceService = {
  // Get all available OGC services
  getAll() {
    return getTable(TABLE);
  },

  // Get a specific service by ID
  getById(id) {
    return getTable(TABLE).find((service) => service.id === id);
  },

  // Get only active services
  getActiveServices() {
    return getTable(TABLE).filter(
      (service) => service.status === "Active"
    );
  },
};