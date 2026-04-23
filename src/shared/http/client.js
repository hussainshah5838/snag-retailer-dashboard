import axios from "axios";

const base = import.meta.env.VITE_API_URL || "/api";

const client = axios.create({ baseURL: base });

// Add request interceptor to include auth token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 if we're not on the login page and have a token
    if (error.response?.status === 401 && 
        !window.location.pathname.includes('/login') && 
        localStorage.getItem("auth_token")) {
      // Clear auth data and redirect to login
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("zavolla_auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default client;
