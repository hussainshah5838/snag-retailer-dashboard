import React, { useState, useEffect } from "react";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import { fetchMerchantsDropdown } from "../api/branches.service";

function BranchForm({ initialValue, open, onClose, onSave }) {
  const [form, setForm] = useState({
    merchantId: "",
    branchName: "",
    branchAddress: "",
    industry: "",
    subCategories: [],
    phoneNumber: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [merchants, setMerchants] = useState([]);
  const [merchantsLoading, setMerchantsLoading] = useState(false);

  // Load merchants dropdown only on create
  useEffect(() => {
    if (!open || initialValue) return;
    const ac = new AbortController();
    setMerchantsLoading(true);
    fetchMerchantsDropdown(ac.signal)
      .then((data) => setMerchants(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setMerchantsLoading(false));
    return () => ac.abort();
  }, [open, initialValue]);

  // Populate form on edit
  useEffect(() => {
    if (initialValue) {
      setForm({
        merchantId: initialValue.merchantId || "",
        branchName: initialValue.branchName || "",
        branchAddress: initialValue.branchAddress || "",
        industry: initialValue.industry || "",
        subCategories: initialValue.subCategories || [],
        phoneNumber: initialValue.phoneNumber || "",
      });
      setLogoPreview(initialValue.logoUrl || null);
    } else {
      setForm({ merchantId: "", branchName: "", branchAddress: "", industry: "", subCategories: [], phoneNumber: "" });
      setLogoPreview(null);
    }
    setLogoFile(null);
    setErrors({});
  }, [initialValue, open]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleLogoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function validate() {
    const errs = {};
    if (!initialValue && !form.merchantId) errs.merchantId = "Please select a merchant";
    if (!form.branchName.trim() || form.branchName.trim().length < 2)
      errs.branchName = "Branch name must be at least 2 characters";
    if (!form.branchAddress.trim() || form.branchAddress.trim().length < 5)
      errs.branchAddress = "Branch address must be at least 5 characters";
    if (!form.industry.trim()) errs.industry = "Industry is required";
    if (!form.phoneNumber.trim() || form.phoneNumber.trim().length < 5)
      errs.phoneNumber = "Phone number must be at least 5 characters";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    try {
      setSubmitting(true);
      // Build FormData to support file upload
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === "subCategories") {
          val.forEach((v) => formData.append("subCategories[]", v));
        } else if (key === "merchantId" && initialValue) {
          // Don't send merchantId on edit
        } else {
          formData.append(key, val);
        }
      });
      if (logoFile) formData.append("logo", logoFile);
      await onSave(formData);
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={initialValue ? "Edit Branch" : "Add Branch"}
      confirmLabel={initialValue ? "Save Changes" : "Add Branch"}
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
              <select
                name="merchantId"
                value={form.merchantId}
                onChange={handleChange}
                className="border rounded-md px-2 py-1 text-sm w-full"
              >
                <option value="">Select a merchant</option>
                {merchants.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            )}
            {errors.merchantId && <p className="text-xs text-red-500 mt-1">{errors.merchantId}</p>}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium mb-1">Branch Name</label>
          <input name="branchName" value={form.branchName} onChange={handleChange} className="border rounded-md px-2 py-1 text-sm w-full" />
          {errors.branchName && <p className="text-xs text-red-500 mt-1">{errors.branchName}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Address</label>
          <input name="branchAddress" value={form.branchAddress} onChange={handleChange} className="border rounded-md px-2 py-1 text-sm w-full" />
          {errors.branchAddress && <p className="text-xs text-red-500 mt-1">{errors.branchAddress}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Industry</label>
          <input name="industry" value={form.industry} onChange={handleChange} className="border rounded-md px-2 py-1 text-sm w-full" />
          {errors.industry && <p className="text-xs text-red-500 mt-1">{errors.industry}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Phone Number</label>
          <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="border rounded-md px-2 py-1 text-sm w-full" />
          {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">
            Logo <span className="text-gray-400">(optional)</span>
          </label>
          {logoPreview && (
            <img src={logoPreview} alt="Logo preview" className="w-16 h-16 object-cover rounded-md mb-2" />
          )}
          <input type="file" accept="image/*" onChange={handleLogoChange} className="text-xs w-full" />
        </div>
      </form>
    </ConfirmDialog>
  );
}

export default BranchForm;