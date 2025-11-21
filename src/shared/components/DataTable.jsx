import React from "react";

// Minimal, reusable DataTable used across modules. Supports:
// - columns: [{ key, label, render? }]
// - data: array of objects
// - onRowClick(row)
// - actions: [{ label, onClick }]

function DataTable({ columns = [], data = [], onRowClick, actions = [] }) {
  const safeData = Array.isArray(data) ? data : [];

  if (!safeData.length) {
    return (
      <div className="w-full rounded-md p-4 text-sm text-gray-400">
        No rows to display.
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-3 py-2 text-xs font-medium text-gray-300"
              >
                {col.label}
              </th>
            ))}
            {actions.length > 0 && (
              <th className="px-3 py-2 text-xs font-medium text-gray-300">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {safeData.map((row, rowIndex) => (
            <tr
              key={row.id ?? rowIndex}
              className="odd:bg-transparent even:bg-gray-900/30 hover:bg-gray-800 cursor-pointer"
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-2 align-top text-gray-100">
                  {col.render ? col.render(row) : String(row[col.key] ?? "")}
                </td>
              ))}
              {actions.length > 0 && (
                <td className="px-3 py-2 space-x-2">
                  {actions.map((act, i) => (
                    <div key={i} onClick={(e) => e.stopPropagation()}>
                      {act.render ? (
                        act.render(row)
                      ) : (
                        <button
                          onClick={() => act.onClick && act.onClick(row)}
                          className="px-2 py-1 text-xs bg-blue-600 text-white rounded-md"
                        >
                          {act.label}
                        </button>
                      )}
                    </div>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
