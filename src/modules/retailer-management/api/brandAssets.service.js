import apiClient from "../../../shared/http/client";

const unwrap = (res) =>
  res.data.success && res.data.data ? res.data.data : res.data;

export async function fetchBrandAssets(params = {}, signal) {
  const res = await apiClient.get("/retailer/brand-assets", { params, signal });
  return unwrap(res);
}

export async function uploadBrandAssetLogo(id, file) {
  const formData = new FormData();
  formData.append("logo", file);
  const res = await apiClient.post(`/retailer/brand-assets/${id}/upload-logo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrap(res);
}

export async function removeBrandAssetLogo(id) {
  const res = await apiClient.delete(`/retailer/brand-assets/${id}/logo`);
  return unwrap(res);
}
