import React, { useState } from "react";
import { exportAnalyticsReport } from "../api/analytics.service";

function ExportReportButton({ filters }) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    try {
      setLoading(true);
      const blob = await exportAnalyticsReport(filters || {});
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "analytics-report.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to export report");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="px-3 py-1 text-xs bg-gray-800 text-white rounded-md"
    >
      {loading ? "Exporting..." : "Export Report"}
    </button>
  );
}

export default ExportReportButton;
