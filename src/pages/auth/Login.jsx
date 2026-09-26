import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaGoogle,
  FaUserGraduate,
  FaUserTie,
  FaUserShield,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

function getDashboardPath(role) {
  switch (role) {
    case "student":
      return "/student/dashboard";

    case "facilitator":
      return "/facilitator/dashboard";

    case "counselor":
      return "/admin/dashboard";

    default:
      return "/login";
  }
}

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname;

  const handleDemoLogin = async (role) => {
    try {
      setIsLoading(true);
      setError("");

      const user = await login(role);

      /*
       * If the user was redirected to login from
       * a protected page, send them back there.
       */
      if (from && from.startsWith(`/${role}`)) {
        navigate(from, { replace: true });
      } else {
        navigate(getDashboardPath(user.role), {
          replace: true,
        });
      }
    } catch (err) {
      setError("Failed to log in with demo account.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleClick = () => {
    setError(
      "Demo mode — real Google Workspace login pending IT/university approval."
    );
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* ================================
            LOGIN HEADER
        ================================= */}
        <div className="login-header">

          <div className="login-logo">
            <img
              src="/images/ogc-logo.png"
              alt="BatStateU Guidance and Counseling Office"
            />
          </div>

          <h1>GuidanceConnect</h1>

          <p>
            University Guidance Information System
          </p>

        </div>

        {/* ================================
            ERROR / SYSTEM MESSAGE
        ================================= */}
        {error && (
          <div className="login-message">
            {error}
          </div>
        )}

        {/* ================================
            UNIVERSITY GOOGLE LOGIN
        ================================= */}
        <button
          type="button"
          className="google-login-button"
          onClick={handleGoogleClick}
          disabled={isLoading}
        >
          <FaGoogle />

          <span>
            Sign in with University Google Account
          </span>
        </button>

        {/* ================================
            DIVIDER
        ================================= */}
        <div className="login-divider">
          <span>Demo Accounts</span>
        </div>

        <p className="demo-description">
          Use a demo account to test the
          different roles of the system.
        </p>

        {/* ================================
            DEMO LOGIN BUTTONS
        ================================= */}
        <div className="demo-login-buttons">

          {/* STUDENT */}
          <button
            type="button"
            className="demo-login-button"
            onClick={() => handleDemoLogin("student")}
            disabled={isLoading}
          >
            <FaUserGraduate />

            <div>
              <strong>Student</strong>
              <small>Juan Dela Cruz</small>
            </div>
          </button>

          {/* FACILITATOR */}
          <button
            type="button"
            className="demo-login-button"
            onClick={() => handleDemoLogin("facilitator")}
            disabled={isLoading}
          >
            <FaUserTie />

            <div>
              <strong>Facilitator</strong>
              <small>Maria Santos</small>
            </div>
          </button>

          {/* COUNSELOR */}
          <button
            type="button"
            className="demo-login-button"
            onClick={() => handleDemoLogin("counselor")}
            disabled={isLoading}
          >
            <FaUserShield />

            <div>
              <strong>Counselor</strong>
              <small>Dr. Reyes</small>
            </div>
          </button>

        </div>

        {/* ================================
            FOOTER
        ================================= */}
        <div className="login-footer">
          <small>
            Prototype Authentication
          </small>

          <small>
            Real Google Workspace authentication
            will be integrated later.
          </small>
        </div>

      </div>
    </div>
  );
};

export default Login;