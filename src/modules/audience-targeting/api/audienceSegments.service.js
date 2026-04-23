import apiClient from "../../../shared/http/client";

const unwrap = (res) =>
  res.data.success && res.data.data ? res.data.data : res.data;

/** Normalize filters - backend stores arrays, frontend uses comma strings */
const normalizeFilters = (filters = {}) => ({
  ...filters,
  interests:    Array.isArray(filters.interests)
    ? filters.interests.join(', ')
    : (filters.interests || ''),
  behaviorTags: Array.isArray(filters.behaviorTags)
    ? filters.behaviorTags.join(', ')
    : (filters.behaviorTags || ''),
});

export async function fetchAudienceSegments(params = {}, signal) {
  const res = await apiClient.get("/retailer/audience", { params, signal });
  const data = unwrap(res);
  return {
    items: (data.items || []).map((s) => ({
      ...s,
      filters: normalizeFilters(s.filters),
      userCount:     s.estimatedSize ?? 0,
      estimatedSize: s.estimatedSize ?? 0,
    })),
    total: data.total || 0,
  };
}

export async function createAudienceSegment(payload) {
  const res = await apiClient.post("/retailer/audience", payload);
  return unwrap(res);
}

export async function updateAudienceSegment(id, payload) {
  const res = await apiClient.put(`/retailer/audience/${id}`, payload);
  return unwrap(res);
}

export async function deleteAudienceSegment(id) {
  const res = await apiClient.delete(`/retailer/audience/${id}`);
  return unwrap(res);
}
