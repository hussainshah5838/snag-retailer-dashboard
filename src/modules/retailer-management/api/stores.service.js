import apiClient from "../../../shared/http/client";

const USE_MOCK = !import.meta.env.VITE_API_URL;
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

let MOCK_STORES = [
  {
    id: "store-001",
    retailerId: "ret-001",
    name: "City Grocers - Downtown",
    address: "12 Main Street, Springfield",
    storeNumber: "1001",
    appStoreId: "cg-1001",
  },
  {
    id: "store-002",
    retailerId: "ret-001",
    name: "City Grocers - Riverside",
    address: "82 River Road, Springfield",
    storeNumber: "1002",
    appStoreId: "cg-1002",
  },
  {
    id: "store-003",
    retailerId: "ret-002",
    name: "Fresh Eats West",
    address: "45 Sunset Blvd, Austin",
    storeNumber: "FE-01",
    appStoreId: "fe-01",
  },
];

export async function fetchStores(params = {}, signal) {
  if (USE_MOCK) {
    await delay();
    let items = [...MOCK_STORES];
    if (params.retailerId) {
      items = items.filter((store) => store.retailerId === params.retailerId);
    }
    const start = ((params.page || 1) - 1) * (params.limit || 20);
    const end = start + (params.limit || 20);
    return {
      items: items.slice(start, end).map((store) => ({ ...store })),
      total: items.length,
    };
  }
  const res = await apiClient.get("/stores", { params, signal });
  return res.data;
}

export async function fetchStoreById(id, signal) {
  if (USE_MOCK) {
    await delay();
    return MOCK_STORES.find((store) => store.id === id) || null;
  }
  const res = await apiClient.get(`/stores/${id}`, { signal });
  return res.data;
}

export async function createStore(payload) {
  if (USE_MOCK) {
    await delay();
    const store = {
      id: payload.id || `store-${Date.now()}`,
      retailerId: payload.retailerId || "ret-001",
      name: payload.name || "New Store",
      address: payload.address || "Address TBD",
      storeNumber: payload.storeNumber || "0000",
      appStoreId: payload.appStoreId || "store-app",
    };
    MOCK_STORES = [store, ...MOCK_STORES];
    return store;
  }
  const res = await apiClient.post("/stores", payload);
  return res.data;
}

export async function updateStore(id, payload) {
  if (USE_MOCK) {
    await delay();
    let updated = null;
    MOCK_STORES = MOCK_STORES.map((store) => {
      if (store.id !== id) return store;
      updated = { ...store, ...payload };
      return updated;
    });
    return updated;
  }
  const res = await apiClient.put(`/stores/${id}`, payload);
  return res.data;
}

export async function softDeleteStore(id) {
  if (USE_MOCK) {
    await delay();
    MOCK_STORES = MOCK_STORES.filter((store) => store.id !== id);
    return { success: true };
  }
  const res = await apiClient.delete(`/stores/${id}`);
  return res.data;
}
