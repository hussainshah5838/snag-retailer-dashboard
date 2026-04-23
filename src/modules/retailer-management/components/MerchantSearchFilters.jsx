import React from "react";
import SearchBar from "../../../shared/components/SearchBar";

function MerchantSearchFilters({ filters, onChange }) {
  function handleInputChange(e) {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  }

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4 items-center">
      <div className="flex-1">
        <SearchBar
          placeholder="Search by name or email..."
          value={filters.search || ""}
          onChange={(value) => onChange({ ...filters, search: value })}
        />
      </div>
      <select
        name="status"
        value={filters.status || ""}
        onChange={handleInputChange}
        className="border rounded-md text-sm px-2 py-1"
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
}

export default MerchantSearchFilters;