import apiClient from "../../../shared/http/client";

const USE_MOCK = true;
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

let MOCK_INVOICES = [
  {
    id: "inv-001",
    number: "INV-001",
    period: "Sep 2025",
    amount: 249,
    amountFormatted: "$249.00",
    status: "Paid",
    createdAt: "2025-09-01",
    dueAt: "2025-09-10",
  },
  {
    id: "inv-002",
    number: "INV-002",
    period: "Oct 2025",
    amount: 249,
    amountFormatted: "$249.00",
    status: "Paid",
    createdAt: "2025-10-01",
    dueAt: "2025-10-10",
  },
  {
    id: "inv-003",
    number: "INV-003",
    period: "Nov 2025",
    amount: 249,
    amountFormatted: "$249.00",
    status: "Due",
    createdAt: "2025-11-01",
    dueAt: "2025-11-10",
  },
];

let MOCK_PAYMENTS = [
  {
    id: "pay-001",
    description: "Payment INV-001",
    amount: 249,
    paidAt: "2025-09-05",
  },
  {
    id: "pay-002",
    description: "Payment INV-002",
    amount: 249,
    paidAt: "2025-10-05",
  },
];

export async function fetchInvoices(params = {}, signal) {
  if (USE_MOCK) {
    await delay();
    const start =
      ((params.page || 1) - 1) * (params.limit || MOCK_INVOICES.length);
    const end = start + (params.limit || MOCK_INVOICES.length);
    return {
      items: MOCK_INVOICES.slice(start, end).map((invoice) => ({ ...invoice })),
      total: MOCK_INVOICES.length,
    };
  }
  const res = await apiClient.get("/billing/invoices", { params, signal });
  return res.data;
}

export async function fetchInvoiceById(id, signal) {
  if (USE_MOCK) {
    await delay();
    return MOCK_INVOICES.find((invoice) => invoice.id === id) || null;
  }
  const res = await apiClient.get(`/billing/invoices/${id}`, { signal });
  return res.data;
}

export async function fetchPayments(params = {}, signal) {
  if (USE_MOCK) {
    await delay();
    const start =
      ((params.page || 1) - 1) * (params.limit || MOCK_PAYMENTS.length);
    const end = start + (params.limit || MOCK_PAYMENTS.length);
    return {
      items: MOCK_PAYMENTS.slice(start, end).map((p) => ({ ...p })),
      total: MOCK_PAYMENTS.length,
    };
  }
  const res = await apiClient.get("/billing/payments", { params, signal });
  return res.data;
}

export async function downloadInvoicePdf(id) {
  if (USE_MOCK) {
    await delay();
    const invoice =
      MOCK_INVOICES.find((candidate) => candidate.id === id) ||
      MOCK_INVOICES[0];
    const text = `Mock invoice ${invoice?.number || id} for period ${
      invoice?.period || "N/A"
    }`;
    return new Blob([text], { type: "application/pdf" });
  }
  const res = await apiClient.get(`/billing/invoices/${id}/pdf`, {
    responseType: "blob",
  });
  return res.data;
}
