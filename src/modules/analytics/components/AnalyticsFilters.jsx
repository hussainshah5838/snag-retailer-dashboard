import React from "react";

export default function AnalyticsFilters({
  filters = {},
  onChange = () => {},
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600">Filters</div>
      {/* Minimal placeholder filter controls - replace with real controls later */}
      <div className="flex gap-2">
        <input
          className="border px-2 py-1 rounded"
          placeholder="Search..."
          value={filters.q || ""}
          onChange={(e) => onChange({ ...filters, q: e.target.value })}
        />
      </div>
    </div>
  );
}
