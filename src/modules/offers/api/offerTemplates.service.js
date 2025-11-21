import apiClient from "../../../shared/http/client";
import { loadMock, saveMock } from "../../../shared/mockStorage";

const USE_MOCK = !import.meta.env.VITE_API_URL;
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const DEFAULT_TEMPLATES = [
  {
    id: "tpl-percent",
    name: "Percent Off",
    type: "percent",
    description: "Apply a percentage discount to eligible items.",
  },
  {
    id: "tpl-bogo",
    name: "BOGO Classic",
    type: "bogo",
    description: "Buy X get Y free promotions using quantity rules.",
  },
  {
    id: "tpl-custom",
    name: "Custom Experience",
    type: "custom",
    description: "Custom template for advanced experiences.",
  },
];
let MOCK_TEMPLATES = loadMock("MOCK_TEMPLATES", DEFAULT_TEMPLATES);
export async function fetchOfferTemplates(params = {}, signal) {
  if (USE_MOCK) {
    await delay();
    const start = ((params.page || 1) - 1) * (params.limit || 20);
    const end = start + (params.limit || 20);
    const items = MOCK_TEMPLATES.slice(start, end).map((t) => ({ ...t }));
    return { items, total: MOCK_TEMPLATES.length };
  }
  const res = await apiClient.get("/offer-templates", { params, signal });
  return res.data;
}

export async function fetchOfferTemplateById(id, signal) {
  if (USE_MOCK) {
    await delay();
    return MOCK_TEMPLATES.find((t) => t.id === id) || null;
  }
  const res = await apiClient.get(`/offer-templates/${id}`, { signal });
  return res.data;
}

export async function createOfferTemplate(payload) {
  if (USE_MOCK) {
    await delay();
    const tpl = {
      id: payload.id || `tpl-${Date.now()}`,
      name: payload.name || "New Template",
      type: payload.type || "custom",
      description: payload.description || "",
    };
    MOCK_TEMPLATES = [tpl, ...MOCK_TEMPLATES];
    saveMock("MOCK_TEMPLATES", MOCK_TEMPLATES);
    return tpl;
  }
  const res = await apiClient.post("/offer-templates", payload);
  return res.data;
}

export async function updateOfferTemplate(id, payload) {
  if (USE_MOCK) {
    await delay();
    let updated = null;
    MOCK_TEMPLATES = MOCK_TEMPLATES.map((t) => {
      if (t.id !== id) return t;
      updated = { ...t, ...payload };
      return updated;
    });
    saveMock("MOCK_TEMPLATES", MOCK_TEMPLATES);
    return updated;
  }
  const res = await apiClient.put(`/offer-templates/${id}`, payload);
  return res.data;
}

export async function deleteOfferTemplate(id) {
  if (USE_MOCK) {
    await delay();
    MOCK_TEMPLATES = MOCK_TEMPLATES.filter((t) => t.id !== id);
    saveMock("MOCK_TEMPLATES", MOCK_TEMPLATES);
    return { success: true };
  }
  const res = await apiClient.delete(`/offer-templates/${id}`);
  return res.data;
}
