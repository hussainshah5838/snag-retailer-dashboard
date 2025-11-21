import React, { useState } from "react";
import { uploadOfferCsv } from "../api/offerCsv.service";

function OfferCsvUpload({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadOfferCsv(formData);
      setFile(null);
      if (onUploaded) onUploaded(res);
    } catch {
      setError("Failed to upload CSV.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="text-xs"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={uploading || !file}
        className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md"
      >
        {uploading ? "Uploading..." : "Upload CSV"}
      </button>
    </form>
  );
}

export default OfferCsvUpload;
