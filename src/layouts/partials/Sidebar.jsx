
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaClipboardList,
  FaComments,
  FaFileAlt,
  FaCalendarAlt,
  FaCalendarPlus,
  FaFileUpload,
  FaTasks,
  FaHistory,
  FaUser,
  FaBell,
  FaBullhorn,
  FaRobot,
  FaUsers,
  FaUserGraduate,
  FaChartBar,
  FaShareAlt,
  FaBriefcase,
  FaClipboardCheck,
  FaLightbulb,
  FaUserCog,
  FaCog,
} from "react-icons/fa";

const iconMap = {
  FaHome,
  FaClipboardList,
  FaComments,
  FaFileAlt,
  FaCalendarAlt,
  FaCalendarPlus,
  FaFileUpload,
  FaTasks,
  FaHistory,
  FaUser,
  FaBell,
  FaBullhorn,
  FaRobot,
  FaUsers,
  FaUserGraduate,
  FaChartBar,
  FaShareAlt,
  FaBriefcase,
  FaClipboardCheck,
  FaLightbulb,
  FaUserCog,
  FaCog,
};

export default function Sidebar({ navItems = [], sidebarOpen = true }) {
  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <nav className="sidebar-nav">
        {navItems.map((section, sectionIndex) => {
          // Support both grouped navigation and older flat entries.
          const grouped = Array.isArray(section.items);
          const items = grouped ? section.items : [section];

          return (
            <div className="sidebar-nav-group" key={section.section || section.path || sectionIndex}>
              {grouped && section.section && (
                <div className="sidebar-section-heading">
                  {section.section}
                </div>
              )}

              {items.map((item) => {
                const Icon = iconMap[item.icon];

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `sidebar-link${isActive ? " active" : ""}`
                    }
                    title={item.label}
                  >
                    {Icon && <Icon className="sidebar-link-icon" />}
                    <span className="sidebar-link-label">
                      {item.label}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
