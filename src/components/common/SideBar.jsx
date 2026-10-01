import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaHome, FaClipboardList, FaFileAlt, FaCalendarAlt, 
  FaComments, FaUsers, FaBell, FaChartBar, FaUserCog, FaCog,
  FaShareSquare, FaTasks, FaBriefcase, FaCalendarPlus, 
  FaBullhorn, FaLightbulb, FaRobot, FaHistory,
  FaSignOutAlt 
} from 'react-icons/fa';

const iconMap = {
  FaHome: <FaHome />,
  FaClipboardList: <FaClipboardList />,
  FaFileAlt: <FaFileAlt />,
  FaCalendarAlt: <FaCalendarAlt />,
  FaComments: <FaComments />,
  FaUsers: <FaUsers />,
  FaBell: <FaBell />,
  FaChartBar: <FaChartBar />,
  FaUserCog: <FaUserCog />,
  FaCog: <FaCog />,
  FaShareSquare: <FaShareSquare />,
  FaTasks: <FaTasks />,
  FaBriefcase: <FaBriefcase />,
  FaCalendarPlus: <FaCalendarPlus />,
  FaBullhorn: <FaBullhorn />,
  FaLightbulb: <FaLightbulb />,
  FaRobot: <FaRobot />,
  FaHistory: <FaHistory />
};

const Sidebar = ({ navItems = [] }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark min-vh-100" style={{ width: '260px' }}>
      <div className="d-flex align-items-center mb-3 text-white text-decoration-none px-2">
        <span className="fs-5 fw-bold">Guidance System</span>
      </div>
      <hr className="my-2" />
      <ul className="nav nav-pills flex-column mb-auto overflow-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
        {navItems.map((item, index) => (
          <li className="nav-item mb-1" key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 text-white ${
                  isActive ? 'active bg-primary' : 'link-light'
                }`
              }
            >
              <span className="fs-6">{iconMap[item.icon] || <FaHome />}</span>
              <span className="small">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <hr className="my-2" />
      <div className="pt-2">
        <button 
          onClick={handleLogout} 
          className="btn btn-outline-light btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;