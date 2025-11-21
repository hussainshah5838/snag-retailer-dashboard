import React, { useState } from "react";
import { uploadBrandAsset } from "../api/brandAssets.service";

function BrandAssetUploader({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [label, setLabel] = useState("");
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
      if (label) formData.append("label", label);

      const asset = await uploadBrandAsset(formData);
      setFile(null);
      setLabel("");

      if (onUploaded) onUploaded(asset);
    } catch {
      setError("Failed to upload asset.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <div>
        <label className="block text-xs font-medium mb-1">Label</label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="border rounded-md px-2 py-1 text-sm w-full"
        />
      </div>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-xs"
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={uploading || !file}
        className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}

export default BrandAssetUploader;
