import React from "react";
import StatsCard from "../../../shared/charts/StatsCard";

const SAMPLE_REDEMPTIONS = [
  { label: "Mon", redemptions: 2 },
  { label: "Tue", redemptions: 4 },
  { label: "Wed", redemptions: 6 },
  { label: "Thu", redemptions: 3 },
  { label: "Fri", redemptions: 8 },
  { label: "Sat", redemptions: 10 },
  { label: "Sun", redemptions: 5 },
];

function RedemptionsChart({ data }) {
  // Show loading state if no data
  if (!data) {
    return (
      <div className="bg-slate-900 rounded-xl p-4 shadow-sm h-full">
        <h3 className="text-sm font-semibold mb-2 text-slate-100">
          Redemptions Over Time
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-400 text-sm">Loading chart data...</div>
        </div>
      </div>
    );
  }

  // If there's empty data, show no data message
  if (Array.isArray(data) && data.length === 0) {
    return (
      <div className="bg-slate-900 rounded-xl p-4 shadow-sm h-full">
        <h3 className="text-sm font-semibold mb-2 text-slate-100">
          Redemptions Over Time
        </h3>
        <div className="text-sm text-slate-300">No data points to display.</div>
      </div>
    );
  }

  let chartData = null;
  let fallback = null;

  if (data.labels && Array.isArray(data.labels) && Array.isArray(data.series)) {
    chartData = data;
  } else if (Array.isArray(data)) {
    try {
      const labels = data.map((d) => d && (d.label ?? d.date ?? ""));
      const redemptions = data.map((d) => Number(d?.redemptions ?? 0));

      const hasAny = redemptions.some((v) => v > 0);
      if (!labels.length || !hasAny) {
        fallback = "No data points to display.";
      } else {
        chartData = {
          labels,
          series: [
            { id: "redemptions", name: "Redemptions", data: redemptions },
          ],
        };
      }
    } catch (err) {
      console.error("RedemptionsChart processing error:", err);
      fallback = "Unable to prepare chart data.";
    }
  } else {
    fallback = "No chart data available.";
  }

  if (fallback) {
    return (
      <div className="bg-slate-900 rounded-xl p-4 shadow-sm h-full">
        <h3 className="text-sm font-semibold mb-2 text-slate-100">
          Redemptions Over Time
        </h3>
        <div className="text-sm text-slate-300">{fallback}</div>
      </div>
    );
  }

  // Calculate totals and averages and render a small summary instead of a chart
  const total = chartData.series[0].data.reduce(
    (a, b) => a + Number(b || 0),
    0
  );
  const avg = Math.round(total / Math.max(1, chartData.labels.length));

  return (
    <div className="bg-slate-900 rounded-xl p-4 shadow-sm h-full">
      <h3 className="text-sm font-semibold mb-3 text-slate-100">
        Redemptions Over Time
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StatsCard
          title="Total Redemptions"
          value={total}
          helper={`Avg / day: ${avg}`}
          trend={0}
        />
        <div className="bg-slate-800 rounded-xl p-3 text-slate-300">
          <p className="text-sm font-medium text-slate-100 mb-2">
            Daily Breakdown
          </p>
          <ul className="text-xs space-y-1">
            {chartData.labels.map((lbl, i) => (
              <li key={lbl} className="flex justify-between">
                <span className="text-slate-300">{lbl}</span>
                <span className="text-slate-200">
                  {chartData.series[0].data[i]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RedemptionsChart;
