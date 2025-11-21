import React, { useState } from "react";

function OfferImagePicker({ value, onChange }) {
  const [preview, setPreview] = useState(value?.previewUrl || "");

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) {
      onChange(null);
      setPreview("");
      return;
    }

    const next = { file, previewUrl: URL.createObjectURL(file) };
    onChange(next);
    setPreview(next.previewUrl);
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="text-xs"
      />
      {preview ? (
        <div className="border rounded-md p-2 w-40 h-40 flex items-center justify-center">
          <img
            src={preview}
            alt="Offer"
            className="object-contain max-h-full max-w-full"
          />
        </div>
      ) : (
        <p className="text-[11px] text-gray-500">No image selected.</p>
      )}
    </div>
  );
}

export default OfferImagePicker;
