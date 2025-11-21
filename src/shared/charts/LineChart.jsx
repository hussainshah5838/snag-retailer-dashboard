// src/shared/charts/BarChart.jsx
import React, { useMemo } from "react";

function BarChart({ data }) {
  const { labels = [], series = [] } = data || {};

  const maxValue = useMemo(() => {
    if (!series.length) return 0;
    return Math.max(
      ...series.flatMap((s) => s.data || []).map((v) => Number(v) || 0)
    );
  }, [series]);

  if (!labels.length || !series.length || maxValue === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-[11px] text-gray-400">
        No data
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-end gap-2 h-40">
        {labels.map((label, labelIndex) => (
          <div
            key={label}
            className="flex-1 flex flex-col items-center gap-1 text-[10px]"
          >
            <div className="flex-1 flex items-end gap-1 w-full">
              {series.map((s, seriesIndex) => {
                const value = Number(s.data?.[labelIndex] || 0);
                const heightPct = Math.max(4, (value / maxValue) * 100);

                // simple 3 colors cycling
                const palette = [
                  "bg-blue-500",
                  "bg-emerald-500",
                  "bg-amber-500",
                  "bg-fuchsia-500",
                ];
                const colorClass = palette[seriesIndex % palette.length];

                return (
                  <div
                    key={s.id || s.name || seriesIndex}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${heightPct}%`,
                    }}
                  >
                    <div
                      className={`${colorClass} h-full rounded-sm transition-transform hover:scale-[1.02]`}
                      title={`${s.name}: ${value}`}
                    />
                  </div>
                );
              })}
            </div>
            <span className="truncate text-[10px] text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-[10px] text-gray-600">
        {series.map((s, idx) => {
          const palette = [
            "bg-blue-500",
            "bg-emerald-500",
            "bg-amber-500",
            "bg-fuchsia-500",
          ];
          const colorClass = palette[idx % palette.length];
          return (
            <div
              key={s.id || s.name || idx}
              className="flex items-center gap-1"
            >
              <span
                className={`inline-block w-2 h-2 rounded-sm ${colorClass}`}
              />
              <span>{s.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BarChart;
