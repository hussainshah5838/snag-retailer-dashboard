// src/shared/components/SearchBar.jsx
import React from "react";

function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
  className = "",
}) {
  function handleChange(e) {
    onChange && onChange(e.target.value);
  }

  return (
    <div
      className={`flex items-center gap-2 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 ${className}`}
    >
      <span className="text-gray-400 text-sm">🔍</span>
      <input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none focus:outline-none text-xs text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
      />
    </div>
  );
}

export default SearchBar;
