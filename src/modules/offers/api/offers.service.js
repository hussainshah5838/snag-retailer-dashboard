import apiClient from "../../../shared/http/client";
import { loadMock, saveMock } from "../../../shared/mockStorage";

const USE_MOCK = !import.meta.env.VITE_API_URL;
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const DEFAULT_OFFERS = [
  {
    id: "off-1",
    name: "20% Off Summer Sale",
    description: "Get 20% off all items during our summer promotion.",
    retailerName: "City Grocers",
    status: "live",
    startAt: "2025-06-01",
    endAt: "2025-08-31",
    timeFrom: "08:00",
    timeTo: "22:00",
    templateId: "tpl-percent",
    templateName: "Percent Off",
    discountType: "percent",
    discountValue: 20,
    radiusKm: 5,
    maxRedemptions: 2500,
    maxPerUser: 3,
    minSpend: 10,
    imageUrl: "https://placehold.co/240x180?text=Summer",
    stores: ["store-001"],
    redemptions: 1247,
    impressions: 8932,
  },
];

let MOCK_OFFERS = loadMock("MOCK_OFFERS", DEFAULT_OFFERS);

export async function fetchOffers(params = {}, signal) {
  if (USE_MOCK) {
    await delay();
    let items = [...MOCK_OFFERS];
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q)
      );
    }
    if (params.status) {
      items = items.filter(
        (o) => o.status?.toLowerCase() === params.status.toLowerCase()
      );
    }
    const start = ((params.page || 1) - 1) * (params.limit || 20);
    const end = start + (params.limit || 20);
    const normalized = items.slice(start, end).map((offer) => ({ ...offer }));
    return { items: normalized, total: items.length };
  }
  const res = await apiClient.get("/offers", { params, signal });
  return res.data;
}

export async function fetchOfferById(id, signal) {
  if (USE_MOCK) {
    await delay();
    return MOCK_OFFERS.find((offer) => offer.id === id) || null;
  }
  const res = await apiClient.get(`/offers/${id}`, { signal });
  return res.data;
}

export async function createOffer(payload) {
  if (USE_MOCK) {
    await delay();
    const offer = {
      id: payload.id || `off-${Date.now()}`,
      name: payload.name || "New Offer",
      description: payload.description || "",
      retailerName: payload.retailerName || "Demo Retailer",
      status: payload.status || "scheduled",
      templateId: payload.templateId || "tpl-percent",
      templateName: payload.templateName || "Percent Off",
      discountType: payload.discountType || "percent",
      discountValue:
        payload.discountValue !== undefined ? Number(payload.discountValue) : 0,
      startAt: payload.startAt || new Date().toISOString().slice(0, 10),
      endAt: payload.endAt || "",
      timeFrom: payload.timeFrom || "",
      timeTo: payload.timeTo || "",
      radiusKm:
        payload.radiusKm !== undefined ? Number(payload.radiusKm) : undefined,
      maxRedemptions:
        payload.maxRedemptions !== undefined
          ? Number(payload.maxRedemptions)
          : undefined,
      maxPerUser:
        payload.maxPerUser !== undefined ? Number(payload.maxPerUser) : undefined,
      minSpend:
        payload.minSpend !== undefined ? Number(payload.minSpend) : undefined,
      imageUrl: payload.imageUrl || "",
      stores: payload.stores || [],
      redemptions: 0,
      impressions: 0,
    };
    MOCK_OFFERS = [offer, ...MOCK_OFFERS];
    saveMock("MOCK_OFFERS", MOCK_OFFERS);
    return offer;
  }
  const res = await apiClient.post("/offers", payload);
  return res.data;
}

export async function updateOffer(id, payload) {
  if (USE_MOCK) {
    await delay();
    let updated = null;
    MOCK_OFFERS = MOCK_OFFERS.map((offer) => {
      if (offer.id !== id) return offer;
      updated = { ...offer, ...payload };
      return updated;
    });
    saveMock("MOCK_OFFERS", MOCK_OFFERS);
    return updated;
  }
  const res = await apiClient.put(`/offers/${id}`, payload);
  return res.data;
}

export async function deleteOffer(id) {
  if (USE_MOCK) {
    await delay();
    MOCK_OFFERS = MOCK_OFFERS.filter((offer) => offer.id !== id);
    saveMock("MOCK_OFFERS", MOCK_OFFERS);
    return { success: true };
  }
  const res = await apiClient.delete(`/offers/${id}`);
  return res.data;
}
