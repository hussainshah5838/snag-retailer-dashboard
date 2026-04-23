import apiClient from "../../../shared/http/client";

const USE_MOCK = true;
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

let MOCK_BILLING_OVERVIEW = {
  currentPlanId: "pro",
  currentPlanName: "Pro",
  nextBillingDate: "2025-12-01",
  plans: [
    {
      id: "starter",
      name: "Starter",
      price: 99,
      priceFormatted: "$99/mo",
      description: "Up to 3 concurrent offers and limited analytics.",
    },
    {
      id: "pro",
      name: "Pro",
      price: 249,
      priceFormatted: "$249/mo",
      description: "10 live offers, automated limits, and CSV exports.",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 499,
      priceFormatted: "Custom",
      description: "Unlimited offers with dedicated success manager.",
    },
  ],
};

export async function fetchBillingOverview(signal) {
  if (USE_MOCK) {
    await delay();
    return {
      ...MOCK_BILLING_OVERVIEW,
      plans: MOCK_BILLING_OVERVIEW.plans.map((plan) => ({ ...plan })),
    };
  }
  const res = await apiClient.get("/billing/overview", { signal });
  return res.data;
}

export async function updatePlan(planId) {
  if (USE_MOCK) {
    await delay();
    const selectedPlan =
      MOCK_BILLING_OVERVIEW.plans.find((plan) => plan.id === planId) ||
      MOCK_BILLING_OVERVIEW.plans[0];
    MOCK_BILLING_OVERVIEW = {
      ...MOCK_BILLING_OVERVIEW,
      currentPlanId: selectedPlan.id,
      currentPlanName: selectedPlan.name,
    };
    return { success: true, planId: selectedPlan.id };
  }
  const res = await apiClient.post("/billing/change-plan", { planId });
  return res.data;
}
