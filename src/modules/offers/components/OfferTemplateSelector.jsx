import React, { useEffect, useState } from "react";
import Loading from "../../../components/Loading";
import { fetchOfferTemplates } from "../api/offerTemplates.service";

function OfferTemplateSelector({ value, onChange, disabled }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        const res = await fetchOfferTemplates({}, controller.signal);
        // Normalize response to an array to avoid runtime crashes
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.items)
          ? res.items
          : [];
        setTemplates(list);
      } catch (err) {
        // Ignore abort/cancel errors, log other failures
        if (
          err &&
          err.name !== "AbortError" &&
          err.name !== "CanceledError" &&
          err.code !== "ERR_CANCELED"
        ) {
          console.error("Failed to load offer templates:", err);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="border rounded-md px-2 py-1 text-sm w-full"
    >
      <option value="">Select template</option>
      {templates.map((tpl) => (
        <option key={tpl.id} value={tpl.id}>
          {tpl.name}
        </option>
      ))}
    </select>
  );
}

export default OfferTemplateSelector;
