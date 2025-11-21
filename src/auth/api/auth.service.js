import client from "../../shared/http/client";
const USE_MOCK = !import.meta.env.VITE_API_URL;

const sleep = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export async function signIn({ email, password }) {
  if (USE_MOCK) {
    await sleep();
    if (!email || !password) throw new Error("Enter credentials");
    return { ok: true, token: "dev-token", user: { email } };
  }
  const { data } = await client.post("/auth/login", { email, password });
  return data;
}

// Minimal signOut + helpers so other modules can import them.
const STORAGE_KEY = "zavolla_auth";

export function signOut() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function getAuth() {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!getAuth();
}

export function getCurrentUser() {
  const a = getAuth();
  return a?.user ?? null;
}

export default { signIn, signOut, getAuth, isAuthenticated, getCurrentUser };
