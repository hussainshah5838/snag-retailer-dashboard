import apiClient from "../../../shared/http/client";
import { loadMock, saveMock } from "../../../shared/mockStorage";

const USE_MOCK = !import.meta.env.VITE_API_URL;
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const DEFAULT_RETAILERS = [
  {
    id: "ret-001",
    name: "City Grocers",
    email: "ops@citygrocers.com",
    contactNumber: "+1-555-0101",
    status: "active",
    termsAccepted: true,
    termsVersion: "2025.1",
  },
  {
    id: "ret-002",
    name: "Fresh Eats Collective",
    email: "hello@fresheats.io",
    contactNumber: "+1-555-0182",
    status: "pending",
    termsAccepted: false,
    termsVersion: "2025.1",
  },
  {
    id: "ret-003",
    name: "Glow Cosmetics",
    email: "support@glowcosmetics.com",
    contactNumber: "+1-555-0123",
    status: "active",
    termsAccepted: true,
    termsVersion: "2024.4",
  },
  {
    id: "ret-004",
    name: "Daily Grind Coffee",
    email: "contact@dailygrind.coffee",
    contactNumber: "+1-555-0145",
    status: "suspended",
    termsAccepted: true,
    termsVersion: "2025.1",
  },
];

let MOCK_RETAILERS = loadMock("MOCK_RETAILERS", DEFAULT_RETAILERS);

export async function fetchRetailers(params = {}, signal) {
  if (USE_MOCK) {
    await delay();
    let items = [...MOCK_RETAILERS];
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (r) =>
          r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
      );
    }
    if (params.status) {
      items = items.filter(
        (r) => r.status?.toLowerCase() === params.status.toLowerCase()
      );
    }
    const start = ((params.page || 1) - 1) * (params.limit || 20);
    const end = start + (params.limit || 20);
    return {
      items: items.slice(start, end).map((item) => ({ ...item })),
      total: items.length,
    };
  }
  const res = await apiClient.get("/retailers", { params, signal });
  return res.data;
}

export async function fetchRetailerById(id, signal) {
  if (USE_MOCK) {
    await delay();
    return MOCK_RETAILERS.find((r) => r.id === id) || null;
  }
  const res = await apiClient.get(`/retailers/${id}`, { signal });
  return res.data;
}

export async function createRetailer(payload) {
  if (USE_MOCK) {
    await delay();
    const retailer = {
      id: payload.id || `ret-${Date.now()}`,
      name: payload.name || "New Retailer",
      email: payload.email || "contact@example.com",
      contactNumber: payload.contactNumber || "",
      status: payload.status || "pending",
      termsAccepted: !!payload.termsAccepted,
      termsVersion: payload.termsVersion || "2025.1",
    };
    MOCK_RETAILERS = [retailer, ...MOCK_RETAILERS];
    saveMock("MOCK_RETAILERS", MOCK_RETAILERS);
    return retailer;
  }
  const res = await apiClient.post("/retailers", payload);
  return res.data;
}

export async function updateRetailer(id, payload) {
  if (USE_MOCK) {
    await delay();
    let updated = null;
    MOCK_RETAILERS = MOCK_RETAILERS.map((retailer) => {
      if (retailer.id !== id) return retailer;
      updated = { ...retailer, ...payload };
      return updated;
    });
    saveMock("MOCK_RETAILERS", MOCK_RETAILERS);
    return updated;
  }
  const res = await apiClient.put(`/retailers/${id}`, payload);
  return res.data;
}

export async function softDeleteRetailer(id) {
  if (USE_MOCK) {
    await delay();
    MOCK_RETAILERS = MOCK_RETAILERS.map((retailer) =>
      retailer.id === id ? { ...retailer, status: "inactive" } : retailer
    );
    saveMock("MOCK_RETAILERS", MOCK_RETAILERS);
    return { success: true };
  }
  const res = await apiClient.delete(`/retailers/${id}`);
  return res.data;
}
