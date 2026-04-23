import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../routes/paths";
import { signOut, getCurrentUser } from "../auth/api/auth.service";

function readUser() {
  const user = getCurrentUser();
  if (!user) return { initials: "R", avatarSrc: null };
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.name || "";
  const initials =
    (fullName || user.email || "")
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "R";
  const avatarSrc = user.avatarUrl || user.avatar || null;
  return { initials, avatarSrc };
}

export default function UserMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [userInfo, setUserInfo] = useState(readUser);
  const ref = useRef(null);
  const btnRef = useRef(null);

  // Re-read user from localStorage whenever the profile page updates it
  useEffect(() => {
    const refresh = () => {
      setUserInfo(readUser());
      setImgFailed(false); // reset so new avatar src is tried
    };
    window.addEventListener("profile:updated", refresh);
    return () => window.removeEventListener("profile:updated", refresh);
  }, []);

  // Close dropdown on outside click
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

  const { initials, avatarSrc } = userInfo;

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="relative h-9 w-9 rounded-full overflow-hidden border btn-ghost"
        style={{
          borderColor: "var(--line)",
          background: "var(--card)",
          flexShrink: 0,
        }}
        aria-label="Open user menu"
      >
        {!imgFailed && avatarSrc ? (
          <img
            src={avatarSrc}
            alt="avatar"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text)",
              lineHeight: 1,
            }}
          >
            {initials}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={ref}
          className="absolute right-0 mt-2 w-44 rounded-xl border shadow-lg z-50"
          style={{ borderColor: "var(--line)", background: "var(--card)" }}
        >
          <button
            className="w-full text-left px-3 py-2 hover:bg-slate-100/6 rounded-t-xl"
            onClick={() => {
              setOpen(false);
              navigate(PATHS.admin?.profile || "/app/profile");
            }}
          >
            Profile
          </button>
          <div className="border-t" style={{ borderColor: "var(--line)" }} />
          <button
            className="w-full text-left px-3 py-2 text-rose-400 hover:bg-slate-100/6 rounded-b-xl"
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
