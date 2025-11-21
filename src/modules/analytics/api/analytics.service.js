import apiClient from "../../../shared/http/client";

const USE_MOCK = !import.meta.env.VITE_API_URL;
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MOCK_OFFER_ANALYTICS = DAYS.map((label, idx) => ({
  id: `offer-metric-${idx}`,
  label,
  views: 800 + idx * 60 + idx * idx,
  impressions: 1200 + idx * 80 + idx * 10,
  redemptions: 120 + idx * 8,
}));

const MOCK_STORE_ANALYTICS = [
  {
    id: "store-1",
    storeName: "Downtown Flagship",
    views: 3200,
    redemptions: 480,
  },
  {
    id: "store-2",
    storeName: "Mall Kiosk",
    views: 2200,
    redemptions: 310,
  },
  { id: "store-3", storeName: "Airport Pop-up", views: 1800, redemptions: 240 },
  {
    id: "store-4",
    storeName: "Suburban Outlet",
    views: 2650,
    redemptions: 365,
  },
];

export async function fetchOfferAnalytics(params = {}, signal) {
  if (USE_MOCK) {
    await delay();
    return [];
  }
  const res = await apiClient.get("/analytics/offers", { params, signal });
  return res.data;
}

export async function fetchStoreAnalytics(params = {}, signal) {
  if (USE_MOCK) {
    await delay();
    return [];
  }
  const res = await apiClient.get("/analytics/stores", { params, signal });
  return res.data;
}

export async function fetchSegmentAnalytics(params = {}, signal) {
  if (USE_MOCK) {
    await delay();
    return [];
  }
  const res = await apiClient.get("/analytics/segments", { params, signal });
  return res.data;
}

export async function exportAnalyticsReport(params = {}) {
  if (USE_MOCK) {
    await delay();
    const header = "label,views,redemptions\n";
    const rows = MOCK_OFFER_ANALYTICS.map(
      (row) => `${row.label},${row.views},${row.redemptions}`
    ).join("\n");
    return new Blob([header + rows], { type: "text/csv" });
  }
  const res = await apiClient.get("/analytics/export", {
    params,
    responseType: "blob",
  });
  return res.data;
}
// Analytics service removed. Keep stub functions to avoid runtime import errors.
export async function fetchOfferAnalytics() {
  return [];
}

export async function fetchStoreAnalytics() {
  return [];
}

export async function fetchSegmentAnalytics() {
  return [];
}
