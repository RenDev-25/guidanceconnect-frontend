
export const studentNav = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", path: "/student/dashboard", icon: "FaHome" },
    ],
  },
  {
    section: "Services",
    items: [
      { label: "Service Requests", path: "/student/service-request", icon: "FaClipboardList" },
      { label: "Counseling Request", path: "/student/counseling-request", icon: "FaComments" },
      { label: "Good Moral Request", path: "/student/good-moral-request", icon: "FaFileAlt" },
      { label: "Appointments", path: "/student/appointments", icon: "FaCalendarAlt" },
      { label: "Appointment Calendar", path: "/student/appointment-calendar", icon: "FaCalendarPlus" },
      { label: "Document Upload", path: "/student/document-upload", icon: "FaFileUpload" },
    ],
  },
  {
    section: "My Records",
    items: [
      { label: "Request Tracking", path: "/student/request-tracking", icon: "FaTasks" },
      { label: "Service History", path: "/student/service-history", icon: "FaHistory" },
      { label: "Profile", path: "/student/profile", icon: "FaUser" },
    ],
  },
  {
    section: "Updates and Support",
    items: [
      { label: "Notifications", path: "/student/notifications", icon: "FaBell" },
      { label: "Announcements", path: "/student/announcements", icon: "FaBullhorn" },
      { label: "AI Assistant", path: "/student/ai-assistant", icon: "FaRobot" },
    ],
  },
];

export const facilitatorNav = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", path: "/facilitator/dashboard", icon: "FaHome" },
    ],
  },
  {
    section: "Daily Operations",
    items: [
      { label: "Request Queue", path: "/facilitator/requests", icon: "FaClipboardList" },
      { label: "Document Verification", path: "/facilitator/document-verification", icon: "FaFileAlt" },
      { label: "Appointments", path: "/facilitator/appointments", icon: "FaCalendarAlt" },
      { label: "Walk-In Queue", path: "/facilitator/walk-in-queue", icon: "FaUsers" },
      { label: "Counseling Records", path: "/facilitator/counseling", icon: "FaComments" },
      { label: "Student Records", path: "/facilitator/students", icon: "FaUserGraduate" },
    ],
  },
  {
    section: "Updates",
    items: [
      { label: "Notifications", path: "/facilitator/notifications", icon: "FaBell" },
    ],
  },
];

export const adminNav = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", path: "/admin/dashboard", icon: "FaHome" },
      { label: "AI Insights", path: "/admin/ai-insights", icon: "FaChartBar" },
    ],
  },
  {
    section: "Requests and Appointments",
    items: [
      { label: "Service Requests", path: "/admin/requests", icon: "FaClipboardList" },
      { label: "Good Moral Requests", path: "/admin/good-moral", icon: "FaFileAlt" },
      { label: "Appointments", path: "/admin/appointments", icon: "FaCalendarAlt" },
    ],
  },
  {
    section: "Student Support",
    items: [
      { label: "Counseling", path: "/admin/counseling", icon: "FaComments" },
      { label: "Referrals", path: "/admin/referrals", icon: "FaShareAlt" },
      { label: "Follow-Ups", path: "/admin/follow-ups", icon: "FaTasks" },
      { label: "Career Services", path: "/admin/career-services", icon: "FaBriefcase" },
      { label: "Exit Interview", path: "/admin/exit-interview", icon: "FaClipboardCheck" },
      { label: "Student Records", path: "/admin/students", icon: "FaUserGraduate" },
    ],
  },
  {
    section: "Programs and Communication",
    items: [
      { label: "Programs and Activities", path: "/admin/programs", icon: "FaCalendarAlt" },
      { label: "Announcements", path: "/admin/announcements", icon: "FaBullhorn" },
      { label: "Notifications", path: "/admin/notifications", icon: "FaBell" },
    ],
  },
  {
    section: "Reports",
    items: [
      { label: "Reports and Analytics", path: "/admin/analytics", icon: "FaChartBar" },
      { label: "Prescriptive Insights", path: "/admin/prescriptive", icon: "FaLightbulb" },
    ],
  },
  {
    section: "Administration",
    items: [
      { label: "User Management", path: "/admin/users", icon: "FaUserCog" },
      { label: "Audit Log", path: "/admin/audit-log", icon: "FaClipboardList" },
      { label: "System Settings", path: "/admin/settings", icon: "FaCog" },
    ],
  },
];
