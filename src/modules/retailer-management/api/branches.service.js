import apiClient from "../../../shared/http/client";

const unwrap = (res) =>
  res.data.success && res.data.data ? res.data.data : res.data;

export async function fetchBranches(params = {}, signal) {
  const res = await apiClient.get("/retailer/branches", { params, signal });
  return unwrap(res);
}

export async function fetchMerchantsDropdown(signal) {
  const res = await apiClient.get("/retailer/branches/merchants", { signal });
  return unwrap(res);
}

export async function createBranch(formData) {
  const res = await apiClient.post("/retailer/branches", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrap(res);
}

export async function updateBranch(id, formData) {
  const res = await apiClient.put(`/retailer/branches/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrap(res);
}

export async function deleteBranch(id) {
  const res = await apiClient.delete(`/retailer/branches/${id}`);
  return unwrap(res);
}