import React, { useEffect, useState } from "react";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import AudienceFilterBuilder from "../components/AudienceFilterBuilder";

function SegmentForm({ initialValue, open, onClose, onSave }) {
  const [form, setForm] = useState({ name: "", description: "" });
  const [filters, setFilters] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setForm({ name: initialValue.name || "", description: initialValue.description || "" });
      setFilters(initialValue.filters || {});
    } else {
      setForm({ name: "", description: "" });
      setFilters({});
    }
    setErrors({});
  }, [initialValue, open]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errs.name = "Name must be at least 2 characters";
    if (form.description && form.description.length > 500)
      errs.description = "Description must be under 500 characters";
    if (filters.minAge && filters.maxAge && Number(filters.minAge) > Number(filters.maxAge))
      errs.filters = "Min age cannot be greater than max age";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    try {
      setSubmitting(true);
      await onSave({ ...form, filters });
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
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">
              Description <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 text-sm w-full"
              rows={3}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Filters <span className="text-gray-400">(optional)</span></label>
          <AudienceFilterBuilder value={filters} onChange={setFilters} />
          {errors.filters && <p className="text-xs text-red-500 mt-1">{errors.filters}</p>}
        </div>
      </form>
    </ConfirmDialog>
  );
}

export default SegmentForm;
