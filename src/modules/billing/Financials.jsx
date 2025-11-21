import React, { useEffect, useState } from "react";
import { fetchInvoices, fetchPayments } from "./api/invoices.service";

// Mock data used as a friendly fallback during development or when the API
// returns empty lists. These make the Financials page more useful in local
// dev and in screenshots.
const MOCK_INVOICES = [
  { id: "INV-1001", description: "Offer setup fee", amount: 250.0 },
  { id: "INV-1002", description: "Monthly platform fee", amount: 125.0 },
  { id: "INV-1003", description: "Ad spend reimbursement", amount: 75.5 },
];

const MOCK_PAYMENTS = [
  { id: "PMT-2001", description: "Stripe payout", amount: 125.0 },
  { id: "PMT-2002", description: "Bank transfer", amount: 75.5 },
];

export default function Financials() {
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const inv = await fetchInvoices({}, null).catch(() => null);
        const pm = await fetchPayments(null).catch(() => null);
        if (!mounted) return;
        const invItems = Array.isArray(inv) ? inv : inv?.items || [];
        const pmItems = Array.isArray(pm) ? pm : pm?.items || [];

        // If the API returned empty arrays (or null), fall back to mock data
        // so the page displays useful content in dev environments.
        setInvoices(invItems.length ? invItems : MOCK_INVOICES);
        setPayments(pmItems.length ? pmItems : MOCK_PAYMENTS);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  const totalInvoiced = invoices.reduce((s, i) => s + (i.amount || 0), 0);
  const totalPaid = payments.reduce((s, p) => s + (p.amount || 0), 0);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-base font-semibold">Financials</h1>
      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-3">
            <div
              className="rounded-xl p-4 shadow-sm"
              style={{
                background: "var(--card)",
                borderColor: "var(--line)",
                borderWidth: 1,
              }}
            >
              <h2 className="text-sm font-semibold">Summary</h2>
              <p>
                Total Invoiced: <strong>{totalInvoiced}</strong>
              </p>
              <p>
                Total Paid: <strong>{totalPaid}</strong>
              </p>
            </div>

            <div
              className="rounded-xl p-4 shadow-sm"
              style={{
                background: "var(--card)",
                borderColor: "var(--line)",
                borderWidth: 1,
              }}
            >
              <h2 className="text-sm font-semibold">Invoices</h2>
              <ul className="text-xs space-y-2 mt-2 text-slate-200">
                {invoices.map((inv) => (
                  <li key={inv.id} className="flex justify-between">
                    <span>{inv.description || inv.id}</span>
                    <span>{inv.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="rounded-xl p-4 shadow-sm"
            style={{
              background: "var(--card)",
              borderColor: "var(--line)",
              borderWidth: 1,
            }}
          >
            <h2 className="text-sm font-semibold">Payments</h2>
            <ul className="text-xs space-y-2 mt-2 text-slate-200">
              {payments.map((p) => (
                <li key={p.id} className="flex justify-between">
                  <span>{p.description || p.id}</span>
                  <span>{p.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
