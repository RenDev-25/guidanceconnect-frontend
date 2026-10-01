import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import StudentLayout from './layouts/StudentLayout';
import FacilitatorLayout from './layouts/FacilitatorLayout';
import AdminLayout from './layouts/AdminLayout';

// Authentication & Route Guards
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

// Public Pages
import Login from './pages/auth/Login';
import Unauthorized from './pages/auth/Unauthorized';
import StyleGuide from './pages/dev/StyleGuide';

// ========================================
// STUDENT PAGES
// ========================================
import StudentDashboard from './pages/student/StudentDashboard';
import ServiceRequest from './pages/student/ServiceRequest';
import CounselingRequest from './pages/student/CounselingRequest';
import AppointmentPage from './pages/student/AppointmentPage';
import AppointmentCalendar from './pages/student/AppointmentCalendar';
import GoodMoralRequest from './pages/student/GoodMoralRequest';
import DocumentUpload from './pages/student/DocumentUpload';
import RequestTracking from './pages/student/RequestTracking';
import ServiceHistory from './pages/student/ServiceHistory';
import Notifications from './pages/student/Notifications';
import Announcements from './pages/student/Announcements';
import Profile from './pages/student/Profile';
import AIAssistant from './pages/student/AIAssistant';

// ========================================
// ADMIN / COUNSELOR PAGES
// ========================================
import AdminDashboard from './pages/admin/AdminDashboard';
import RequestManagement from './pages/admin/RequestManagement';
import GoodMoralManagement from './pages/admin/GoodMoralManagement';
import AppointmentManagement from './pages/admin/AppointmentManagement';
import CounselingManagement from './pages/admin/CounselingManagement';
import ReferralManagement from './pages/admin/ReferralManagement';
import FollowUpManagement from './pages/admin/FollowUpManagement';
import CareerServices from './pages/admin/CareerServices';
import ProgramsAndActivities from './pages/admin/ProgramsAndActivities';
import AdminAnnouncements from './pages/admin/Announcements';
import AdminNotifications from './pages/admin/Notifications';
import UserManagement from './pages/admin/UserManagement';
import AuditLog from './pages/admin/AuditLog';
import SystemSettings from './pages/admin/SystemSettings';


// ========================================
// PLACEHOLDER COMPONENT
// ========================================
function Placeholder({ title }) {
  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h2>{title}</h2>
        <p className="text-muted">
          This is a placeholder page for the Guidance and Counseling System.
        </p>
      </div>
    </div>
  );
}


// ========================================
// APP ROUTES
// ========================================
function App() {
  return (
    <Routes>

      {/* ========================================
          PUBLIC ROUTES
      ======================================== */}
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/dev/style-guide" element={<StyleGuide />} />


      {/* ========================================
          PROTECTED ROUTES
      ======================================== */}
      <Route element={<ProtectedRoute />}>


        {/* ========================================
            STUDENT
        ======================================== */}
        <Route element={<RoleRoute allowedRoles={['student']} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="service-request" element={<ServiceRequest />} />
            <Route path="counseling-request" element={<CounselingRequest />} />
            <Route path="appointments" element={<AppointmentPage />} />
            <Route path="appointment-calendar" element={<AppointmentCalendar />} />
            <Route path="good-moral-request" element={<GoodMoralRequest />} />
            <Route path="document-upload" element={<DocumentUpload />} />
            <Route path="request-tracking" element={<RequestTracking />} />
            <Route path="service-history" element={<ServiceHistory />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="profile" element={<Profile />} />
            <Route path="ai-assistant" element={<AIAssistant />} />
          </Route>
        </Route>


        {/* ========================================
            FACILITATOR
        ======================================== */}
        <Route element={<RoleRoute allowedRoles={['facilitator']} />}>
          <Route path="/facilitator" element={<FacilitatorLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Placeholder title="Facilitator Dashboard" />} />
            <Route path="requests" element={<Placeholder title="Requests" />} />
            <Route path="appointments" element={<Placeholder title="Appointments" />} />
            <Route path="counseling" element={<Placeholder title="Counseling Records" />} />
            <Route path="students" element={<Placeholder title="Student Records" />} />
          </Route>
        </Route>


        {/* ========================================
            COUNSELOR / ADMIN
        ======================================== */}
        <Route element={<RoleRoute allowedRoles={['counselor']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* Core Operations */}
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="requests" element={<RequestManagement />} />
            <Route path="good-moral" element={<GoodMoralManagement />} />
            <Route path="appointments" element={<AppointmentManagement />} />

            {/* Student Support */}
            <Route path="counseling" element={<CounselingManagement />} />
            <Route path="referrals" element={<ReferralManagement />} />
            <Route path="follow-ups" element={<FollowUpManagement />} />
            <Route path="career-services" element={<CareerServices />} />
            <Route path="students" element={<Placeholder title="Student Records" />} />

            {/* Programs & Communication */}
            <Route path="programs" element={<ProgramsAndActivities />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="notifications" element={<AdminNotifications />} />

            {/* Analytics / Intelligence */}
            <Route path="analytics" element={<Placeholder title="Reports & Analytics" />} />
            <Route path="prescriptive" element={<Placeholder title="Prescriptive Insights" />} />
            <Route path="ai-insights" element={<Placeholder title="AI Insights" />} />

            {/* Administration */}
            <Route path="users" element={<UserManagement />} />
            <Route path="audit-log" element={<AuditLog />} />
            <Route path="settings" element={<SystemSettings />} />
          </Route>
        </Route>

      </Route>


      {/* ========================================
          DEFAULT ROUTES
      ======================================== */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}

export default App;