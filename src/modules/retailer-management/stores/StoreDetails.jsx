// src/modules/retailer-management/stores/StoreDetails.jsx
import React from "react";

function StoreDetails({ store }) {
  if (!store) {
    return (
      <div className="rounded-xl p-4 shadow-sm" style={{ background: "var(--card)", borderColor: "var(--line)", borderWidth: 1 }}>
        <p className="text-xs text-slate-400">No store selected.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-4 shadow-sm space-y-3 text-xs" style={{ background: "var(--card)", borderColor: "var(--line)", borderWidth: 1 }}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-semibold">{store.name}</h2>
          <p className="text-slate-400">{store.storeNumber ? `Store #${store.storeNumber}` : ""}</p>
        </div>
        {store.appStoreId && (
          <span className="text-[11px] text-slate-400">App Store ID: {store.appStoreId}</span>
        )}
      </div>

      <div>
        <p className="font-medium mb-1">Address</p>
        <p className="text-slate-300 whitespace-pre-line">{store.address || "Not provided"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <p className="font-medium">Latitude</p>
          <p className="text-slate-300">{store.latitude ?? "Not set"}</p>
        </div>
        <div>
          <p className="font-medium">Longitude</p>
          <p className="text-slate-300">{store.longitude ?? "Not set"}</p>
        </div>
        <div>
          <p className="font-medium">Created At</p>
          <p className="text-slate-300">{store.createdAt || "Unknown"}</p>
        </div>
        <div>
          <p className="font-medium">Last Updated</p>
          <p className="text-slate-300">{store.updatedAt || "Unknown"}</p>
        </div>
      </div>
    </div>
  );
}

export default StoreDetails;
