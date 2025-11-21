import apiClient from "../../../shared/http/client";

const USE_MOCK = !import.meta.env.VITE_API_URL;
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

let MOCK_RETAILER_IMPORTS = [
  {
    id: "ret-csv-001",
    fileName: "retailers-april.csv",
    status: "completed",
    createdAt: "2025-04-12 10:02",
    processedAt: "2025-04-12 10:05",
  },
  {
    id: "ret-csv-002",
    fileName: "stores-week22.csv",
    status: "failed",
    createdAt: "2025-05-28 08:15",
    processedAt: "2025-05-28 08:17",
  },
  {
    id: "ret-csv-003",
    fileName: "retailers-october.csv",
    status: "processing",
    createdAt: "2025-10-02 09:45",
    processedAt: null,
  },
];

export async function uploadRetailerCsv(formData) {
  if (USE_MOCK) {
    await delay();
    const file = formData?.get?.("file");
    const fileName = file?.name || "retailers-upload.csv";
    const entry = {
      id: `ret-csv-${Date.now()}`,
      fileName,
      status: "processing",
      createdAt: new Date().toLocaleString(),
      processedAt: null,
    };
    MOCK_RETAILER_IMPORTS = [entry, ...MOCK_RETAILER_IMPORTS];
    return entry;
  }
  const res = await apiClient.post("/retailers/import-csv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function fetchRetailerCsvImports(params = {}, signal) {
  if (USE_MOCK) {
    await delay();
    const start = ((params.page || 1) - 1) * (params.limit || 20);
    const end = start + (params.limit || 20);
    return {
      items: MOCK_RETAILER_IMPORTS.slice(start, end).map((item) => ({
        ...item,
      })),
      total: MOCK_RETAILER_IMPORTS.length,
    };
  }
  const res = await apiClient.get("/retailers/import-csv/logs", {
    params,
    signal,
  });
  return res.data;
}
