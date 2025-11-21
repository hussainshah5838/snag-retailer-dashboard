import React from "react";
import BarChart from "../../../shared/charts/BarChart";

function StorePerformanceChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map((d) => d.storeName),
    series: [
      {
        id: "views",
        name: "Views",
        data: data.map((d) => d.views),
      },
      {
        id: "redemptions",
        name: "Redemptions",
        data: data.map((d) => d.redemptions),
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm h-full">
      <h3 className="text-sm font-semibold mb-2">Store Performance</h3>
      <BarChart data={chartData} />
    </div>
  );
}

export default StorePerformanceChart;
