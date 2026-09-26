import React from "react";
import { FaBell } from "react-icons/fa";

function NotificationBell() {
  const notificationCount = 3;

  return (
    <button
      type="button"
      className="notification-button"
      aria-label="Notifications"
    >
      <FaBell />

      {notificationCount > 0 && (
        <span className="notification-badge">
          {notificationCount}
        </span>
      )}
    </button>
  );
}

export default NotificationBell;