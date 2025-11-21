import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import PlanSelector from "./components/PlanSelector";
import BillingHistoryTable from "./components/BillingHistoryTable";
import InvoiceDetails from "./components/InvoiceDetails";
import PaymentMethodForm from "./components/PaymentMethodForm";
import { fetchBillingOverview, updatePlan } from "./api/billing.service";
import { fetchInvoices } from "./api/invoices.service";
import {
  fetchPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "./api/payments.service";

function Billing() {
  const [overview, setOverview] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [editPaymentMethod, setEditPaymentMethod] = useState(null);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadAll(signal) {
    try {
      const [ov, inv, pm] = await Promise.all([
        fetchBillingOverview(signal),
        fetchInvoices({}, signal),
        fetchPaymentMethods(signal),
      ]);
      setOverview(ov || null);
      const invItems = Array.isArray(inv)
        ? inv
        : Array.isArray(inv?.items)
        ? inv.items
        : [];
      const pmItems = Array.isArray(pm)
        ? pm
        : Array.isArray(pm?.items)
        ? pm.items
        : [];
      setInvoices(invItems);
      setPaymentMethods(pmItems);
    } catch (err) {
      // let caller handle the error
      throw err;
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);
        await loadAll(controller.signal);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setError("Failed to load billing data.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  async function handleChangePlan(plan) {
    try {
      await updatePlan(plan.id);
      const controller = new AbortController();
      await loadAll(controller.signal);
      alert("Plan updated.");
    } catch {
      alert("Failed to update plan.");
    }
  }

  function handleAddPaymentMethod() {
    setEditPaymentMethod(null);
    setIsPaymentFormOpen(true);
  }

  function handleEditPaymentMethod(pm) {
    setEditPaymentMethod(pm);
    setIsPaymentFormOpen(true);
  }

  async function handleSavePaymentMethod(form) {
    try {
      if (editPaymentMethod) {
        await updatePaymentMethod(editPaymentMethod.id, form);
      } else {
        await addPaymentMethod(form);
      }
      const controller = new AbortController();
      await loadAll(controller.signal);
      setIsPaymentFormOpen(false);
    } catch (err) {
      console.error("Failed to save payment method", err);
      setError("Failed to save payment method.");
    }
  }

  async function handleDeletePaymentMethod(pm) {
    if (!pm) return;
    if (!window.confirm("Delete this payment method?")) return;
    try {
      await deletePaymentMethod(pm.id);
      const controller = new AbortController();
      await loadAll(controller.signal);
    } catch (err) {
      console.error("Failed to delete payment method", err);
      setError("Failed to delete payment method.");
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-base font-semibold">Billing</h1>

      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-sm font-semibold">Plans</h2>
              <PlanSelector
                plans={overview?.plans || []}
                currentPlanId={overview?.currentPlanId}
                onChangePlan={handleChangePlan}
              />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm text-xs space-y-2">
              <h2 className="text-sm font-semibold mb-1">Current Usage</h2>
              <p>
                Current Plan:{" "}
                <span className="font-semibold">
                  {overview?.currentPlanName || "N/A"}
                </span>
              </p>
              <p>
                Next Billing Date:{" "}
                <span className="font-semibold">
                  {overview?.nextBillingDate || "N/A"}
                </span>
              </p>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-semibold">Billing History</h2>
              </div>
              <BillingHistoryTable
                invoices={invoices}
                onSelect={setSelectedInvoice}
              />
            </div>
            <div>
              <InvoiceDetails invoice={selectedInvoice} />
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2 bg-white rounded-xl p-4 shadow-sm text-xs space-y-2">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-semibold">Payment Methods</h2>
                <button
                  onClick={handleAddPaymentMethod}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md"
                >
                  Add Method
                </button>
              </div>

              {paymentMethods.length === 0 ? (
                <p className="text-gray-500 text-xs">
                  No payment methods added.
                </p>
              ) : (
                <ul className="space-y-2">
                  {paymentMethods.map((pm) => (
                    <li
                      key={pm.id}
                      className="flex justify-between items-center border rounded-md px-2 py-1"
                    >
                      <div>
                        <p className="font-medium">{pm.nickname || pm.brand}</p>
                        <p className="text-gray-600">
                          {pm.brand} •••• {pm.cardLast4} · exp {pm.expMonth}/
                          {pm.expYear}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPaymentMethod(pm)}
                          className="text-[11px] text-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePaymentMethod(pm)}
                          className="text-[11px] text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <PaymentMethodForm
            initialValue={editPaymentMethod}
            open={isPaymentFormOpen}
            onClose={() => setIsPaymentFormOpen(false)}
            onSave={handleSavePaymentMethod}
          />
        </>
      )}
    </div>
  );
}

export default Billing;
