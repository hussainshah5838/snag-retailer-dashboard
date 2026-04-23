import React, { useEffect, useState } from "react";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import { fetchMerchantsForOffers } from "../api/offers.service";

const OFFER_TYPES   = ["in-store", "online"];
const STATUSES      = ["active", "scheduled", "draft", "expired"];
const DISCOUNT_TYPES = ["percentage", "amount"];

function OfferForm({ initialValue, open, onClose, onSave }) {
  const [form, setForm] = useState({
    merchantId:         "",
    title:              "",
    description:        "",
    offerType:          "in-store",
    status:             "active",
    termsAndConditions: "",
    discountType:       "",
    couponCode:         "",
    redemptionLimit:    "",
    startDate:          "",
    endDate:            "",
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [merchants, setMerchants] = useState([]);
  const [merchantsLoading, setMerchantsLoading] = useState(false);

  // Load merchants dropdown only on create
  useEffect(() => {
    if (!open || initialValue) return;
    const ac = new AbortController();
    setMerchantsLoading(true);
    fetchMerchantsForOffers(ac.signal)
      .then((data) => setMerchants(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setMerchantsLoading(false));
    return () => ac.abort();
  }, [open, initialValue]);

  // Populate form on edit
  useEffect(() => {
    if (initialValue) {
      setForm({
        merchantId:         initialValue.merchantId || "",
        title:              initialValue.title || "",
        description:        initialValue.description || "",
        offerType:          initialValue.offerType || "in-store",
        status:             initialValue.status || "active",
        termsAndConditions: initialValue.termsAndConditions || "",
        discountType:       initialValue.discountType || "",
        couponCode:         initialValue.couponCode || "",
        redemptionLimit:    initialValue.redemptionLimit ?? "",
        startDate:          initialValue.startDate ? initialValue.startDate.slice(0, 16) : "",
        endDate:            initialValue.endDate   ? initialValue.endDate.slice(0, 16)   : "",
      });
      setBannerPreview(initialValue.bannerUrl || null);
    } else {
      setForm({
        merchantId: "", title: "", description: "", offerType: "in-store",
        status: "active", termsAndConditions: "", discountType: "",
        couponCode: "", redemptionLimit: "", startDate: "", endDate: "",
      });
      setBannerPreview(null);
    }
    setBannerFile(null);
    setErrors({});
  }, [initialValue, open]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleBannerChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  }

  function validate() {
    const errs = {};
    if (!initialValue && !form.merchantId)
      errs.merchantId = "Please select a merchant";
    if (!form.title.trim() || form.title.trim().length < 3)
      errs.title = "Title must be at least 3 characters";
    if (!form.description.trim() || form.description.trim().length < 10)
      errs.description = "Description must be at least 10 characters";
    if (!form.offerType)
      errs.offerType = "Offer type is required";
    if (!form.termsAndConditions.trim() || form.termsAndConditions.trim().length < 5)
      errs.termsAndConditions = "Terms and conditions required (min 5 chars)";
    if (form.startDate && form.endDate && new Date(form.startDate) >= new Date(form.endDate))
      errs.endDate = "End date must be after start date";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    try {
      setSubmitting(true);
      const payload = { ...form };
      if (!payload.discountType)    delete payload.discountType;
      if (!payload.couponCode)      delete payload.couponCode;
      if (!payload.redemptionLimit) delete payload.redemptionLimit;
      if (!payload.startDate)       delete payload.startDate;
      if (!payload.endDate)         delete payload.endDate;
      await onSave(payload, bannerFile);
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={initialValue ? "Edit Offer" : "Create Offer"}
      confirmLabel={initialValue ? "Save Changes" : "Create"}
      onConfirm={handleSubmit}
      confirmDisabled={submitting}
    >
      <form className="space-y-3" onSubmit={handleSubmit}>

        {/* Merchant dropdown - only on create */}
        {!initialValue && (
          <div>
            <label className="block text-xs font-medium mb-1">Merchant</label>
            {merchantsLoading ? (
              <p className="text-xs text-gray-400">Loading merchants...</p>
            ) : (
              <select name="merchantId" value={form.merchantId} onChange={handleChange}
                className="border rounded-md px-2 py-1 text-sm w-full">
                <option value="">Select a merchant</option>
                {merchants.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            )}
            {errors.merchantId && <p className="text-xs text-red-500 mt-1">{errors.merchantId}</p>}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-medium mb-1">Title</label>
          <input name="title" value={form.title} onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full" />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange}
            rows={3} className="border rounded-md px-2 py-1 text-sm w-full" />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
        </div>

        {/* Offer Type + Status */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium mb-1">Offer Type</label>
            <select name="offerType" value={form.offerType} onChange={handleChange}
              className="border rounded-md px-2 py-1 text-sm w-full">
              {OFFER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.offerType && <p className="text-xs text-red-500 mt-1">{errors.offerType}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              className="border rounded-md px-2 py-1 text-sm w-full">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Terms */}
        <div>
          <label className="block text-xs font-medium mb-1">Terms & Conditions</label>
          <textarea name="termsAndConditions" value={form.termsAndConditions} onChange={handleChange}
            rows={2} className="border rounded-md px-2 py-1 text-sm w-full" />
          {errors.termsAndConditions && <p className="text-xs text-red-500 mt-1">{errors.termsAndConditions}</p>}
        </div>

        {/* Discount Type + Coupon Code */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium mb-1">Discount Type <span className="text-gray-400">(optional)</span></label>
            <select name="discountType" value={form.discountType} onChange={handleChange}
              className="border rounded-md px-2 py-1 text-sm w-full">
              <option value="">None</option>
              {DISCOUNT_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Coupon Code <span className="text-gray-400">(optional)</span></label>
            <input name="couponCode" value={form.couponCode} onChange={handleChange}
              className="border rounded-md px-2 py-1 text-sm w-full" />
          </div>
        </div>

        {/* Redemption Limit */}
        <div>
          <label className="block text-xs font-medium mb-1">Redemption Limit <span className="text-gray-400">(optional)</span></label>
          <input name="redemptionLimit" type="number" min="1" value={form.redemptionLimit} onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full" />
        </div>

        {/* Start + End Date */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium mb-1">Start Date <span className="text-gray-400">(optional)</span></label>
            <input name="startDate" type="datetime-local" value={form.startDate} onChange={handleChange}
              className="border rounded-md px-2 py-1 text-sm w-full" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">End Date <span className="text-gray-400">(optional)</span></label>
            <input name="endDate" type="datetime-local" value={form.endDate} onChange={handleChange}
              className="border rounded-md px-2 py-1 text-sm w-full" />
            {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
          </div>
        </div>

        {/* Banner */}
        <div>
          <label className="block text-xs font-medium mb-1">Banner <span className="text-gray-400">(optional)</span></label>
          {bannerPreview && (
            <img src={bannerPreview} alt="Banner preview"
              className="w-full h-24 object-cover rounded-md mb-2" />
          )}
          <input type="file" accept="image/*" onChange={handleBannerChange} className="text-xs w-full" />
        </div>

      </form>
    </ConfirmDialog>
  );
}

export default OfferForm;
