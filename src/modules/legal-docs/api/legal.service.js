import apiClient from "../../../shared/http/client";

const unwrap = (res) =>
  res.data.success && res.data.data ? res.data.data : res.data;

export async function fetchLegalDocs(params = {}, signal) {
  const res = await apiClient.get("/retailer/legal", { params, signal });
  const data = unwrap(res);
  return { items: data.items || [] };
}

export async function createLegalDoc(payload, file) {
  const formData = new FormData();
  formData.append("title",   payload.title);
  formData.append("type",    payload.type || "other");
  formData.append("version", payload.version);
  if (payload.content) formData.append("content", payload.content);
  if (file)            formData.append("file",    file);

  const res = await apiClient.post("/retailer/legal", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrap(res);
}

export async function updateLegalDoc(id, payload, file) {
  const formData = new FormData();
  if (payload.title)   formData.append("title",   payload.title);
  if (payload.type)    formData.append("type",    payload.type);
  if (payload.version) formData.append("version", payload.version);
  if (payload.content) formData.append("content", payload.content);
  if (file)            formData.append("file",    file);

  const res = await apiClient.put(`/retailer/legal/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrap(res);
}

export async function deleteLegalDoc(id) {
  const res = await apiClient.delete(`/retailer/legal/${id}`);
  return unwrap(res);
}

// Kept for backward compatibility
export async function fetchLatestTerms(signal) {
  return { version: "", updatedAt: "", content: "" };
}
