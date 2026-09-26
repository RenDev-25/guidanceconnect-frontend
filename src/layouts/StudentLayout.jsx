import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./partials/Sidebar";
import Topbar from "./partials/Topbar";
import { studentNav } from "../constants/navigation";

function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        navItems={studentNav}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-wrapper">
        <Topbar
          title="Student Dashboard"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;