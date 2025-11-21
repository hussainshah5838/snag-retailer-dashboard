// src/shared/charts/StatsCard.jsx
import React from "react";

function StatsCard({ title, value, helper, trend, trendLabel }) {
  const trendNumber = Number(trend);
  const hasTrendNumber = Number.isFinite(trendNumber);
  const isUp = hasTrendNumber && trendNumber > 0;
  const isDown = hasTrendNumber && trendNumber < 0;

  let trendColor = "text-gray-500";
  if (isUp) trendColor = "text-emerald-600";
  if (isDown) trendColor = "text-red-600";

  const displayValue = (() => {
    // Prefer showing finite numbers; fall back to 0 or a dash
    const n = Number(value);
    if (Number.isFinite(n)) return n;
    return value ?? "–";
  })();

  const showTrend = Boolean(trendLabel) || hasTrendNumber;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 shadow-sm text-xs flex flex-col gap-1">
      <p className="text-[11px] text-gray-300">{title}</p>
      <p className="text-lg font-semibold text-gray-100">{displayValue}</p>
      {helper && <p className="text-[11px] text-gray-300">{helper}</p>}
      {showTrend && (
        <p className={`text-[11px] font-medium ${trendColor}`}>
          {isUp && "▲ "}
          {isDown && "▼ "}
          {trendLabel || (hasTrendNumber ? `${trendNumber}% vs previous` : "")}
        </p>
      )}
    </div>
  );
}

export default StatsCard;
