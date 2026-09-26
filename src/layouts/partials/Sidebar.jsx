
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaClipboardList,
  FaCalendarAlt,
  FaComments,
  FaFileAlt,
  FaUsers,
  FaChartBar,
  FaUserCog,
  FaCog,
  FaTimes,
} from "react-icons/fa";

const iconMap = {
  FaHome,
  FaClipboardList,
  FaCalendarAlt,
  FaComments,
  FaFileAlt,
  FaUsers,
  FaChartBar,
  FaUserCog,
  FaCog,
};

function Sidebar({ navItems, isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay d-md-none"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar ${
          isOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-header">
            <div className="sidebar-brand">
                <div className="brand-logo">
                <img
                    src="/images/ogc-logo.png"
                    alt="BatStateU Guidance and Counseling Office Logo"
                />
                </div>

                <div>
                <h5 className="mb-0">Guidance Office</h5>
                <small>BatStateU</small>
                </div>
            </div>

            <button
                type="button"
                className="sidebar-close d-md-none"
                onClick={onClose}
                aria-label="Close navigation"
            >
                <FaTimes />
            </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                {Icon && <Icon className="sidebar-icon" />}

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <small>Guidance & Counseling System</small>
          <small>© 2026 BatStateU</small>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;