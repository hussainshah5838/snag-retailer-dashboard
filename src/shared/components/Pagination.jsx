// src/shared/components/Pagination.jsx
import React from "react";

function Pagination({ page, pageSize, total, onChange }) {
  const safePage = Number(page) || 1;
  const size = Number(pageSize) || 10;
  const totalItems = Number(total) || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / size));

  function goTo(newPage) {
    const p = Math.min(Math.max(newPage, 1), totalPages);
    if (p !== safePage && onChange) onChange(p);
  }

  return (
    <div className="flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-300">
      <div>
        Page <span className="font-semibold">{safePage}</span> of{" "}
        <span className="font-semibold">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => goTo(safePage - 1)}
          disabled={safePage <= 1}
          className={`px-2 py-1 rounded border text-xs ${
            safePage <= 1
              ? "border-gray-200 text-gray-300 dark:border-gray-700 dark:text-gray-600 cursor-not-allowed"
              : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => goTo(safePage + 1)}
          disabled={safePage >= totalPages}
          className={`px-2 py-1 rounded border text-xs ${
            safePage >= totalPages
              ? "border-gray-200 text-gray-300 dark:border-gray-700 dark:text-gray-600 cursor-not-allowed"
              : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;
