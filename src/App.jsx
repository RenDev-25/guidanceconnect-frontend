import React from 'react';
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

// Layouts
import StudentLayout from './layouts/StudentLayout';
import FacilitatorLayout from './layouts/FacilitatorLayout';
import AdminLayout from './layouts/AdminLayout';

// Authentication & Route Guards
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

// Pages
import Login from './pages/auth/Login';
import Unauthorized from './pages/auth/Unauthorized';
import StyleGuide from './pages/dev/StyleGuide';

function Placeholder({ title }) {
  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h2>{title}</h2>
        <p className="text-muted">
          This is a placeholder page for the
          Guidance and Counseling System.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>

      {/* ========================================
          PUBLIC ROUTES
      ======================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      <Route
        path="/dev/style-guide"
        element={<StyleGuide />}
      />


      {/* ========================================
          PROTECTED ROUTES
      ======================================== */}

      <Route element={<ProtectedRoute />}>


        {/* ========================================
            STUDENT
        ======================================== */}

        <Route
          element={
            <RoleRoute
              allowedRoles={['student']}
            />
          }
        >
          <Route
            path="/student"
            element={<StudentLayout />}
          >
            <Route
              index
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />

            <Route
              path="dashboard"
              element={
                <Placeholder
                  title="Student Dashboard"
                />
              }
            />

            <Route
              path="requests"
              element={
                <Placeholder
                  title="Service Requests"
                />
              }
            />

            <Route
              path="appointments"
              element={
                <Placeholder
                  title="Appointments"
                />
              }
            />

            <Route
              path="counseling"
              element={
                <Placeholder
                  title="Counseling"
                />
              }
            />

            <Route
              path="good-moral"
              element={
                <Placeholder
                  title="Good Moral Request"
                />
              }
            />
          </Route>
        </Route>


        {/* ========================================
            FACILITATOR
        ======================================== */}

        <Route
          element={
            <RoleRoute
              allowedRoles={['facilitator']}
            />
          }
        >
          <Route
            path="/facilitator"
            element={<FacilitatorLayout />}
          >
            <Route
              index
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />

            <Route
              path="dashboard"
              element={
                <Placeholder
                  title="Facilitator Dashboard"
                />
              }
            />

            <Route
              path="requests"
              element={
                <Placeholder
                  title="Requests"
                />
              }
            />

            <Route
              path="appointments"
              element={
                <Placeholder
                  title="Appointments"
                />
              }
            />

            <Route
              path="counseling"
              element={
                <Placeholder
                  title="Counseling Records"
                />
              }
            />

            <Route
              path="students"
              element={
                <Placeholder
                  title="Student Records"
                />
              }
            />
          </Route>
        </Route>


        {/* ========================================
            COUNSELOR / ADMIN
        ======================================== */}

        <Route
          element={
            <RoleRoute
              allowedRoles={['counselor']}
            />
          }
        >
          <Route
            path="/admin"
            element={<AdminLayout />}
          >
            <Route
              index
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />

            <Route
              path="dashboard"
              element={
                <Placeholder
                  title="Counselor Dashboard"
                />
              }
            />

            <Route
              path="requests"
              element={
                <Placeholder
                  title="Requests"
                />
              }
            />

            <Route
              path="appointments"
              element={
                <Placeholder
                  title="Appointments"
                />
              }
            />

            <Route
              path="counseling"
              element={
                <Placeholder
                  title="Counseling"
                />
              }
            />

            <Route
              path="students"
              element={
                <Placeholder
                  title="Students"
                />
              }
            />

            <Route
              path="analytics"
              element={
                <Placeholder
                  title="Reports & Analytics"
                />
              }
            />

            <Route
              path="users"
              element={
                <Placeholder
                  title="User Management"
                />
              }
            />

            <Route
              path="settings"
              element={
                <Placeholder
                  title="Settings"
                />
              }
            />
          </Route>
        </Route>

      </Route>


      {/* ========================================
          DEFAULT ROUTE
      ======================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;