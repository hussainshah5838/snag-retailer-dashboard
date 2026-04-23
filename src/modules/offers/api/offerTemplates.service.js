import apiClient from "../../../shared/http/client";

const unwrap = (res) =>
  res.data.success && res.data.data ? res.data.data : res.data;

export async function fetchOfferTemplates(params = {}, signal) {
  const res = await apiClient.get("/retailer/templates", { params, signal });
  return unwrap(res);
}

export async function createOfferTemplate(payload) {
  const res = await apiClient.post("/retailer/templates", payload);
  return unwrap(res);
}

export async function updateOfferTemplate(id, payload) {
  const res = await apiClient.put(`/retailer/templates/${id}`, payload);
  return unwrap(res);
}

export async function deleteOfferTemplate(id) {
  const res = await apiClient.delete(`/retailer/templates/${id}`);
  return unwrap(res);
}
