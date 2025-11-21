import React, { useEffect, useState } from "react";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";

function PaymentMethodForm({ initialValue, open, onClose, onSave }) {
  const [form, setForm] = useState({
    nickname: "",
    cardLast4: "",
    brand: "",
    expMonth: "",
    expYear: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setForm({
        nickname: initialValue.nickname || "",
        cardLast4: initialValue.cardLast4 || "",
        brand: initialValue.brand || "",
        expMonth: initialValue.expMonth || "",
        expYear: initialValue.expYear || "",
      });
    } else {
      setForm({
        nickname: "",
        cardLast4: "",
        brand: "",
        expMonth: "",
        expYear: "",
      });
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
      await onSave(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={initialValue ? "Edit Payment Method" : "Add Payment Method"}
      confirmLabel={initialValue ? "Save Changes" : "Add"}
      onConfirm={handleSubmit}
      confirmDisabled={submitting}
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-medium mb-1">Nickname</label>
          <input
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium mb-1">Brand</label>
            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 text-sm w-full"
              placeholder="Visa, MasterCard..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">
              Last 4 digits
            </label>
            <input
              name="cardLast4"
              value={form.cardLast4}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 text-sm w-full"
              maxLength={4}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium mb-1">Exp Month</label>
            <input
              name="expMonth"
              value={form.expMonth}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 text-sm w-full"
              placeholder="MM"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Exp Year</label>
            <input
              name="expYear"
              value={form.expYear}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 text-sm w-full"
              placeholder="YYYY"
            />
          </div>
        </div>
      </form>
    </ConfirmDialog>
  );
}

export default PaymentMethodForm;
