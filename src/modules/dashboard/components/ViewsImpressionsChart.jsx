import React from "react";
import StatsCard from "../../../shared/charts/StatsCard";

const SAMPLE_VIEWS = [
  { label: "Mon", views: 120, impressions: 420 },
  { label: "Tue", views: 160, impressions: 520 },
  { label: "Wed", views: 180, impressions: 600 },
  { label: "Thu", views: 140, impressions: 480 },
  { label: "Fri", views: 200, impressions: 700 },
  { label: "Sat", views: 240, impressions: 880 },
  { label: "Sun", views: 210, impressions: 760 },
];

function ViewsImpressionsChart({ data }) {
  // Show loading state if no data
  if (!data) {
    return (
      <div className="bg-slate-900 rounded-xl p-4 shadow-sm h-full">
        <h3 className="text-sm font-semibold mb-2 text-slate-100">
          Views & Impressions
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
          Views & Impressions
        </h3>
        <div className="text-sm text-slate-300">No data points to display.</div>
      </div>
    );
  }

  // Prepare chartData in a safe way (no JSX inside try/catch)
  let chartData = null;
  let fallbackMessage = null;

  if (data.labels && Array.isArray(data.labels) && Array.isArray(data.series)) {
    chartData = data;
  } else if (Array.isArray(data)) {
    try {
      const labels = data.map((d) => d && (d.label ?? d.date ?? ""));
      const views = data.map((d) => Number(d?.views ?? 0));
      const impressions = data.map((d) => Number(d?.impressions ?? 0));

      const hasAny = views.some((v) => v > 0) || impressions.some((i) => i > 0);
      if (!labels.length || !hasAny) {
        fallbackMessage = "No data points to display.";
      } else {
        chartData = {
          labels,
          series: [
            { id: "views", name: "Views", data: views },
            { id: "impressions", name: "Impressions", data: impressions },
          ],
        };
      }
    } catch (err) {
      console.error("ViewsImpressionsChart processing error:", err);
      fallbackMessage = "Unable to prepare chart data.";
    }
  } else {
    fallbackMessage = "No chart data available.";
  }

  if (fallbackMessage) {
    return (
      <div className="bg-slate-900 rounded-xl p-4 shadow-sm h-full">
        <h3 className="text-sm font-semibold mb-2 text-slate-100">
          Views & Impressions
        </h3>
        <div className="text-sm text-slate-300">{fallbackMessage}</div>
      </div>
    );
  }

  // Instead of a chart, render concise stats and a compact daily table.
  const totalViews = chartData.series[0].data.reduce(
    (a, b) => a + Number(b || 0),
    0
  );
  const totalImpressions = chartData.series[1].data.reduce(
    (a, b) => a + Number(b || 0),
    0
  );
  const avgViews = Math.round(
    totalViews / Math.max(1, chartData.labels.length)
  );
  const avgImpr = Math.round(
    totalImpressions / Math.max(1, chartData.labels.length)
  );

  return (
    <div className="bg-slate-900 rounded-xl p-4 shadow-sm h-full">
      <h3 className="text-sm font-semibold mb-3 text-slate-100">
        Views & Impressions
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <StatsCard
          title="Total Views"
          value={totalViews}
          helper={`Avg / day: ${avgViews}`}
          trend={0}
        />
        <StatsCard
          title="Total Impressions"
          value={totalImpressions}
          helper={`Avg / day: ${avgImpr}`}
          trend={0}
        />
      </div>

      <div className="overflow-auto rounded-md border border-slate-700">
        <table className="w-full text-xs text-slate-200">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-3 py-2 text-left">Day</th>
              <th className="px-3 py-2 text-right">Views</th>
              <th className="px-3 py-2 text-right">Impressions</th>
            </tr>
          </thead>
          <tbody>
            {chartData.labels.map((label, idx) => (
              <tr key={label} className="border-t border-slate-700">
                <td className="px-3 py-2 text-slate-300">{label}</td>
                <td className="px-3 py-2 text-right">
                  {chartData.series[0].data[idx]}
                </td>
                <td className="px-3 py-2 text-right">
                  {chartData.series[1].data[idx]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewsImpressionsChart;
