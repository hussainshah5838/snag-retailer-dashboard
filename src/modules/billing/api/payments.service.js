import apiClient from "../../../shared/http/client";

const USE_MOCK = true;
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

let MOCK_PAYMENT_METHODS = [
  {
    id: "pm-001",
    nickname: "Corporate Visa",
    brand: "Visa",
    cardLast4: "4242",
    expMonth: "08",
    expYear: "2027",
  },
  {
    id: "pm-002",
    nickname: "Finance Team MasterCard",
    brand: "MasterCard",
    cardLast4: "1881",
    expMonth: "01",
    expYear: "2026",
  },
];

export async function fetchPaymentMethods(signal) {
  if (USE_MOCK) {
    await delay();
    return { items: MOCK_PAYMENT_METHODS.map((pm) => ({ ...pm })) };
  }
  const res = await apiClient.get("/billing/payment-methods", { signal });
  return res.data;
}

export async function addPaymentMethod(payload) {
  if (USE_MOCK) {
    await delay();
    const method = {
      id: payload.id || `pm-${Date.now()}`,
      nickname: payload.nickname || "Payment Method",
      brand: payload.brand || "Visa",
      cardLast4: payload.cardLast4 || "0000",
      expMonth: payload.expMonth || "01",
      expYear: payload.expYear || "2026",
    };
    MOCK_PAYMENT_METHODS = [method, ...MOCK_PAYMENT_METHODS];
    return method;
  }
  const res = await apiClient.post("/billing/payment-methods", payload);
  return res.data;
}

export async function updatePaymentMethod(id, payload) {
  if (USE_MOCK) {
    await delay();
    let updated = null;
    MOCK_PAYMENT_METHODS = MOCK_PAYMENT_METHODS.map((pm) => {
      if (pm.id !== id) return pm;
      updated = { ...pm, ...payload };
      return updated;
    });
    return updated;
  }
  const res = await apiClient.put(`/billing/payment-methods/${id}`, payload);
  return res.data;
}

export async function deletePaymentMethod(id) {
  if (USE_MOCK) {
    await delay();
    MOCK_PAYMENT_METHODS = MOCK_PAYMENT_METHODS.filter((pm) => pm.id !== id);
    return { success: true };
  }
  const res = await apiClient.delete(`/billing/payment-methods/${id}`);
  return res.data;
}
