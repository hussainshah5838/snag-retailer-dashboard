import React, { useEffect, useState } from "react";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import StoreMapPicker from "../components/StoreMapPicker";

function StoreForm({ initialValue, open, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    storeNumber: "",
    appStoreId: "",
    latitude: "",
    longitude: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setForm({
        name: initialValue.name || "",
        address: initialValue.address || "",
        storeNumber: initialValue.storeNumber || "",
        appStoreId: initialValue.appStoreId || "",
        latitude: initialValue.latitude || "",
        longitude: initialValue.longitude || "",
      });
    } else {
      setForm({
        name: "",
        address: "",
        storeNumber: "",
        appStoreId: "",
        latitude: "",
        longitude: "",
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

  function handleMapChange(coords) {
    setForm((prev) => ({
      ...prev,
      latitude: coords.lat,
      longitude: coords.lng,
    }));
  }

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={initialValue ? "Edit Store" : "Create Store"}
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
          <label className="block text-xs font-medium mb-1">Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">
              Store Number
            </label>
            <input
              name="storeNumber"
              value={form.storeNumber}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 text-sm w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">
              App Store ID
            </label>
            <input
              name="appStoreId"
              value={form.appStoreId}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 text-sm w-full"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">
            Location (Pin on Map)
          </label>
          <StoreMapPicker
            value={{ lat: form.latitude, lng: form.longitude }}
            onChange={handleMapChange}
          />
        </div>
      </form>
    </ConfirmDialog>
  );
}

export default StoreForm;
