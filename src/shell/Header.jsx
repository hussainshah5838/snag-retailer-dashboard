import React, { useEffect, useRef, useState } from "react";
import ThemeSwitch from "./ThemeSwitch";
import UserMenu from "./UserMenu";
import { useNotifications } from "../modules/notifications/useNotifications";

const Icon = ({ name, className = "w-5 h-5" }) => {
  const c = "stroke-current";
  switch (name) {
    case "menu":
      return (
        <svg viewBox="0 0 24 24" className={`${className} ${c}`} fill="none">
          <path d="M3 6h18M3 12h18M3 18h18" strokeWidth="1.7" />
        </svg>
      );
    case "bell":
      return (
        <svg viewBox="0 0 24 24" className={`${className} ${c}`} fill="none">
          <path
            d="M15 17H5.5c-.83 0-1.5-.67-1.5-1.5 0-.38.15-.74.41-1.01A5.5 5.5 0 0 0 6 11V9a6 6 0 1 1 12 0v2c0 1.23.49 2.4 1.35 3.26.26.27.41.63.41 1.01 0 .83-.67 1.5-1.5 1.5H15Zm-6 0a3 3 0 0 0 6 0"
            strokeWidth="1.6"
          />
        </svg>
      );
    case "trash":
      return (
        <svg viewBox="0 0 24 24" className={`${className} ${c}`} fill="none">
          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
};

const timeAgo = (t) => {
  const s = Math.floor((Date.now() - new Date(t).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const TYPE_COLORS = {
  merchant_action: "#6366f1",
  offer:           "#f59e0b",
  redemption:      "#10b981",
  system:          "#64748b",
};

export default function Header({ onMenuClick, onSearch }) {
  const [query, setQuery] = useState("");

  const submitSearch = (e) => {
    e.preventDefault();
    if (onSearch && query.trim()) onSearch(query.trim());
  };

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ borderColor: "var(--line)", background: "rgb(15,21,42)" }}
    >
      <div className="h-14 flex items-center justify-between px-3 sm:px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Icon name="menu" />
          </button>
          <span className="md:hidden font-semibold text-lg">Snag</span>
        </div>

        <form onSubmit={submitSearch} className="flex-1 max-w-xl mx-2 sm:mx-6">
          <input
            className="w-full input px-3 py-2 rounded-xl text-sm sm:text-base outline-none"
            placeholder="Search..."
            style={{ background: "var(--card)", borderColor: "var(--line)" }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <div className="flex items-center gap-2 sm:gap-3">
          <NotificationsBell />
          <ThemeSwitch />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

/* =====================================================
 * Real Notifications Bell
 * ===================================================== */
function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  const { items, loading, unreadCount, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();

  // Close on outside click
  useEffect(() => {
    const onDoc = (e) => {
      if (
        open &&
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const handleOpen = () => setOpen((v) => !v);

  const handleClickNotification = (n) => {
    if (!n.read) markAsRead(n._id);
  };

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="relative p-2 rounded-lg hover:bg-slate-100/10 transition-colors"
        aria-label="Notifications"
      >
        <Icon name="bell" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 mt-2 w-80 rounded-xl border shadow-xl overflow-hidden z-50"
          style={{ borderColor: "var(--line)", background: "var(--card)" }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: "var(--line)" }}
          >
            <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs bg-rose-600 text-white">
                  {unreadCount}
                </span>
              )}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs hover:underline"
                style={{ color: "var(--primary)" }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div
                  className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: "var(--primary)" }}
                />
              </div>
            ) : items.length === 0 ? (
              <div className="py-10 text-center text-sm" style={{ color: "var(--muted)" }}>
                No notifications yet
              </div>
            ) : (
              items.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleClickNotification(n)}
                  className="flex gap-3 px-4 py-3 border-b cursor-pointer hover:bg-white/5 transition-colors"
                  style={{
                    borderColor: "var(--line)",
                    background: n.read ? "transparent" : "rgba(99,102,241,0.06)",
                  }}
                >
                  {/* Color dot */}
                  <div
                    className="mt-1 w-2 h-2 rounded-full shrink-0"
                    style={{
                      background: TYPE_COLORS[n.type] ?? "#64748b",
                      opacity: n.read ? 0.4 : 1,
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm font-medium truncate"
                      style={{ color: n.read ? "var(--muted)" : "var(--text)" }}
                    >
                      {n.title}
                    </div>
                    <div className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--muted)" }}>
                      {n.message}
                    </div>
                    <div className="text-xs mt-1" style={{ color: "var(--muted)", opacity: 0.6 }}>
                      {timeAgo(n.createdAt)}
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNotification(n._id); }}
                    className="shrink-0 p-1 rounded hover:bg-rose-500/20 transition-colors opacity-0 group-hover:opacity-100"
                    style={{ color: "var(--muted)" }}
                    aria-label="Delete notification"
                  >
                    <Icon name="trash" className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
