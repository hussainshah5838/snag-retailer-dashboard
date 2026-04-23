// src/modules/retailer-management/merchants/MerchantDetails.jsx
import React from "react";
import MerchantStatusBadge from "../components/MerchantStatusBadge";

function MerchantDetails({ merchant }) {
  if (!merchant) {
    return (
      <div className="rounded-xl p-4 shadow-sm" style={{ background: "var(--card)", borderColor: "var(--line)", borderWidth: 1 }}>
        <p className="text-xs text-slate-400">No merchant selected.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-4 shadow-sm space-y-3" style={{ background: "var(--card)", borderColor: "var(--line)", borderWidth: 1 }}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-semibold text-slate-50">{`${merchant.firstName} ${merchant.lastName}`.trim()}</h2>
          <p className="text-xs text-slate-400">{merchant.email}</p>
        </div>
        <div className="flex gap-2">
          <MerchantStatusBadge status={merchant.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div>
          <p className="font-medium">Phone Number</p>
          <p className="text-slate-300">{merchant.phoneNumber || "Not provided"}</p>
        </div>
        <div>
          <p className="font-medium">Branch</p>
          <p className="text-slate-300">{merchant.branchName || "No Branch"}</p>
        </div>
        <div>
          <p className="font-medium">Industry</p>
          <p className="text-slate-300">{merchant.industry || "Not specified"}</p>
        </div>
        <div>
          <p className="font-medium">Status</p>
          <p className="text-slate-300">{merchant.isVerified ? "Verified" : "Not Verified"}</p>
        </div>
        <div>
          <p className="font-medium">Created At</p>
          <p className="text-slate-300">{new Date(merchant.createdAt).toLocaleDateString() || "Unknown"}</p>
        </div>
        <div>
          <p className="font-medium">Onboarding Step</p>
          <p className="text-slate-300">{merchant.onboardingStep || "Unknown"}</p>
        </div>
      </div>
    </div>
  );
}

export default MerchantDetails;
