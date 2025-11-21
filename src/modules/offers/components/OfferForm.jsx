import React, { useEffect, useState } from "react";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import OfferTemplateSelector from "./OfferTemplateSelector";
import OfferScheduleForm from "./OfferScheduleForm";
import OfferLimitsForm from "./OfferLimitsForm";
import OfferImagePicker from "./OfferImagePicker";

function OfferForm({ initialValue, open, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "scheduled",
    templateId: "",
    discountValue: "",
    discountType: "percent",
    stores: [],
  });
  const [schedule, setSchedule] = useState({
    startAt: "",
    endAt: "",
    timeFrom: "",
    timeTo: "",
    radiusKm: "",
  });
  const [limits, setLimits] = useState({
    maxRedemptions: "",
    maxPerUser: "",
    minSpend: "",
  });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setForm({
        name: initialValue.name || "",
        status: initialValue.status || "scheduled",
        description: initialValue.description || "",
        templateId: initialValue.templateId || "",
        discountValue: initialValue.discountValue ?? "",
        discountType: initialValue.discountType || "percent",
        stores: initialValue.stores || [],
      });
      setSchedule({
        startAt: initialValue.startAt || "",
        endAt: initialValue.endAt || "",
        timeFrom: initialValue.timeFrom || "",
        timeTo: initialValue.timeTo || "",
        radiusKm: initialValue.radiusKm ?? "",
      });
      setLimits({
        maxRedemptions: initialValue.maxRedemptions ?? "",
        maxPerUser: initialValue.maxPerUser ?? "",
        minSpend: initialValue.minSpend ?? "",
      });
      setImage(
        initialValue.imageUrl
          ? { file: null, previewUrl: initialValue.imageUrl }
          : null
      );
    } else {
      setForm({
        name: "",
        status: "scheduled",
        description: "",
        templateId: "",
        discountValue: "",
        discountType: "percent",
        stores: [],
      });
      setSchedule({
        startAt: "",
        endAt: "",
        timeFrom: "",
        timeTo: "",
        radiusKm: "",
      });
      setLimits({
        maxRedemptions: "",
        maxPerUser: "",
        minSpend: "",
      });
      setImage(null);
    }
  }, [initialValue, open]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSubmitting(true);

      const payload = {
        ...form,
        status: form.status,
        ...schedule,
        ...limits,
      };

      await onSave(payload, image);
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
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
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
          <div>
            <label className="block text-xs font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 text-sm w-full"
              rows={3}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">Template</label>
            <OfferTemplateSelector
              value={form.templateId}
              onChange={(templateId) =>
                setForm((prev) => ({ ...prev, templateId }))
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium mb-1">Discount</label>
              <input
                name="discountValue"
                type="number"
                min="0"
                value={form.discountValue}
                onChange={handleChange}
                className="border rounded-md px-2 py-1 text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Type</label>
              <select
                name="discountType"
                value={form.discountType}
                onChange={handleChange}
                className="border rounded-md px-2 py-1 text-sm w-full"
              >
                <option value="percent">% Off</option>
                <option value="amount">Fixed Amount</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">
            Schedule & Targeting
          </label>
          <OfferScheduleForm value={schedule} onChange={setSchedule} />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Limits</label>
          <OfferLimitsForm value={limits} onChange={setLimits} />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Image</label>
          <OfferImagePicker value={image} onChange={setImage} />
        </div>
      </form>
    </ConfirmDialog>
  );
}

export default OfferForm;
