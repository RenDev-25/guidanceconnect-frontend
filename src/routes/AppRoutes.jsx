import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import RoleRoute from '../routes/RoleRoute';

import StudentLayout from '../layouts/StudentLayout';
import FacilitatorLayout from '../layouts/FacilitatorLayout';

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
import RequestDetails from '../pages/facilitator/RequestDetails';
import DocumentVerification from '../pages/facilitator/DocumentVerification';
import AppointmentManagement from '../pages/facilitator/AppointmentManagement';
import WalkInQueue from '../pages/facilitator/WalkInQueue';
import DailyTasks from '../pages/facilitator/DailyTasks';
import StudentRequestProcessing from '../pages/facilitator/StudentRequestProcessing';
import FacilitatorNotifications from '../pages/facilitator/Notifications';

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
        <Route index element={<Navigate to="dashboard" replace />} />

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
          path="tasks"
          element={<DailyTasks />}
        />

        <Route
          path="notifications"
          element={<FacilitatorNotifications />}
        />
      </Route>

    </Routes>
  );
};

export default AppRoutes;