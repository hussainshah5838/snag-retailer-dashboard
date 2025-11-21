// src/layouts/AdminLayout.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../shell/Header";
import LeftSidebar from "../shell/LeftSidebar";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (!open) return;
    // Defer closing to avoid synchronous setState within effect which can cause cascading renders
    const id = setTimeout(() => setOpen(false), 0);
    return () => clearTimeout(id);
  }, [loc.pathname, open]);

  return (
    <div
      className="min-h-screen w-full flex relative"
      style={{ background: "rgb(11,16,32)" }}
    >
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setOpen(false)}
          style={{ background: "rgba(15,21,42,0.6)" }}
        />
      )}

      {/* Sidebar */}
      <LeftSidebar open={open} onClose={() => setOpen(false)} />

      {/* Right content */}
      <div
        className="flex-1 min-w-0 w-full flex flex-col"
        style={{ background: "rgb(11,16,32)" }}
      >
        <Header title="SNAG Admin" onMenuClick={() => setOpen(true)} />

        <main className="page w-full flex-1 overflow-x-auto">
          <div className="px-3 sm:px-6 lg:px-8 w-full min-w-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
