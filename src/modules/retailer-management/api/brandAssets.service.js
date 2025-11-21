import apiClient from "../../../shared/http/client";

const USE_MOCK = !import.meta.env.VITE_API_URL;
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

let MOCK_BRAND_ASSETS = [
  {
    id: "asset-1",
    label: "Primary Logo",
    url: "https://placehold.co/200x120?text=Logo",
  },
  {
    id: "asset-2",
    label: "Dark Theme Badge",
    url: "https://placehold.co/200x120?text=Dark+Badge",
  },
  {
    id: "asset-3",
    label: "Lifestyle Photo",
    url: "https://placehold.co/200x120?text=Photo",
  },
];

export async function fetchBrandAssets(params = {}, signal) {
  if (USE_MOCK) {
    await delay();
    return MOCK_BRAND_ASSETS.map((asset) => ({ ...asset }));
  }
  const res = await apiClient.get("/brand-assets", { params, signal });
  return res.data;
}

export async function uploadBrandAsset(formData) {
  if (USE_MOCK) {
    await delay();
    const label = formData?.get?.("label") || "Untitled Asset";
    const file = formData?.get?.("file");
    let previewUrl = `https://placehold.co/200x120?text=${encodeURIComponent(
      label
    )}`;
    if (file instanceof Blob && typeof URL !== "undefined") {
      try {
        previewUrl = URL.createObjectURL(file);
      } catch {
        // Fallback to placeholder URL above if object URL fails.
      }
    }
    const asset = {
      id: `asset-${Date.now()}`,
      label,
      url: previewUrl,
    };
    MOCK_BRAND_ASSETS = [asset, ...MOCK_BRAND_ASSETS];
    return asset;
  }
  const res = await apiClient.post("/brand-assets", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateBrandAsset(id, payload) {
  if (USE_MOCK) {
    await delay();
    let updated = null;
    MOCK_BRAND_ASSETS = MOCK_BRAND_ASSETS.map((asset) => {
      if (asset.id !== id) return asset;
      updated = { ...asset, ...payload };
      return updated;
    });
    return updated;
  }
  const res = await apiClient.put(`/brand-assets/${id}`, payload);
  return res.data;
}

export async function deleteBrandAsset(id) {
  if (USE_MOCK) {
    await delay();
    MOCK_BRAND_ASSETS = MOCK_BRAND_ASSETS.filter((asset) => asset.id !== id);
    return { success: true };
  }
  const res = await apiClient.delete(`/brand-assets/${id}`);
  return res.data;
}
