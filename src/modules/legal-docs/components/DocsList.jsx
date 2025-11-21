import React from "react";

function DocsList({ docs, selectedId, onSelect }) {
  const safeDocs = Array.isArray(docs) ? docs.filter(Boolean) : [];

  if (safeDocs.length === 0) {
    return <p className="text-xs text-slate-400">No documents available.</p>;
  }

  return (
    <ul className="space-y-1 text-xs">
      {safeDocs.map((doc, idx) => {
        const id = doc?.id ?? `doc-${idx}`;
        const selected = id === selectedId;
        const title = doc?.title ?? "Untitled";
        const version = doc?.version ?? null;
        const updatedAt = doc?.updatedAt ?? null;

        return (
          <li key={id}>
            <button
              onClick={() => {
                try {
                  if (typeof onSelect === "function") onSelect(doc);
                } catch (e) {
                  // ignore handler errors to avoid breaking the list
                  // eslint-disable-next-line no-console
                  console.error("DocsList onSelect error:", e);
                }
              }}
              className={`w-full text-left px-2 py-1 rounded-md ${
                selected
                  ? "bg-slate-700 text-slate-50"
                  : "hover:bg-slate-800 text-slate-200"
              }`}
            >
              <div className="flex justify-between">
                <span className="font-medium">{title}</span>
                <span className="text-[10px] text-slate-400">
                  {version ? `v${version}` : ""}
                </span>
              </div>
              {updatedAt && (
                <p className="text-[10px] text-slate-400">
                  Updated {updatedAt}
                </p>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default DocsList;
