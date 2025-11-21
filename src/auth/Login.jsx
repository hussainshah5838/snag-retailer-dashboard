import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../routes/paths";
import { useLocation } from "react-router-dom";
import { signIn } from "./api/auth.service";

export default function Login() {
  const nav = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [showPw, setShowPw] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const res = await signIn({ email: email.trim(), password: pw });
      if (res?.ok) {
        try {
          if (res.token) localStorage.setItem("auth_token", res.token);
          const storageObj = {
            token: res.token ?? null,
            user: res.user ?? null,
          };
          localStorage.setItem("zavolla_auth", JSON.stringify(storageObj));
        } catch (e) {
          console.warn("Failed to persist auth to localStorage:", e);
        }
        const returnTo =
          location?.state?.from?.pathname || PATHS.admin.dashboard;
        nav(returnTo);
      } else setErr("Sign-in failed");
    } catch (e2) {
      setErr(e2.message || "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  // Hero image for left panel. Replace with your own image if desired.
  const hero =
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=60";

  return (
    <div className="min-h-screen flex items-stretch bg-gray-50">
      {/* Left hero image (hidden on small screens) */}
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: `url('${hero}')` }}
        aria-hidden
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute left-8 bottom-8 text-white max-w-xs">
          <h3 className="font-semibold text-lg" style={{ color: "#fff" }}>
            Easily monitor merchants, offers, and user activity in real time.
          </h3>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold bg-white">
              Welcome Back to Snag
            </h2>
            <p className="text-sm mt-2 bg-white ">
              Log in to discover and manage the best deals around you.
            </p>
          </div>

          {err && (
            <div className="mb-4 p-3 rounded-xl border text-sm text-red-600 border-red-200">
              {err}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs bg-white ">Email Address</label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  @
                </span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="block text-xs bg-white ">Password</label>
                <a href="#" className="text-xs text-sky-600">
                  Forgot Password?
                </a>
              </div>
              <div className="mt-1 relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="********"
                  className="w-full border border-slate-200 rounded-md px-4 py-2 pr-20 focus:outline-none focus:ring-2 focus:ring-sky-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] px-0.5 py-0 bg-white leading-none"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              className="w-full rounded-md bg-sky-600 hover:bg-sky-700 text-white py-2 font-medium"
              disabled={busy}
            >
              {busy ? "Signing in…" : "Login"}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <div className="text-xs bg-white px-2">OR</div>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <button
              type="button"
              className="w-full rounded-md border border-slate-200 bg-white text-sm text-slate-700 py-2"
            >
              <span className="mr-2 inline-flex items-center" aria-hidden>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 533.5 544.3"
                  className="h-4 w-4"
                  width="18"
                  height="18"
                  aria-hidden
                >
                  <path
                    fill="#4285F4"
                    d="M533.5 278.4c0-18.5-1.5-36.3-4.4-53.6H272v101.4h147.4c-6.3 34.5-25 63.7-53.3 83.3v69.1h86.2c50.3-46.3 81.2-114.7 81.2-200.2z"
                  />
                  <path
                    fill="#34A853"
                    d="M272 544.3c72.6 0 133.6-24 178.2-65.3l-86.2-69.1c-24 16.1-54.7 25.6-92 25.6-70.7 0-130.6-47.7-152-111.6H31.1v69.9C75.7 487.8 167 544.3 272 544.3z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M120 328.5c-10.6-31.9-10.6-66.1 0-98l-88.9-69.9C4 200.4 0 239.8 0 272s4 71.6 31.1 111.4l88.9-69.9z"
                  />
                  <path
                    fill="#EA4335"
                    d="M272 107.7c39.5 0 75 13.6 103 40.2l77.6-77.6C405.6 24.4 347.4 0 272 0 167 0 75.7 56.5 31.1 142.1l88.9 69.9C141.4 155.4 201.3 107.7 272 107.7z"
                  />
                </svg>
              </span>
              <span>Sign in with Google</span>
            </button>

            <div className="text-center text-xs bg-white  mt-2">
              Facing any issues?{" "}
              <a href="#" className="text-sky-600">
                Contact Support
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
