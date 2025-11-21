import React, { useState, useEffect } from "react";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";

function RetailerForm({ initialValue, open, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contactNumber: "",
    status: "pending",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setForm({
        name: initialValue.name || "",
        email: initialValue.email || "",
        contactNumber: initialValue.contactNumber || "",
        status: initialValue.status || "pending",
      });
    } else {
      setForm({
        name: "",
        email: "",
        contactNumber: "",
        status: "pending",
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
      title={initialValue ? "Edit Retailer" : "Create Retailer"}
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
        <div>
          <label className="block text-xs font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">
            Contact Number
          </label>
          <input
            name="contactNumber"
            value={form.contactNumber}
            onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full"
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </form>
    </ConfirmDialog>
  );
}

export default RetailerForm;
