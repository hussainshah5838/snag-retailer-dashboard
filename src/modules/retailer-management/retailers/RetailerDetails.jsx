// src/modules/retailer-management/retailers/RetailerDetails.jsx
import React from "react";
import RetailerStatusBadge from "../components/RetailerStatusBadge";
import TermsAcceptanceBadge from "../components/TermsAcceptanceBadge";

function RetailerDetails({ retailer }) {
  if (!retailer) {
    return (
      <div className="rounded-xl p-4 shadow-sm" style={{ background: "var(--card)", borderColor: "var(--line)", borderWidth: 1 }}>
        <p className="text-xs text-slate-400">No retailer selected.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-4 shadow-sm space-y-3" style={{ background: "var(--card)", borderColor: "var(--line)", borderWidth: 1 }}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-semibold text-slate-50">{retailer.name}</h2>
          <p className="text-xs text-slate-400">{retailer.email}</p>
        </div>
        <div className="flex gap-2">
          <RetailerStatusBadge status={retailer.status} />
          <TermsAcceptanceBadge
            accepted={retailer.termsAccepted}
            version={retailer.termsVersion}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div>
          <p className="font-medium">Contact Number</p>
          <p className="text-slate-300">{retailer.contactNumber || "Not provided"}</p>
        </div>
        <div>
          <p className="font-medium">Category</p>
          <p className="text-slate-300">{retailer.category || "Not specified"}</p>
        </div>
        <div>
          <p className="font-medium">Created At</p>
          <p className="text-slate-300">{retailer.createdAt || "Unknown"}</p>
        </div>
        <div>
          <p className="font-medium">Last Updated</p>
          <p className="text-slate-300">{retailer.updatedAt || "Unknown"}</p>
        </div>
      </div>

      {retailer.notes && (
        <div className="text-xs">
          <p className="font-medium mb-1">Internal Notes</p>
          <p className="text-slate-300 whitespace-pre-line">{retailer.notes}</p>
        </div>
      )}
    </div>
  );
}

export default RetailerDetails;
