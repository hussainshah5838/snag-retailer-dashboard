import apiClient from "../../../shared/http/client";

const unwrap = (res) =>
  res.data.success && res.data.data ? res.data.data : res.data;

export async function fetchMerchants(params = {}, signal) {
  const res = await apiClient.get("/retailer/merchants", { params, signal });
  return unwrap(res);
}

export async function fetchMerchantById(id, signal) {
  const res = await apiClient.get(`/retailer/merchants/${id}`, { signal });
  return unwrap(res);
}

export async function createMerchant(payload) {
  const res = await apiClient.post("/retailer/merchants", payload);
  return unwrap(res);
}

export async function updateMerchant(id, payload) {
  const res = await apiClient.put(`/retailer/merchants/${id}`, payload);
  return unwrap(res);
}

export async function deactivateMerchant(id) {
  const res = await apiClient.put(`/retailer/merchants/${id}/deactivate`);
  return unwrap(res);
}

export async function activateMerchant(id) {
  const res = await apiClient.put(`/retailer/merchants/${id}/activate`);
  return unwrap(res);
}
