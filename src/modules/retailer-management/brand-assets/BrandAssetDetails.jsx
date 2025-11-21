// src/modules/retailer-management/brand-assets/BrandAssetDetails.jsx
import React from "react";

function BrandAssetDetails({ asset }) {
  if (!asset) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-xs text-gray-500">No asset selected.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm space-y-3 text-xs">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-semibold">
            {asset.label || "Brand Asset"}
          </h2>
          <p className="text-gray-500">{asset.fileName}</p>
        </div>
        {asset.mimeType && (
          <span className="text-[11px] text-gray-500">{asset.mimeType}</span>
        )}
      </div>

      {asset.url && (
        <div className="border rounded-md p-2 flex justify-center">
          <img
            src={asset.url}
            alt={asset.label || "Brand asset"}
            className="max-h-48 object-contain"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <p className="font-medium">Dimensions</p>
          <p className="text-gray-600">
            {asset.width && asset.height
              ? `${asset.width} x ${asset.height}`
              : "Unknown"}
          </p>
        </div>
        <div>
          <p className="font-medium">Size</p>
          <p className="text-gray-600">
            {asset.sizeReadable || asset.size || "Unknown"}
          </p>
        </div>
        <div>
          <p className="font-medium">Created At</p>
          <p className="text-gray-600">{asset.createdAt || "Unknown"}</p>
        </div>
        <div>
          <p className="font-medium">Last Used</p>
          <p className="text-gray-600">{asset.lastUsedAt || "Unknown"}</p>
        </div>
      </div>
    </div>
  );
}

export default BrandAssetDetails;
