import React, { useState } from "react";
import RetailerList from "./retailers/RetailerList";
import StoreList from "./stores/StoreList";
import BrandAssetList from "./brand-assets/BrandAssetList";
import RuntimeErrorBoundary from "../../components/RuntimeErrorBoundary";
import RetailerCsvUpload from "./csv-import/RetailerCsvUpload";
import RetailerCsvImportLogs from "./csv-import/RetailerCsvImportLogs";

const TABS = [
  { id: "retailers", label: "Retailers" },
  { id: "stores", label: "Stores" },
  { id: "assets", label: "Brand Assets" },
  { id: "csv", label: "CSV Import" },
];

function RetailerManagement() {
  const [activeTab, setActiveTab] = useState("retailers");
  const [lastUploadResult, setLastUploadResult] = useState(null);

  function renderTab() {
    switch (activeTab) {
      case "retailers":
        return <RetailerList />;
      case "stores":
        return <StoreList />;
      case "assets":
        return <BrandAssetList />;
      case "csv":
        return (
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="text-sm font-semibold mb-2">
                Upload Retailers/Stores CSV
              </h2>
              <RetailerCsvUpload onUploaded={setLastUploadResult} />
              {lastUploadResult && (
                <p className="mt-2 text-xs text-gray-600">
                  Import started with ID: {lastUploadResult.id}
                </p>
              )}
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <RetailerCsvImportLogs />
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">Retailer Management</h1>
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

      <RuntimeErrorBoundary message="Failed to load Retailer Management tab">
        {renderTab()}
      </RuntimeErrorBoundary>
    </div>
  );
}

export default RetailerManagement;
