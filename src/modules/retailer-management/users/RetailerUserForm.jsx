// src/modules/retailer-management/users/RetailerUserForm.jsx
import React, { useEffect, useState } from "react";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import RoleSelector from "./RoleSelector";

function RetailerUserForm({ initialValue, open, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    status: "active",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setForm({
        name: initialValue.name || "",
        email: initialValue.email || "",
        role: initialValue.role || "",
        status: initialValue.status || "active",
      });
    } else {
      setForm({
        name: "",
        email: "",
        role: "",
        status: "active",
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
      title={initialValue ? "Edit User" : "Add User"}
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
          <label className="block text-xs font-medium mb-1">Role</label>
          <RoleSelector
            value={form.role}
            onChange={(role) => setForm((prev) => ({ ...prev, role }))}
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
            <option value="active">Active</option>
            <option value="invited">Invited</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </form>
    </ConfirmDialog>
  );
}

export default RetailerUserForm;
