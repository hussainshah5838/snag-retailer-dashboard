import React from "react";
import BarChart from "../../../shared/charts/BarChart";

function SegmentPerformanceChart({ data }) {
  if (!data) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm h-full">
        <h3 className="text-sm font-semibold mb-2">Segment Performance</h3>
        <div className="text-sm text-muted">No data available.</div>
      </div>
    );
  }

  let chartData = null;
  let fallback = null;

  if (data.labels && Array.isArray(data.labels) && Array.isArray(data.series)) {
    chartData = data;
  } else if (Array.isArray(data)) {
    try {
      const labels = data.map((d) => d && (d.segmentName ?? d.name ?? ""));
      const views = data.map((d) => Number(d?.views ?? 0));
      const redemptions = data.map((d) => Number(d?.redemptions ?? 0));
      const ctr = data.map((d) => Number(d?.ctr ?? 0));

      const hasAny =
        views.some((v) => v > 0) ||
        redemptions.some((r) => r > 0) ||
        ctr.some((c) => c > 0);
      if (!labels.length || !hasAny) {
        fallback = "No data points to display.";
      } else {
        chartData = {
          labels,
          series: [
            { id: "views", name: "Views", data: views },
            { id: "redemptions", name: "Redemptions", data: redemptions },
            { id: "ctr", name: "CTR %", data: ctr },
          ],
        };
      }
    } catch (err) {
      console.error("SegmentPerformanceChart processing error:", err);
      fallback = "Unable to prepare chart data.";
    }
  } else {
    fallback = "No chart data available.";
  }

  if (fallback) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm h-full">
        <h3 className="text-sm font-semibold mb-2">Segment Performance</h3>
        <div className="text-sm text-muted">{fallback}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm h-full">
      <h3 className="text-sm font-semibold mb-2">Segment Performance</h3>
      <BarChart data={chartData} />
    </div>
  );
}

export default SegmentPerformanceChart;
