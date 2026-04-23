import React, { useEffect, useRef, useState } from "react";
import Loading from "../../../components/Loading";
import { fetchBrandAssets, uploadBrandAssetLogo, removeBrandAssetLogo } from "../api/brandAssets.service";

function BrandAssetCard({ asset, onUpdated }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      setError(null);
      const updated = await uploadBrandAssetLogo(asset.id, file);
      onUpdated(updated);
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleRemoveLogo() {
    if (!window.confirm(`Remove logo for "${asset.branchName}"?`)) return;
    try {
      await removeBrandAssetLogo(asset.id);
      // Update card locally - clear logo but keep branch in grid
      onUpdated({ ...asset, logoUrl: null });
    } catch {
      setError("Failed to remove logo.");
    }
  }

  return (
    <div
      className="border rounded-xl p-3 flex flex-col items-center gap-2 text-xs"
      style={{ borderColor: "var(--line)", background: "var(--card)" }}
    >
      {/* Logo or placeholder */}
      {asset.logoUrl ? (
        <img
          src={asset.logoUrl}
          alt={asset.branchName}
          className="h-20 w-full object-contain rounded-md"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      ) : (
        <div className="h-20 w-full rounded-md bg-gray-800 flex items-center justify-center text-gray-400 text-[11px]">
          No Logo
        </div>
      )}

      {/* Branch name */}
      <p className="font-medium truncate w-full text-center text-gray-100">
        {asset.branchName}
      </p>
      {/* <p className="text-gray-400 truncate w-full text-center">{asset.merchantName}</p> */}

      {error && <p className="text-red-500 text-[10px]">{error}</p>}

      {/* Upload button */}
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full px-2 py-1 text-[11px] bg-blue-600 text-white rounded-md disabled:opacity-50"
      >
        {uploading ? "Uploading..." : asset.logoUrl ? "Update Logo" : "Upload Logo"}
      </button>
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Delete logo button - only shows if logo exists */}
      {asset.logoUrl && (
        <button
          onClick={handleRemoveLogo}
          className="w-full px-2 py-1 text-[11px] border border-red-500 text-red-500 rounded-md hover:bg-red-500/10"
        >
          Remove Logo
        </button>
      )}
    </div>
  );
}

function BrandAssetList() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchBrandAssets({}, controller.signal);
        const items = Array.isArray(res) ? res : Array.isArray(res?.items) ? res.items : [];
        setAssets(items);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError")
          setError("Failed to load brand assets.");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, []);

  function handleUpdated(updated) {
    setAssets((prev) =>
      prev.map((a) => (a.id === updated.id ? { ...a, ...updated } : a))
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold">Brand Assets</h2>

      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : assets.length === 0 ? (
        <p className="text-xs text-gray-500">
          No branches found. Add a branch first.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <BrandAssetCard
              key={asset.id}
              asset={asset}
              onUpdated={handleUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BrandAssetList;
