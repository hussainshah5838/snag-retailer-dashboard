import apiClient from "../../../shared/http/client";

const USE_MOCK = !import.meta.env.VITE_API_URL;
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

let MOCK_OFFER_IMPORTS = [
  {
    id: "offer-csv-001",
    fileName: "offers-q3.csv",
    status: "completed",
    createdAt: "2025-09-10 09:21",
    processedAt: "2025-09-10 09:23",
  },
  {
    id: "offer-csv-002",
    fileName: "holiday-promo.csv",
    status: "processing",
    createdAt: "2025-11-05 12:04",
    processedAt: null,
  },
];

export async function uploadOfferCsv(formData) {
  if (USE_MOCK) {
    await delay();
    const file = formData?.get?.("file");
    const entry = {
      id: `offer-csv-${Date.now()}`,
      fileName: file?.name || "offers-upload.csv",
      status: "processing",
      createdAt: new Date().toLocaleString(),
      processedAt: null,
    };
    MOCK_OFFER_IMPORTS = [entry, ...MOCK_OFFER_IMPORTS];
    return entry;
  }
  const res = await apiClient.post("/offers/import-csv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function fetchOfferCsvImports(params = {}, signal) {
  if (USE_MOCK) {
    await delay();
    const start = ((params.page || 1) - 1) * (params.limit || 20);
    const end = start + (params.limit || 20);
    return {
      items: MOCK_OFFER_IMPORTS.slice(start, end).map((item) => ({ ...item })),
      total: MOCK_OFFER_IMPORTS.length,
    };
  }
  const res = await apiClient.get("/offers/import-csv/logs", {
    params,
    signal,
  });
  return res.data;
}
