import {
  initTable,
  getTable,
  saveTable,
} from "../utils/mockDb";

import rawCareerServices from "../data/careerServices.json";

const TABLE = "gc_career_services";

initTable(TABLE, rawCareerServices);

export const careerService = {
  getAll: () => {
    return getTable(TABLE);
  },

  getById: (id) => {
    return getTable(TABLE).find(
      (service) => service.id === id
    );
  },

  getByStudent: (studentId) => {
    return getTable(TABLE).filter(
      (service) =>
        service.studentId === studentId
    );
  },

  getByType: (serviceType) => {
    return getTable(TABLE).filter(
      (service) =>
        service.serviceType === serviceType
    );
  },

  getByStatus: (status) => {
    return getTable(TABLE).filter(
      (service) =>
        service.status === status
    );
  },

  create: (data) => {
    const services = getTable(TABLE);

    const newService = {
      id: `CAR-${String(
        services.length + 1
      ).padStart(4, "0")}`,
      ...data,
    };

    saveTable(TABLE, [
      ...services,
      newService,
    ]);

    return newService;
  },

  updateStatus: (id, status) => {
    const services = getTable(TABLE);

    const updatedServices =
      services.map((service) =>
        service.id === id
          ? {
              ...service,
              status,
            }
          : service
      );

    saveTable(TABLE, updatedServices);

    return updatedServices.find(
      (service) =>
        service.id === id
    );
  },
};