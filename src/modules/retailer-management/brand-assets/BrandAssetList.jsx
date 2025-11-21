import React, { useEffect, useState } from "react";
import Loading from "../../../components/Loading";
import { fetchBrandAssets, deleteBrandAsset } from "../api/brandAssets.service";
import BrandAssetUploader from "./BrandAssetUploader";

// Defensive BrandAssetList: filter bad items, guard deletes, and provide
// fallbacks for missing properties so render doesn't throw on malformed data.

function BrandAssetList() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load(signal) {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchBrandAssets({}, signal);
      // API may return { items: [...] } or an array; normalize to array
      const items = Array.isArray(res)
        ? res
        : Array.isArray(res?.items)
        ? res.items
        : [];
      setAssets(items);
    } catch (err) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        setError("Failed to load brand assets.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, []);

  async function handleDelete(asset) {
    if (!asset) return;
    if (!window.confirm("Delete this asset?")) return;
    try {
      await deleteBrandAsset(asset.id);
      const controller = new AbortController();
      load(controller.signal);
    } catch (err) {
      // show a friendly error and avoid throwing
      setError("Failed to delete asset.");
    }
  }

  function handleUploaded(asset) {
    setAssets((prev) => [asset, ...prev]);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold">Brand Assets</h2>
        <BrandAssetUploader onUploaded={handleUploaded} />
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : assets.length === 0 ? (
        <p className="text-xs text-gray-500">No assets uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {assets.filter(Boolean).map((asset, idx) => {
            const id = asset?.id ?? `asset-${idx}`;
            const url = asset?.url ?? "";
            const label = asset?.label ?? "Untitled";
            return (
              <div
                key={id}
                className="border rounded-md p-2 flex flex-col items-center text-xs"
              >
                {url ? (
                  <img
                    src={url}
                    alt={label}
                    className="h-16 w-full object-contain mb-2"
                    onError={(e) => {
                      // hide broken image instead of causing layout issues
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="h-16 w-full bg-gray-100 dark:bg-gray-800 mb-2 flex items-center justify-center text-xs text-gray-500">
                    No image
                  </div>
                )}
                <p className="truncate w-full text-center">{label}</p>
                <button
                  onClick={() => handleDelete(asset)}
                  className="mt-1 text-[10px] text-red-500"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BrandAssetList;
