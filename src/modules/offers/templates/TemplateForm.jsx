import React, { useEffect, useState } from "react";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";

function TemplateForm({ initialValue, open, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "percent_off",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setForm({
        name: initialValue.name || "",
        description: initialValue.description || "",
        type: initialValue.type || "percent_off",
      });
    } else {
      setForm({
        name: "",
        description: "",
        type: "percent_off",
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
      title={initialValue ? "Edit Template" : "Create Template"}
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
          <label className="block text-xs font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full"
          >
            <option value="percent_off">% Off</option>
            <option value="bogo">BOGO</option>
            <option value="free_gift">Free Gift</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </form>
    </ConfirmDialog>
  );
}

export default TemplateForm;
