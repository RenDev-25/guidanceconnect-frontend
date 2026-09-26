import React, { useState } from "react";
import {
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <div className="profile-menu">
      <button
        type="button"
        className="profile-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="profile-avatar">
          {user?.name
            ? user.name.charAt(0).toUpperCase()
            : "U"}
        </div>

        <div className="profile-info d-none d-sm-block">
          <strong>{user?.name || "User"}</strong>

          <small>
            {user?.role
              ? user.role.charAt(0).toUpperCase() +
                user.role.slice(1)
              : "User"}
          </small>
        </div>

        <FaChevronDown className="profile-chevron" />
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <button
            type="button"
            className="dropdown-item"
          >
            <FaUser />
            <span>Profile</span>
          </button>

          <div className="dropdown-divider" />

          <button
            type="button"
            className="dropdown-item logout-item"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;