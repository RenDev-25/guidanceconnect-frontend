import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import RoleRoute from '../routes/RoleRoute';

import StudentLayout from '../layouts/StudentLayout';
import FacilitatorLayout from '../layouts/FacilitatorLayout';
import AdminLayout from '../layouts/AdminLayout';

// ===============================
// Student Pages
// ===============================
import StudentDashboard from '../pages/student/StudentDashboard';
import ServiceRequest from '../pages/student/ServiceRequest';
import CounselingRequest from '../pages/student/CounselingRequest';
import AppointmentPage from '../pages/student/AppointmentPage';
import AppointmentCalendar from '../pages/student/AppointmentCalendar';
import GoodMoralRequest from '../pages/student/GoodMoralRequest';
import DocumentUpload from '../pages/student/DocumentUpload';
import RequestTracking from '../pages/student/RequestTracking';
import ServiceHistory from '../pages/student/ServiceHistory';
import Notifications from '../pages/student/Notifications';
import Announcements from '../pages/student/Announcements';
import Profile from '../pages/student/Profile';
import AIAssistant from '../pages/student/AIAssistant';

// ===============================
// Facilitator Pages
// ===============================
import FacilitatorDashboard from '../pages/facilitator/FacilitatorDashboard';
import RequestQueue from '../pages/facilitator/RequestQueue';
import DocumentVerification from '../pages/facilitator/DocumentVerification';
import AppointmentManagement from '../pages/facilitator/AppointmentManagement';
import WalkInQueue from '../pages/facilitator/WalkInQueue';
import FacilitatorNotifications from '../pages/facilitator/Notifications';
import CounselingRecords from '../pages/facilitator/CounselingRecords';
import StudentRecords from '../pages/facilitator/StudentRecords';

// ===============================
// Admin / Counselor Pages
// ===============================
import AdminDashboard from '../pages/admin/AdminDashboard';
import CounselingManagement from '../pages/admin/CounselingManagement';
import AppointmentManagementAdmin from '../pages/admin/AppointmentManagement';
import RequestManagement from '../pages/admin/RequestManagement';
import GoodMoralManagement from '../pages/admin/GoodMoralManagement';
import ReferralManagement from '../pages/admin/ReferralManagement';
import FollowUpManagement from '../pages/admin/FollowUpManagement';
import CareerServices from '../pages/admin/CareerServices';
import ExitInterview from '../pages/admin/ExitInterview';
import ProgramsAndActivities from '../pages/admin/ProgramsAndActivities';
import AdminAnnouncements from '../pages/admin/Announcements';
import AdminNotifications from '../pages/admin/Notifications';
import UserManagement from '../pages/admin/UserManagement';
import AuditLog from '../pages/admin/AuditLog';
import SystemSettings from '../pages/admin/SystemSettings';

const AppRoutes = () => {
  return (
    <Routes>

      {/* =========================================
          STUDENT PORTAL ROUTES
      ========================================= */}
      <Route
        path="/student"
        element={
          <RoleRoute allowedRoles={['student']}>
            <StudentLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route
          path="dashboard"
          element={<StudentDashboard />}
        />

        <Route
          path="service-request"
          element={<ServiceRequest />}
        />

        <Route
          path="counseling-request"
          element={<CounselingRequest />}
        />

        <Route
          path="appointments"
          element={<AppointmentPage />}
        />

        <Route
          path="appointment-calendar"
          element={<AppointmentCalendar />}
        />

        <Route
          path="good-moral-request"
          element={<GoodMoralRequest />}
        />

        <Route
          path="document-upload"
          element={<DocumentUpload />}
        />

        <Route
          path="request-tracking"
          element={<RequestTracking />}
        />

        <Route
          path="service-history"
          element={<ServiceHistory />}
        />

        <Route
          path="notifications"
          element={<Notifications />}
        />

        <Route
          path="announcements"
          element={<Announcements />}
        />

        <Route
          path="profile"
          element={<Profile />}
        />

        <Route
          path="ai-assistant"
          element={<AIAssistant />}
        />
      </Route>


      {/* =========================================
          FACILITATOR PORTAL ROUTES
      ========================================= */}
     
        {/* =========================================
    FACILITATOR PORTAL ROUTES
========================================= */}
          <Route
            path="/facilitator"
            element={
              <RoleRoute allowedRoles={['facilitator']}>
                <FacilitatorLayout />
              </RoleRoute>
            }
          >
            <Route
              index
              element={<Navigate to="dashboard" replace />}
            />

            <Route
              path="dashboard"
              element={<FacilitatorDashboard />}
            />

            <Route
              path="requests"
              element={<RequestQueue />}
            />

            <Route
              path="requests/:id"
              element={<RequestDetails />}
            />

            <Route
              path="processing"
              element={<StudentRequestProcessing />}
            />

            <Route
              path="verification"
              element={<DocumentVerification />}
            />

            <Route
              path="appointments"
              element={<AppointmentManagement />}
            />

            <Route
              path="walk-ins"
              element={<WalkInQueue />}
            />

            <Route
              path="counseling"
              element={<CounselingRecords />}
            />

            <Route
              path="students"
              element={<StudentRecords />}
            />

            <Route
              path="tasks"
              element={<DailyTasks />}
            />

            <Route
              path="notifications"
              element={<FacilitatorNotifications />}
            />
          </Route>

      {/* =========================================
          ADMIN / COUNSELOR PORTAL ROUTES
      ========================================= */}
      <Route
        path="/admin"
        element={
          <RoleRoute allowedRoles={['counselor']}>
            <AdminLayout />
          </RoleRoute>
        }
      >
        {/* /admin → /admin/dashboard */}
        <Route
          index
          element={<Navigate to="dashboard" replace />}
        />

        {/* Dashboard */}
        <Route
          path="dashboard"
          element={<AdminDashboard />}
        />

        {/* Student Support & Case Management */}
        <Route
          path="counseling"
          element={<CounselingManagement />}
        />

        <Route
          path="appointments"
          element={<AppointmentManagementAdmin />}
        />

        <Route
          path="requests"
          element={<RequestManagement />}
        />

        <Route
          path="good-moral"
          element={<GoodMoralManagement />}
        />

        <Route
          path="referrals"
          element={<ReferralManagement />}
        />

        <Route
          path="follow-ups"
          element={<FollowUpManagement />}
        />

        <Route
          path="career-services"
          element={<CareerServices />}
        />

        <Route
          path="exit-interview"
          element={<ExitInterview />}
        />

        {/* Programs & Communications */}
        <Route
          path="programs"
          element={<ProgramsAndActivities />}
        />

        <Route
          path="announcements"
          element={<AdminAnnouncements />}
        />

        <Route
          path="notifications"
          element={<AdminNotifications />}
        />

        {/* System Administration */}
        <Route
          path="users"
          element={<UserManagement />}
        />

        <Route
          path="audit-log"
          element={<AuditLog />}
        />

        <Route
          path="settings"
          element={<SystemSettings />}
        />
      </Route>

    </Routes>
  );
};

export default AppRoutes;