import apiClient from "../../../shared/http/client";
import { loadMock, saveMock } from "../../../shared/mockStorage";

const USE_MOCK = !import.meta.env.VITE_API_URL;
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const DEFAULT_SEGMENTS = [
  {
    id: "seg-1",
    name: "High-Value Customers",
    description: "Customers with lifetime value > $1000",
    userCount: 3421,
    criteria: "LTV > $1000",
    createdAt: "2025-01-15",
  },
  {
    id: "seg-2",
    name: "Frequent Shoppers",
    description: "Users who made 5+ purchases in the last 90 days",
    userCount: 1892,
    criteria: "Purchases >= 5 (90 days)",
    createdAt: "2025-03-22",
  },
  {
    id: "seg-3",
    name: "New Users",
    description: "Registered within the last 30 days",
    userCount: 847,
    criteria: "Registration < 30 days",
    createdAt: "2025-10-01",
  },
  {
    id: "seg-4",
    name: "Cart Abandoners",
    description: "Added items to cart but didn't complete purchase",
    userCount: 2104,
    criteria: "Cart abandoned in last 7 days",
    createdAt: "2025-09-10",
  },
  {
    id: "seg-5",
    name: "Premium Members",
    description: "Users with active premium subscription",
    userCount: 567,
    criteria: "Premium = true",
    createdAt: "2025-02-18",
  },
];

let MOCK_SEGMENTS = loadMock("MOCK_SEGMENTS", DEFAULT_SEGMENTS);

export async function fetchAudienceSegments(params = {}, signal) {
  if (USE_MOCK) {
    await delay();
    let items = [...MOCK_SEGMENTS];
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }
    const start = ((params.page || 1) - 1) * (params.limit || 20);
    const end = start + (params.limit || 20);
    // Normalize to include estimatedSize field expected by table
    const normalized = items.slice(start, end).map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      estimatedSize: s.userCount ?? s.estimatedSize ?? 0,
      userCount: s.userCount ?? s.estimatedSize ?? 0,
      criteria: s.criteria,
      createdAt: s.createdAt,
      // include any stored filters so UI can render them
      filters: s.filters || {},
    }));
    return { items: normalized, total: items.length };
  }
  const res = await apiClient.get("/audience-segments", { params, signal });
  return res.data;
}

export async function fetchAudienceSegmentById(id, signal) {
  if (USE_MOCK) {
    await delay();
    return MOCK_SEGMENTS.find((s) => s.id === id) || null;
  }
  const res = await apiClient.get(`/audience-segments/${id}`, { signal });
  return res.data;
}

export async function createAudienceSegment(payload) {
  if (USE_MOCK) {
    await delay();
    const now = new Date().toISOString().slice(0, 10);
    const segment = {
      id: payload.id || `seg-${Date.now()}`,
      name: payload.name || "Untitled Segment",
      description: payload.description || "",
      criteria: payload.criteria || "Custom criteria",
      // persist filters coming from the form
      filters: payload.filters || {},
      createdAt: now,
      userCount: payload.estimatedSize ?? payload.userCount ?? 0,
      estimatedSize: payload.estimatedSize ?? payload.userCount ?? 0,
    };
    MOCK_SEGMENTS = [segment, ...MOCK_SEGMENTS];
    saveMock("MOCK_SEGMENTS", MOCK_SEGMENTS);
    return segment;
  }
  const res = await apiClient.post("/audience-segments", payload);
  return res.data;
}

export async function updateAudienceSegment(id, payload) {
  if (USE_MOCK) {
    await delay();
    let updated = null;
    MOCK_SEGMENTS = MOCK_SEGMENTS.map((segment) => {
      if (segment.id !== id) return segment;
      updated = {
        ...segment,
        ...payload,
        // persist filters when updating
        filters: payload.filters ?? segment.filters ?? {},
        userCount:
          payload.estimatedSize ?? payload.userCount ?? segment.userCount,
        estimatedSize:
          payload.estimatedSize ?? payload.userCount ?? segment.estimatedSize,
      };
      return updated;
    });
    saveMock("MOCK_SEGMENTS", MOCK_SEGMENTS);
    return updated;
  }
  const res = await apiClient.put(`/audience-segments/${id}`, payload);
  return res.data;
}

export async function deleteAudienceSegment(id) {
  if (USE_MOCK) {
    await delay();
    MOCK_SEGMENTS = MOCK_SEGMENTS.filter((segment) => segment.id !== id);
    saveMock("MOCK_SEGMENTS", MOCK_SEGMENTS);
    return { success: true };
  }
  const res = await apiClient.delete(`/audience-segments/${id}`);
  return res.data;
}
