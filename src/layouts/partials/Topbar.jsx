import React from "react";
import { FaBars } from "react-icons/fa";
import NotificationBell from "./NotificationBell";
import ProfileMenu from "./ProfileMenu";
import Breadcrumbs from "./Breadcrumbs";

function Topbar({
  title = "Dashboard",
  onMenuClick,
}) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-menu-button d-md-none"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <FaBars />
        </button>

        <div className="topbar-heading">
          <h4>{title}</h4>

          <Breadcrumbs />
        </div>
      </div>

      <div className="topbar-actions">
        <NotificationBell />
        <ProfileMenu />
      </div>
    </header>
  );
}

export default Topbar;