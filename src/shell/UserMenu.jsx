import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../routes/paths";
import { signOut, getCurrentUser } from "../auth/api/auth.service";

export default function UserMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const ref = useRef(null);
  const btnRef = useRef(null);

  const user = getCurrentUser();
  const initials =
    (user?.name || user?.email || "")
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  useEffect(() => {
    const onDoc = (e) => {
      if (
        open &&
        ref.current &&
        !ref.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function handleLogout() {
    signOut();
    navigate(PATHS.auth?.login || "/login", { replace: true });
  }

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="h-9 w-9 rounded-full overflow-hidden border btn-ghost grid place-items-center text-sm font-medium"
        style={{
          borderColor: "var(--line)",
          background: "var(--card)",
          color: "var(--text)",
        }}
        aria-label="Open user menu"
      >
        {!imgFailed ? (
          <img
            src={user?.avatar || "https://i.pravatar.cc/80"}
            alt="avatar"
            className="h-full w-full object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            style={{ color: "var(--muted)" }}
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 3.134-7 7h2c0-2.761 2.239-5 5-5s5 2.239 5 5h2c0-3.866-3.134-7-7-7z" />
          </svg>
        )}
      </button>

      {open && (
        <div
          ref={ref}
          className="absolute right-0 mt-2 w-44 rounded-xl border shadow-lg"
          style={{ borderColor: "var(--line)", background: "var(--card)" }}
        >
          <button
            className="w-full text-left px-3 py-2 hover:bg-slate-100/6"
            onClick={() => {
              setOpen(false);
              navigate(PATHS.admin?.profile || "/app/profile");
            }}
          >
            Profile
          </button>
          <div className="border-t" style={{ borderColor: "var(--line)" }} />
          <button
            className="w-full text-left px-3 py-2 text-rose-400 hover:bg-slate-100/6"
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
