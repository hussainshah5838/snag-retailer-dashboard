import React, { useState, useEffect } from "react";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";

function MerchantForm({ initialValue, open, onClose, onSave }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setForm({
        firstName: initialValue.firstName || "",
        lastName: initialValue.lastName || "",
        email: initialValue.email || "",
        password: "",
        phoneNumber: initialValue.phoneNumber || "",
      });
    } else {
      setForm({ firstName: "", lastName: "", email: "", password: "", phoneNumber: "" });
    }
    setErrors({});
  }, [initialValue, open]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.firstName.trim() || form.firstName.trim().length < 2)
      errs.firstName = "First name must be at least 2 characters";
    if (!form.lastName.trim() || form.lastName.trim().length < 2)
      errs.lastName = "Last name must be at least 2 characters";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Valid email is required";
    if (!initialValue) {
      if (!form.password || form.password.length < 8)
        errs.password = "Password must be at least 8 characters";
    }
    if (form.phoneNumber && form.phoneNumber.trim().length < 5)
      errs.phoneNumber = "Phone number must be at least 5 characters";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      setSubmitting(true);
      const submitData = { ...form };
      if (initialValue && !submitData.password) delete submitData.password;
      await onSave(submitData);
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={initialValue ? "Edit Merchant" : "Create Merchant"}
      confirmLabel={initialValue ? "Save Changes" : "Create"}
      onConfirm={handleSubmit}
      confirmDisabled={submitting}
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-medium mb-1">First Name</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full"
          />
          {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Last Name</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full"
          />
          {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
        {!initialValue && (
          <div>
            <label className="block text-xs font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 text-sm w-full"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>
        )}
        <div>
          <label className="block text-xs font-medium mb-1">Phone Number <span className="text-gray-400">(optional)</span></label>
          <input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full"
          />
          {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>}
        </div>
      </form>
    </ConfirmDialog>
  );
}

export default MerchantForm;
