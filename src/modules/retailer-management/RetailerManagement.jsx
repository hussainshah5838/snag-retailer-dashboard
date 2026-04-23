import React, { useState } from "react";
import MerchantList from "./merchants/MerchantList";
import BranchList from "./branches/BranchList";
import BrandAssetList from "./brand-assets/BrandAssetList";
import RuntimeErrorBoundary from "../../components/RuntimeErrorBoundary";

const TABS = [
  { id: "merchants", label: "Merchants" },
  { id: "branches", label: "Branches" },
  { id: "assets", label: "Brand Assets" },
];

function RetailerManagement() {
  const [activeTab, setActiveTab] = useState("merchants");

  function renderTab() {
    switch (activeTab) {
      case "merchants":
        return <MerchantList />;
      case "branches":
        return <BranchList />;
      case "assets":
        return <BrandAssetList />;
      default:
        return null;
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">Merchant Management</h1>
      </div>

      <div className="border-b flex gap-4 text-xs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 px-1 border-b-2 ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <RuntimeErrorBoundary message="Failed to load Merchant Management tab">
        {renderTab()}
      </RuntimeErrorBoundary>
    </div>
  );
}

export default RetailerManagement;
