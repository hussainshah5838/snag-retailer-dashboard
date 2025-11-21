import React, { useEffect, useState } from "react";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import { fetchRetailers } from "../../retailer-management/api/retailers.service";

function PromotionRuleForm({ initialValue, open, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    scope: "global",
    retailerId: "",
    maxLiveOffersPerStore: "",
    maxDurationDays: "",
    allowOpenEnded: false,
  });
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
  }, [initialValue, open]);

  const [retailers, setRetailers] = useState([]);
  const [retailersLoading, setRetailersLoading] = useState(false);
  const [retailersError, setRetailersError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const ac = new AbortController();
    async function load() {
      try {
        setRetailersLoading(true);
        const res = await fetchRetailers({ limit: 100 }, ac.signal);
        if (!mounted) return;
        setRetailers(res.items || []);
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") return;
        console.warn("Failed to load retailers", err);
        setRetailersError(err);
      } finally {
        if (mounted) setRetailersLoading(false);
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
  }

  async function handleSubmit(e) {
    e.preventDefault();
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
            required
          />
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
              <label className="block text-xs font-medium mb-1">
                Retailer ID
              </label>
              {retailersLoading ? (
                <div className="text-sm text-gray-500">Loading retailers…</div>
              ) : retailersError ? (
                <input
                  name="retailerId"
                  value={form.retailerId}
                  onChange={handleChange}
                  placeholder="Enter retailer id"
                  className="border rounded-md px-2 py-1 text-sm w-full"
                  required={form.scope === "retailer"}
                />
              ) : (
                <>
                  <input
                    name="retailerId"
                    list="retailers-list"
                    value={form.retailerId}
                    onChange={handleChange}
                    placeholder="Select or type retailer id"
                    className="border rounded-md px-2 py-1 text-sm w-full"
                    required={form.scope === "retailer"}
                  />
                  <datalist id="retailers-list">
                    {retailers.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.id} — {r.name}
                      </option>
                    ))}
                  </datalist>
                </>
              )}
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
