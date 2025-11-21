import apiClient from "../../../shared/http/client";
import { loadMock, saveMock } from "../../../shared/mockStorage";

const USE_MOCK = !import.meta.env.VITE_API_URL;
const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

const DEFAULT_RULES = [
  {
    id: "rule-1",
    name: "One Live Offer Per Store",
    description: "Restrict stores to a single concurrent live offer.",
    scope: "global",
    retailerId: null,
    maxLiveOffersPerStore: 1,
    maxDurationDays: 30,
    allowOpenEnded: false,
    enabled: true,
  },
  {
    id: "rule-2",
    name: "Premium Retailer Exception",
    description: "Premium retailers may run two live offers per store.",
    scope: "retailer",
    retailerId: "ret-001",
    maxLiveOffersPerStore: 2,
    maxDurationDays: 14,
    allowOpenEnded: false,
    enabled: true,
  },
  {
    id: "rule-3",
    name: "Seasonal Unlimited Offers",
    description: "Allow open-ended offers during the holiday campaign.",
    scope: "global",
    retailerId: null,
    maxLiveOffersPerStore: 1,
    maxDurationDays: 0,
    allowOpenEnded: true,
    enabled: false,
  },
];

let MOCK_RULES = loadMock("MOCK_PROMOTION_RULES", DEFAULT_RULES);

let MOCK_LIVE_CONSTRAINT = loadMock("MOCK_PROMOTION_LIVE_CONSTRAINT", {
  enforceSingleLiveOffer: true,
  resolutionStrategy: "block",
});

export async function fetchPromotionRules(params = {}, signal) {
  if (USE_MOCK) {
    await delay();
    const start = ((params.page || 1) - 1) * (params.limit || 20);
    const end = start + (params.limit || 20);
    const normalized = MOCK_RULES.slice(start, end).map((rule) => ({
      ...rule,
      scope: rule.scope || "global",
      maxLiveOffersPerStore: rule.maxLiveOffersPerStore ?? 1,
      maxDurationDays: rule.maxDurationDays ?? 0,
      allowOpenEnded: !!rule.allowOpenEnded,
    }));
    return { items: normalized, total: MOCK_RULES.length };
  }
  const res = await apiClient.get("/promotion-limits/rules", {
    params,
    signal,
  });
  return res.data;
}

export async function createPromotionRule(payload) {
  if (USE_MOCK) {
    await delay();
    const rule = {
      id: payload.id || `rule-${Date.now()}`,
      name: payload.name || "New rule",
      description: payload.description || "",
      scope: payload.scope || "global",
      retailerId: payload.scope === "retailer" ? payload.retailerId : null,
      maxLiveOffersPerStore:
        payload.maxLiveOffersPerStore !== undefined
          ? Number(payload.maxLiveOffersPerStore)
          : 1,
      maxDurationDays:
        payload.maxDurationDays !== undefined
          ? Number(payload.maxDurationDays)
          : 0,
      allowOpenEnded: !!payload.allowOpenEnded,
      enabled: payload.enabled ?? true,
    };
    MOCK_RULES = [rule, ...MOCK_RULES];
    saveMock("MOCK_PROMOTION_RULES", MOCK_RULES);
    return rule;
  }
  const res = await apiClient.post("/promotion-limits/rules", payload);
  return res.data;
}

export async function updatePromotionRule(id, payload) {
  if (USE_MOCK) {
    await delay();
    let updated = null;
    MOCK_RULES = MOCK_RULES.map((rule) => {
      if (rule.id !== id) return rule;
      updated = {
        ...rule,
        ...payload,
        retailerId:
          (payload.scope || rule.scope) === "retailer"
            ? payload.retailerId ?? rule.retailerId
            : null,
        maxLiveOffersPerStore:
          payload.maxLiveOffersPerStore !== undefined
            ? Number(payload.maxLiveOffersPerStore)
            : rule.maxLiveOffersPerStore,
        maxDurationDays:
          payload.maxDurationDays !== undefined
            ? Number(payload.maxDurationDays)
            : rule.maxDurationDays,
        allowOpenEnded:
          payload.allowOpenEnded !== undefined
            ? !!payload.allowOpenEnded
            : rule.allowOpenEnded,
      };
      return updated;
    });
    saveMock("MOCK_PROMOTION_RULES", MOCK_RULES);
    return updated;
  }
  const res = await apiClient.put(`/promotion-limits/rules/${id}`, payload);
  return res.data;
}

export async function deletePromotionRule(id) {
  if (USE_MOCK) {
    await delay();
    MOCK_RULES = MOCK_RULES.filter((rule) => rule.id !== id);
    saveMock("MOCK_PROMOTION_RULES", MOCK_RULES);
    return { success: true };
  }
  const res = await apiClient.delete(`/promotion-limits/rules/${id}`);
  return res.data;
}

export async function fetchLiveOfferConstraint(signal) {
  if (USE_MOCK) {
    await delay();
    return { ...MOCK_LIVE_CONSTRAINT };
  }
  const res = await apiClient.get("/promotion-limits/live-offer-constraint", {
    signal,
  });
  return res.data;
}

export async function updateLiveOfferConstraint(payload) {
  if (USE_MOCK) {
    await delay();
    MOCK_LIVE_CONSTRAINT = {
      enforceSingleLiveOffer:
        payload.enforceSingleLiveOffer ??
        MOCK_LIVE_CONSTRAINT.enforceSingleLiveOffer,
      resolutionStrategy:
        payload.resolutionStrategy || MOCK_LIVE_CONSTRAINT.resolutionStrategy,
    };
    saveMock("MOCK_PROMOTION_LIVE_CONSTRAINT", MOCK_LIVE_CONSTRAINT);
    return { ...MOCK_LIVE_CONSTRAINT };
  }
  const res = await apiClient.put(
    "/promotion-limits/live-offer-constraint",
    payload
  );
  return res.data;
}
