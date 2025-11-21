import apiClient from "../../../shared/http/client";

const USE_MOCK = !import.meta.env.VITE_API_URL;
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_DOCS = [
  {
    id: "doc-terms",
    name: "Retailer Terms of Service",
    type: "terms",
    summary: "Latest retailer obligations for the Snagg platform.",
    content:
      "These Retailer Terms govern access to the Snagg promotions network. Retailers must ensure their offers comply with regional regulations and brand standards.",
    updatedAt: "2025-09-01",
  },
  {
    id: "doc-privacy",
    name: "Privacy Policy",
    type: "privacy",
    summary: "How customer data is processed and retained.",
    content:
      "Snagg processes customer data strictly for experience personalization and campaign measurement. Data is stored in ISO-compliant regions.",
    updatedAt: "2025-07-18",
  },
  {
    id: "doc-dpa",
    name: "Data Processing Agreement",
    type: "dpa",
    summary: "Data sharing obligations for enterprise retailers.",
    content:
      "This DPA defines processor responsibilities, audit rights, and sub-processor disclosures required for enterprise clients.",
    updatedAt: "2025-04-05",
  },
];

const MOCK_TERMS = {
  version: "2025.2",
  updatedAt: "2025-10-01",
  content: `1. Retailers must honor all live promotions.\n2. Offers cancel automatically when violating volume constraints.\n3. Snagg may audit performance data for accuracy.\n4. New clauses for geo-gated promotions require explicit approval.`,
};

export async function fetchLegalDocs(params = {}, signal) {
  if (USE_MOCK) {
    await delay();
    return { items: MOCK_DOCS.map((doc) => ({ ...doc })) };
  }
  const res = await apiClient.get("/legal/docs", { params, signal });
  return res.data;
}

export async function fetchLegalDocById(id, signal) {
  if (USE_MOCK) {
    await delay();
    return MOCK_DOCS.find((doc) => doc.id === id) || null;
  }
  const res = await apiClient.get(`/legal/docs/${id}`, { signal });
  return res.data;
}

export async function fetchLatestTerms(signal) {
  if (USE_MOCK) {
    await delay();
    return { ...MOCK_TERMS };
  }
  const res = await apiClient.get("/legal/terms/latest", { signal });
  return res.data;
}
