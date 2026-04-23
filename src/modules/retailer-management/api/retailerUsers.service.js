import apiClient from "../../../shared/http/client";

const USE_MOCK = true; // Force mock data for retailer users
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

let MOCK_RETAILER_USERS = [
  {
    id: "ret-user-1",
    retailerId: "ret-001",
    name: "Amelia Harper",
    email: "amelia@citygrocers.com",
    role: "Owner",
    status: "active",
  },
  {
    id: "ret-user-2",
    retailerId: "ret-001",
    name: "Jacob Price",
    email: "jacob@citygrocers.com",
    role: "Manager",
    status: "active",
  },
  {
    id: "ret-user-3",
    retailerId: "ret-002",
    name: "Ivy Carter",
    email: "ivy@fresheats.io",
    role: "Admin",
    status: "pending",
  },
];

export async function fetchRetailerUsers(params = {}, signal) {
  if (USE_MOCK) {
    await delay();
    let items = [...MOCK_RETAILER_USERS];
    if (params.retailerId) {
      items = items.filter((user) => user.retailerId === params.retailerId);
    }
    const start = ((params.page || 1) - 1) * (params.limit || 20);
    const end = start + (params.limit || 20);
    return {
      items: items.slice(start, end).map((user) => ({ ...user })),
      total: items.length,
    };
  }
  const res = await apiClient.get("/retailer-users", { params, signal });
  return res.data;
}

export async function createRetailerUser(payload) {
  if (USE_MOCK) {
    await delay();
    const user = {
      id: payload.id || `ret-user-${Date.now()}`,
      retailerId: payload.retailerId || "ret-001",
      name: payload.name || "Retailer User",
      email: payload.email || "user@example.com",
      role: payload.role || "Manager",
      status: payload.status || "active",
    };
    MOCK_RETAILER_USERS = [user, ...MOCK_RETAILER_USERS];
    return user;
  }
  const res = await apiClient.post("/retailer-users", payload);
  return res.data;
}

export async function updateRetailerUser(id, payload) {
  if (USE_MOCK) {
    await delay();
    let updated = null;
    MOCK_RETAILER_USERS = MOCK_RETAILER_USERS.map((user) => {
      if (user.id !== id) return user;
      updated = { ...user, ...payload };
      return updated;
    });
    return updated;
  }
  const res = await apiClient.put(`/retailer-users/${id}`, payload);
  return res.data;
}

export async function deactivateRetailerUser(id) {
  if (USE_MOCK) {
    await delay();
    MOCK_RETAILER_USERS = MOCK_RETAILER_USERS.map((user) =>
      user.id === id ? { ...user, status: "inactive" } : user
    );
    return { success: true };
  }
  const res = await apiClient.delete(`/retailer-users/${id}`);
  return res.data;
}
