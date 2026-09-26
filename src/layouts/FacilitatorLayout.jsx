import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./partials/Sidebar";
import Topbar from "./partials/Topbar";

import { facilitatorNav } from "../constants/navigation";

function FacilitatorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        navItems={facilitatorNav}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-wrapper">
        <Topbar
          title="Facilitator Dashboard"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default FacilitatorLayout;