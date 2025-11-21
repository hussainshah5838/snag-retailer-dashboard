import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../../auth/api/auth.service";

export default function ProfileSettings() {
  const current = getCurrentUser() || {};
  const [name, setName] = useState(current.name || "");
  const [email, setEmail] = useState(current.email || "");
  const [avatar, setAvatar] = useState(current.avatar || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => setSaved(false), 2500);
      return () => clearTimeout(t);
    }
  }, [saved]);

  function handleSave(e) {
    e.preventDefault();
    // In a real app you'd call an API. Here we store to sessionStorage for dev.
    try {
      const payload = { user: { name, email, avatar } };
      sessionStorage.setItem("dev_profile", JSON.stringify(payload));
      setSaved(true);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-lg font-semibold">Profile Settings</h1>

      <form onSubmit={handleSave} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full input px-3 py-2 rounded-xl text-sm"
            style={{
              background: "var(--card)",
              borderColor: "var(--line)",
              color: "var(--text)",
            }}
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full input px-3 py-2 rounded-xl text-sm"
            style={{
              background: "var(--card)",
              borderColor: "var(--line)",
              color: "var(--text)",
            }}
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Avatar URL</label>
          <input
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="w-full input px-3 py-2 rounded-xl text-sm"
            style={{
              background: "var(--card)",
              borderColor: "var(--line)",
              color: "var(--text)",
            }}
            placeholder="https://..."
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg font-medium"
            style={{
              background: "var(--primary)",
              color: "var(--primary-ink)",
            }}
          >
            Save
          </button>
          {saved && <div className="text-sm muted">Saved</div>}
        </div>
      </form>
    </div>
  );
}
