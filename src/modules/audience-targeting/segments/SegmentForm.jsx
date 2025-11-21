import React, { useEffect, useState } from "react";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import AudienceFilterBuilder from "../components/AudienceFilterBuilder";

function SegmentForm({ initialValue, open, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [filters, setFilters] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setForm({
        name: initialValue.name || "",
        description: initialValue.description || "",
      });
      setFilters(initialValue.filters || {});
    } else {
      setForm({ name: "", description: "" });
      setFilters({});
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
      await onSave({
        ...form,
        filters,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={initialValue ? "Edit Segment" : "Create Segment"}
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

        <div>
          <label className="block text-xs font-medium mb-1">Filters</label>
          <AudienceFilterBuilder value={filters} onChange={setFilters} />
        </div>
      </form>
    </ConfirmDialog>
  );
}

export default SegmentForm;
