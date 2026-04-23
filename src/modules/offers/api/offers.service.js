import apiClient from "../../../shared/http/client";

const unwrap = (res) =>
  res.data.success && res.data.data ? res.data.data : res.data;

/** Normalize backend offer response to frontend shape */
const normalize = (offer) => ({
  id:                 offer.id,
  title:              offer.title,
  description:        offer.description,
  merchantId:         offer.merchantId,
  merchantName:       offer.merchantName,
  merchantEmail:      offer.merchantEmail,
  status:             offer.status,
  offerType:          offer.offerType,
  categories:         offer.categories ?? [],
  termsAndConditions: offer.termsAndConditions,
  discountType:       offer.discountType,
  couponCode:         offer.couponCode,
  redemptionLimit:    offer.redemptionLimit,
  startDate:          offer.startDate,
  endDate:            offer.endDate,
  bannerUrl:          offer.bannerUrl,
  stats:              offer.stats ?? { views: 0, clicks: 0, redemptions: 0 },
  createdAt:          offer.createdAt,
});

export async function fetchOffers(params = {}, signal) {
  const res = await apiClient.get("/retailer/offers", { params, signal });
  const data = unwrap(res);
  return {
    items: (data.items || []).map(normalize),
    total: data.total || 0,
  };
}

export async function fetchMerchantsForOffers(signal) {
  const res = await apiClient.get("/retailer/offers/merchants", { signal });
  return unwrap(res);
}

export async function createOffer(payload, bannerFile) {
  const formData = new FormData();

  // Required fields
  formData.append("merchantId",         payload.merchantId);
  formData.append("title",              payload.title);
  formData.append("description",        payload.description);
  formData.append("offerType",          payload.offerType || "in-store");
  formData.append("termsAndConditions", payload.termsAndConditions || "Standard terms apply.");
  formData.append("status",             payload.status || "active");

  // Optional fields
  if (payload.discountType)    formData.append("discountType",    payload.discountType);
  if (payload.couponCode)      formData.append("couponCode",      payload.couponCode);
  if (payload.redemptionLimit) formData.append("redemptionLimit", String(payload.redemptionLimit));
  if (payload.startDate)       formData.append("startDate",       new Date(payload.startDate).toISOString());
  if (payload.endDate)         formData.append("endDate",         new Date(payload.endDate).toISOString());
  if (payload.categories?.length) {
    payload.categories.forEach((c) => formData.append("categories[]", c));
  }
  if (bannerFile instanceof File) formData.append("banner", bannerFile);

  const res = await apiClient.post("/retailer/offers", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return normalize(unwrap(res));
}

export async function updateOffer(id, payload, bannerFile) {
  const formData = new FormData();

  if (payload.title)              formData.append("title",              payload.title);
  if (payload.description)        formData.append("description",        payload.description);
  if (payload.status)             formData.append("status",             payload.status);
  if (payload.offerType)          formData.append("offerType",          payload.offerType);
  if (payload.termsAndConditions) formData.append("termsAndConditions", payload.termsAndConditions);
  if (payload.discountType)       formData.append("discountType",       payload.discountType);
  if (payload.couponCode)         formData.append("couponCode",         payload.couponCode);
  if (payload.redemptionLimit)    formData.append("redemptionLimit",    String(payload.redemptionLimit));
  if (payload.startDate)          formData.append("startDate",          new Date(payload.startDate).toISOString());
  if (payload.endDate)            formData.append("endDate",            new Date(payload.endDate).toISOString());
  if (bannerFile instanceof File) formData.append("banner",             bannerFile);

  const res = await apiClient.put(`/retailer/offers/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return normalize(unwrap(res));
}

export async function deleteOffer(id) {
  const res = await apiClient.delete(`/retailer/offers/${id}`);
  return unwrap(res);
}
