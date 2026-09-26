import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Unauthorized() {
  const { user } = useAuth();

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

  return (
    <div className="login-page">
      <div className="login-card text-center">

        <h1 className="mb-3">
          Access Denied
        </h1>

        <p className="text-muted mb-4">
          Your current account does not have
          permission to access this page.
        </p>

        {user ? (
          <Link
            to={getDashboardPath(user.role)}
            className="btn btn-danger"
          >
            Return to Dashboard
          </Link>
        ) : (
          <Link
            to="/login"
            className="btn btn-danger"
          >
            Go to Login
          </Link>
        )}

      </div>
    </div>
  );
}

export default Unauthorized;