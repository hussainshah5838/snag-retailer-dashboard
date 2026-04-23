import React, { useEffect, useState } from "react";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import { fetchMerchants } from "../../retailer-management/api/merchants.service";

function PromotionRuleForm({ initialValue, open, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    scope: "global",
    retailerId: "",
    maxLiveOffersPerStore: "",
    maxDurationDays: "",
    allowOpenEnded: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setForm({
        name: initialValue.name || "",
        scope: initialValue.scope || "global",
        retailerId: initialValue.retailerId || "",
        maxLiveOffersPerStore: initialValue.maxLiveOffersPerStore ?? "",
        maxDurationDays: initialValue.maxDurationDays ?? "",
        allowOpenEnded: !!initialValue.allowOpenEnded,
      });
    } else {
      setForm({
        name: "",
        scope: "global",
        retailerId: "",
        maxLiveOffersPerStore: "",
        maxDurationDays: "",
        allowOpenEnded: false,
      });
    }
    setErrors({});
  }, [initialValue, open]);

  const [merchants, setMerchants] = useState([]);
  const [merchantsLoading, setMerchantsLoading] = useState(false);
  const [merchantsError, setMerchantsError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const ac = new AbortController();
    async function load() {
      try {
        setMerchantsLoading(true);
        const res = await fetchMerchants({ limit: 100 }, ac.signal);
        if (!mounted) return;
        setMerchants(res.items || []);
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") return;
        console.warn("Failed to load merchants", err);
        setMerchantsError(err);
      } finally {
        if (mounted) setMerchantsLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
      ac.abort();
    };
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errs.name = "Name must be at least 2 characters";
    if (form.scope === "retailer" && !form.retailerId)
      errs.retailerId = "Please select a merchant";
    if (form.maxLiveOffersPerStore !== "" && Number(form.maxLiveOffersPerStore) < 0)
      errs.maxLiveOffersPerStore = "Must be 0 or greater";
    if (form.maxDurationDays !== "" && Number(form.maxDurationDays) < 0)
      errs.maxDurationDays = "Must be 0 or greater";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    try {
      setSubmitting(true);
      const payload = {
        ...form,
        retailerId: form.scope === "retailer" ? form.retailerId || null : null,
      };
      await onSave(payload);
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={initialValue ? "Edit Promotion Rule" : "Create Promotion Rule"}
      confirmLabel={initialValue ? "Save Changes" : "Create"}
      onConfirm={handleSubmit}
      confirmDisabled={submitting}
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-medium mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">Scope</label>
            <select
              name="scope"
              value={form.scope}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 text-sm w-full"
            >
              <option value="global">Global</option>
              <option value="retailer">Per Retailer</option>
            </select>
          </div>
          {form.scope === "retailer" && (
            <div>
              <label className="block text-xs font-medium mb-1">Merchant</label>
              {merchantsLoading ? (
                <div className="text-sm text-gray-500">Loading merchants…</div>
              ) : (
                <select
                  name="retailerId"
                  value={form.retailerId}
                  onChange={handleChange}
                  className="border rounded-md px-2 py-1 text-sm w-full"
                >
                  <option value="">Select a merchant</option>
                  {merchants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {`${r.firstName} ${r.lastName}`.trim()}
                    </option>
                  ))}
                </select>
              )}
              {errors.retailerId && <p className="text-xs text-red-500 mt-1">{errors.retailerId}</p>}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">
              Max Live Offers per Store
            </label>
            <input
              type="number"
              min="0"
              name="maxLiveOffersPerStore"
              value={form.maxLiveOffersPerStore}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 text-sm w-full"
            />
            {errors.maxLiveOffersPerStore && <p className="text-xs text-red-500 mt-1">{errors.maxLiveOffersPerStore}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">
              Max Duration (days)
            </label>
            <input
              type="number"
              min="0"
              name="maxDurationDays"
              value={form.maxDurationDays}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 text-sm w-full"
            />
            {errors.maxDurationDays && <p className="text-xs text-red-500 mt-1">{errors.maxDurationDays}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="allowOpenEnded"
            type="checkbox"
            name="allowOpenEnded"
            checked={form.allowOpenEnded}
            onChange={handleChange}
          />
          <label
            htmlFor="allowOpenEnded"
            className="text-xs text-gray-700 cursor-pointer"
          >
            Allow open-ended promotions (no end date)
          </label>
        </div>
      </form>
    </ConfirmDialog>
  );
}

export default PromotionRuleForm;
