import client from "../../shared/http/client";
const USE_MOCK = !import.meta.env.VITE_API_URL;

const sleep = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export async function signIn({ email, password }) {
  if (USE_MOCK) {
    await sleep();
    if (!email || !password) throw new Error("Enter credentials");
    return { ok: true, token: "dev-token", user: { email, role: "retailer" } };
  }
  
  try {
    // Use the auth endpoint (not retailer-specific)
    const response = await client.post("/auth/login", { 
      email, 
      password,
      role: "retailer" // Specify we're logging in as retailer
    });
    
    // Transform backend response to match frontend expectations
    const backendData = response.data;
    if (backendData.success && backendData.data) {
      const transformedResponse = {
        ok: true,
        token: backendData.data.accessToken,
        refreshToken: backendData.data.refreshToken,
        user: backendData.data.user
      };
      return transformedResponse;
    } else {
      throw new Error(backendData.message || "Login failed");
    }
  } catch (error) {
    // Handle different error types
    if (error.response?.status === 401) {
      throw new Error("Invalid email or password");
    } else if (error.response?.status === 403) {
      throw new Error("Access denied. Please check your role permissions.");
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Login failed. Please try again.");
    }
  }
}

// Minimal signOut + helpers so other modules can import them.
const STORAGE_KEY = "zavolla_auth";

export async function signOut() {
  try {
    // Call backend logout to invalidate refresh token
    const refreshToken = localStorage.getItem("refresh_token");
    await client.post("/auth/logout", { refreshToken }).catch(() => {
      // Ignore errors - still clear local storage
    });
  } finally {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    sessionStorage.removeItem(STORAGE_KEY);
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
