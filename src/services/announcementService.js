import {
  initTable,
  getTable,
  saveTable,
} from "../utils/mockDb";

import rawAnnouncements from "../data/announcements.json";

const TABLE = "gc_announcements";

initTable(TABLE, rawAnnouncements);

export const announcementService = {
  getAll: () => {
    return getTable(TABLE);
  },

  getById: (id) => {
    return getTable(TABLE).find(
      (announcement) =>
        announcement.id === id
    );
  },

  getPublished: () => {
    return getTable(TABLE).filter(
      (announcement) =>
        announcement.status === "Published"
    );
  },

  getByAudience: (audience) => {
    return getTable(TABLE).filter(
      (announcement) =>
        announcement.audience === audience ||
        announcement.audience === "All"
    );
  },

  create: (data) => {
    const announcements =
      getTable(TABLE);

    const newAnnouncement = {
      id: `ANN-${String(
        announcements.length + 1
      ).padStart(4, "0")}`,
      ...data,
    };

    saveTable(TABLE, [
      ...announcements,
      newAnnouncement,
    ]);

    return newAnnouncement;
  },

  update: (id, updates) => {
    const announcements =
      getTable(TABLE);

    const updatedAnnouncements =
      announcements.map(
        (announcement) =>
          announcement.id === id
            ? {
                ...announcement,
                ...updates,
              }
            : announcement
      );

    saveTable(
      TABLE,
      updatedAnnouncements
    );

    return updatedAnnouncements.find(
      (announcement) =>
        announcement.id === id
    );
  },
};