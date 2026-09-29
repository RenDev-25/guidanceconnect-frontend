import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RoleRoute from '../components/common/RoleRoute'; // or wherever your RoleRoute is stored
import StudentLayout from '../layouts/StudentLayout';

// Import all 13 Student Pages
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

const AppRoutes = () => {
  return (
    <Routes>
      {/* Student Portal Routes */}
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
    </Routes>
  );
};

export default AppRoutes;