// src/shell/LeftSidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { PATHS } from "../routes/paths";
import { signOut } from "../auth/api/auth.service";

/** Inline icons copied from theme */
const Icon = ({ name, className = "w-4 h-4" }) => {
  const common = "stroke-current";
  switch (name) {
    case "dashboard":
      return (
        <svg
          className={`${className} ${common}`}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M3 12h8V3H3v9Zm10 9h8v-8h-8v8ZM3 21h8v-6H3v6Zm10-10h8V3h-8v8Z"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "retailers":
      return (
        <svg
          className={`${className} ${common}`}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm10 14v-2a4 4 0 0 0-3-3.87M17 3a4 4 0 0 1 0 8"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "offers":
      return (
        <svg
          className={`${className} ${common}`}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M3 7h18M4 7l2 14h12l2-14M8 7V5a4 4 0 1 1 8 0v2"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "audience":
      return (
        <svg
          className={`${className} ${common}`}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="12" cy="7" r="4" strokeWidth="1.5" />
          <path d="M5 21v-2a7 7 0 0 1 14 0v2" strokeWidth="1.5" />
        </svg>
      );
    case "promotion":
      return (
        <svg
          className={`${className} ${common}`}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M3 12l18-9-9 18-2-8-7-1z" strokeWidth="1.5" />
        </svg>
      );
    case "billing":
      return (
        <svg
          className={`${className} ${common}`}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M3 7h18v10H3V7Zm0-3h18M7 17h4" strokeWidth="1.5" />
        </svg>
      );
    case "legal":
      return (
        <svg
          className={`${className} ${common}`}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M12 3l7 4v10l-7 4-7-4V7l7-4z" strokeWidth="1.5" />
        </svg>
      );
    case "profile":
      return (
        <svg
          className={`${className} ${common}`}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="12" cy="8" r="4" strokeWidth="1.5" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "logout":
      return (
        <svg
          className={`${className} ${common}`}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M16 17l5-5-5-5M21 12H9M12 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-2"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
};

const NAV_ITEMS = [
  { label: "Dashboard", to: PATHS.admin.dashboard, icon: "dashboard" },
  {
    label: "Merchant Management",
    to: PATHS.admin.retailers,
    icon: "retailers",
  },
  { label: "Offers", to: PATHS.admin.offers, icon: "offers" },
  // { label: "Bulk Upload", to: PATHS.admin.offersBulk, icon: "offers" },
  { label: "Audience", to: PATHS.admin.audience, icon: "audience" },
  {
    label: "Promotion Limits",
    to: PATHS.admin.promotionLimits,
    icon: "promotion",
  },
  { label: "Billing", to: PATHS.admin.billing, icon: "billing" },
  { label: "Financials", to: PATHS.admin.billingFinancials, icon: "billing" },
  { label: "Legal", to: PATHS.admin.legal, icon: "legal" },
  { label: "Profile", to: PATHS.admin.profile, icon: "profile" },
];

export default function LeftSidebar({ open = true, onClose }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`
        w-64 shrink-0 p-3 overflow-y-auto border-r left-sidebar
        fixed md:static top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      style={{ background: "rgb(15,21,42)", borderColor: "var(--line)" }}
    >
      {/* Mobile close button */}
      <div className="md:hidden flex justify-end mb-4">
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Logo */}
      <div className="px-2 pb-4 flex items-center gap-3">
        <img
          src={logo}
          alt="Logo"
          className="w-10 h-10 object-contain"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.nextElementSibling.style.display = "flex";
          }}
        />
        <div className="w-10 h-10 bg-primary rounded-lg items-center justify-center text-white font-bold text-lg hidden">
          S
        </div>
        <div>
          <div className="text-lg font-semibold text-white">Snag</div>
          <div className="text-xs text-gray-400">Retailer Panel</div>
        </div>
      </div>

      {/* Menu items */}
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm",
                "hover:bg-slate-100/10 hover:text-white transition-colors",
                isActive ? "bg-slate-100/20 text-white" : "text-gray-300",
              ].join(" ")
            }
          >
            <Icon name={item.icon} />
            {item.label}
          </NavLink>
        ))}

        {/* Logout button */}
        <div className="pt-4 mt-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-colors"
          >
            <Icon name="logout" />
            Log Out
          </button>
        </div>
      </nav>
    </aside>
  );
}
