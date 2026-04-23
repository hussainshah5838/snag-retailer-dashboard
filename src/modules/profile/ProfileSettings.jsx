import React, { useState, useEffect, useRef } from "react";
import { getProfile, updateProfile, uploadAvatar } from "./api/profile.service";
import { getAuth, getCurrentUser } from "../../auth/api/auth.service";

const STORAGE_KEY = "zavolla_auth";

/** Persist updated user fields back into localStorage so the navbar reflects changes */
function persistUserUpdate(updates) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const auth = JSON.parse(raw);
    // Use Object.assign so null values overwrite existing keys (not skipped like spread)
    auth.user = Object.assign({}, auth.user || {}, updates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    // Notify navbar to re-read user
    window.dispatchEvent(new Event("profile:updated"));
  } catch {
    // ignore
  }
}

export default function ProfileSettings() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", phoneNumber: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Load profile on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phoneNumber: data.phoneNumber || "",
        });
        setAvatarPreview(data.avatarUrl || null);
        // Always sync localStorage with fresh server data (handles deleted avatar)
        persistUserUpdate({
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          avatarUrl: data.avatarUrl || null,
          avatar: data.avatarUrl || null,
          name: `${data.firstName} ${data.lastName}`.trim(),
        });
      } catch (err) {
        // Fallback to local storage user
        const user = getCurrentUser();
        if (user) {
          setForm({
            firstName: user.firstName || user.name?.split(" ")[0] || "",
            lastName: user.lastName || user.name?.split(" ")[1] || "",
            phoneNumber: user.phoneNumber || "",
          });
          setAvatarPreview(user.avatarUrl || user.avatar || null);
        }
        setError("Could not load profile from server.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Auto-clear saved banner
  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 3000);
    return () => clearTimeout(t);
  }, [saved]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || form.firstName.trim().length < 2) {
      setError("First name must be at least 2 characters.");
      return;
    }
    if (!form.lastName.trim() || form.lastName.trim().length < 2) {
      setError("Last name must be at least 2 characters.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const updated = await updateProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phoneNumber: form.phoneNumber.trim() || undefined,
      });
      setProfile(updated);
      persistUserUpdate({
        firstName: updated.firstName,
        lastName: updated.lastName,
        phoneNumber: updated.phoneNumber,
        name: `${updated.firstName} ${updated.lastName}`.trim(),
      });
      setSaved(true);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);

    setUploadingAvatar(true);
    setError("");
    try {
      const updated = await uploadAvatar(file);
      setProfile(updated);
      setAvatarPreview(updated.avatarUrl);
      persistUserUpdate({ avatarUrl: updated.avatarUrl, avatar: updated.avatarUrl });
      setSaved(true);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to upload avatar.");
      // Revert preview on failure
      setAvatarPreview(profile?.avatarUrl || null);
    } finally {
      setUploadingAvatar(false);
      // Reset file input so same file can be re-selected
      e.target.value = "";
    }
  };

  const initials = [form.firstName, form.lastName]
    .filter(Boolean)
    .map((s) => s[0])
    .join("")
    .toUpperCase() || "R";

  const email = profile?.email || getCurrentUser()?.email || "";

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--primary)" }} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl font-semibold mb-6" style={{ color: "var(--text)" }}>
        Profile Settings
      </h1>

      {/* Avatar section */}
      <div className="flex items-center gap-5 mb-8">
        <div className="relative">
          <button
            type="button"
            onClick={handleAvatarClick}
            disabled={uploadingAvatar}
            className="relative w-20 h-20 rounded-full overflow-hidden border-2 focus:outline-none focus:ring-2 transition-opacity"
            style={{ borderColor: "var(--primary)", opacity: uploadingAvatar ? 0.6 : 1 }}
            aria-label="Change profile picture"
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Profile avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-2xl font-bold"
                style={{ background: "var(--primary)", color: "var(--primary-ink, #fff)" }}
              >
                {initials}
              </div>
            )}

            {/* Hover overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.45)" }}
            >
              {uploadingAvatar ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              )}
            </div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
            aria-label="Upload profile picture"
          />
        </div>

        <div>
          <p className="font-medium" style={{ color: "var(--text)" }}>
            {form.firstName} {form.lastName}
          </p>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
            Click the photo to upload a new one
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            JPG, PNG or GIF · Max 100 MB
          </p>
        </div>
      </div>

      {/* Profile form */}
      <form onSubmit={handleSave} className="space-y-5">
        {/* Name row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1.5" style={{ color: "var(--muted)" }}>
              First Name <span className="text-rose-400">*</span>
            </label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First name"
              className="w-full px-3 py-2 rounded-xl text-sm border outline-none focus:ring-1"
              style={{
                background: "var(--card)",
                borderColor: "var(--line)",
                color: "var(--text)",
              }}
              required
              minLength={2}
              maxLength={50}
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: "var(--muted)" }}>
              Last Name <span className="text-rose-400">*</span>
            </label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className="w-full px-3 py-2 rounded-xl text-sm border outline-none focus:ring-1"
              style={{
                background: "var(--card)",
                borderColor: "var(--line)",
                color: "var(--text)",
              }}
              required
              minLength={2}
              maxLength={50}
            />
          </div>
        </div>

        {/* Email — read-only */}
        <div>
          <label className="block text-sm mb-1.5" style={{ color: "var(--muted)" }}>
            Email Address
          </label>
          <div className="relative">
            <input
              value={email}
              readOnly
              disabled
              className="w-full px-3 py-2 rounded-xl text-sm border cursor-not-allowed"
              style={{
                background: "var(--card)",
                borderColor: "var(--line)",
                color: "var(--muted)",
                opacity: 0.7,
              }}
              aria-label="Email address (cannot be changed)"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded-full"
              style={{ background: "var(--line)", color: "var(--muted)" }}
            >
              locked
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            Email cannot be changed. Contact support if needed.
          </p>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm mb-1.5" style={{ color: "var(--muted)" }}>
            Phone Number
          </label>
          <input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="+1 555 000 0000"
            className="w-full px-3 py-2 rounded-xl text-sm border outline-none focus:ring-1"
            style={{
              background: "var(--card)",
              borderColor: "var(--line)",
              color: "var(--text)",
            }}
            maxLength={20}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-rose-400">{error}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-xl text-sm font-medium transition-opacity disabled:opacity-60"
            style={{ background: "var(--primary)", color: "var(--primary-ink, #fff)" }}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>

          {saved && (
            <span className="text-sm flex items-center gap-1.5" style={{ color: "#4ade80" }}>
              <svg viewBox="0 0 20 20" className="w-4 h-4" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
