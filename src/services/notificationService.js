import {
  initTable,
  getTable,
  saveTable,
} from "../utils/mockDb";

import rawNotifications from "../data/notifications.json";

const TABLE = "gc_notifications";

initTable(TABLE, rawNotifications);

export const notificationService = {
  getAll: () => {
    return getTable(TABLE);
  },

  getById: (id) => {
    return getTable(TABLE).find(
      (notification) =>
        notification.id === id
    );
  },

  getByUser: (userId) => {
    return getTable(TABLE).filter(
      (notification) =>
        notification.userId === userId
    );
  },

  getUnreadByUser: (userId) => {
    return getTable(TABLE).filter(
      (notification) =>
        notification.userId === userId &&
        !notification.isRead
    );
  },

  markAsRead: (id) => {
    const notifications = getTable(TABLE);

    const updatedNotifications =
      notifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              isRead: true,
            }
          : notification
      );

    saveTable(
      TABLE,
      updatedNotifications
    );

    return updatedNotifications.find(
      (notification) =>
        notification.id === id
    );
  },
};