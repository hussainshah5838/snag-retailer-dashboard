import apiClient from "../../../shared/http/client";

const unwrap = (res) =>
  res.data.success && res.data.data ? res.data.data : res.data;

export async function fetchPromotionRules(params = {}, signal) {
  const res = await apiClient.get("/retailer/promotion-limits", { params, signal });
  const data = unwrap(res);
  return { items: data.items || [], total: data.total || 0 };
}

export async function createPromotionRule(payload) {
  const res = await apiClient.post("/retailer/promotion-limits", payload);
  return unwrap(res);
}

export async function updatePromotionRule(id, payload) {
  const res = await apiClient.put(`/retailer/promotion-limits/${id}`, payload);
  return unwrap(res);
}

export async function deletePromotionRule(id) {
  const res = await apiClient.delete(`/retailer/promotion-limits/${id}`);
  return unwrap(res);
}

// Kept for backward compatibility - LiveOfferConstraintSettings uses these
export async function fetchLiveOfferConstraint(signal) {
  // Return hardcoded default until backend implements this
  return { enforceSingleLiveOffer: true, resolutionStrategy: "block" };
}

export async function updateLiveOfferConstraint(payload) {
  // No-op until backend implements this
  return payload;
}
