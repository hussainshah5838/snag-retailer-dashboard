import React, { useEffect, useRef, useState } from "react";
import ThemeSwitch from "./ThemeSwitch";
import UserMenu from "./UserMenu";

/* ------------ tiny inline icons (same as first header) ------------ */
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
    case "dot":
      return (
        <svg viewBox="0 0 12 12" className={className} fill="currentColor">
          <circle cx="6" cy="6" r="6" />
        </svg>
      );
    default:
      return null;
  }
};

/* ------------ dummy sample notifications ------------ */
const demoNotifications = [
  {
    id: "n1",
    title: "New signup",
    body: "A retailer requested verification.",
    ts: Date.now() - 1000 * 60 * 12,
    read: false,
    type: "info",
  },
];

const timeAgo = (t) => {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
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
        {/* left: menu button for mobile */}
        <div className="flex items-center gap-2">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Icon name="menu" />
          </button>
          <span className="md:hidden font-semibold text-lg">Snag</span>
        </div>

        {/* center: search */}
        <form onSubmit={submitSearch} className="flex-1 max-w-xl mx-2 sm:mx-6">
          <input
            className="w-full input px-3 py-2 rounded-xl text-sm sm:text-base outline-none"
            placeholder="Search..."
            style={{ background: "var(--card)", borderColor: "var(--line)" }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        {/* right side icons */}
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
 * Notifications Bell
 * ===================================================== */
function NotificationsBell() {
  const [items] = useState(demoNotifications);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  const unread = items.filter((n) => !n.read).length;

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

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Icon name="bell" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 grid place-items-center w-4 h-4 rounded-full bg-rose-600 text-white text-[10px]">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto rounded-xl border shadow-xl"
          style={{ borderColor: "var(--line)", background: "var(--card)" }}
        >
          {items.map((n) => (
            <div
              key={n.id}
              className="p-3 border-b"
              style={{ borderColor: "var(--line)" }}
            >
              <div className="flex justify-between">
                <div className="font-medium">{n.title}</div>
                {!n.read && (
                  <Icon name="dot" className="w-2.5 h-2.5 text-rose-600" />
                )}
              </div>
              <div className="text-sm muted">{n.body}</div>
              <div className="text-xs muted mt-1">{timeAgo(n.ts)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
