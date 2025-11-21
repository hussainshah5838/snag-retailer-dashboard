import React from "react";

function DocViewer({ doc }) {
  if (!doc) {
    return (
      <div
        className="rounded-xl p-4 shadow-sm"
        style={{
          background: "var(--card)",
          borderColor: "var(--line)",
          borderWidth: 1,
        }}
      >
        <p className="text-xs text-slate-400">
          Select a document to view its content.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-4 shadow-sm text-xs space-y-2"
      style={{
        background: "var(--card)",
        borderColor: "var(--line)",
        borderWidth: 1,
      }}
    >
      <div>
        <h2 className="text-sm font-semibold text-slate-50">{doc.title}</h2>
        <p className="text-slate-400">
          {doc.version ? `Version ${doc.version} · ` : ""}
          {doc.updatedAt && `Updated ${doc.updatedAt}`}
        </p>
      </div>
      <div
        className="border-t pt-2 text-slate-200 whitespace-pre-wrap"
        style={{ borderColor: "var(--line)" }}
      >
        {doc.content}
      </div>
    </div>
  );
}

export default DocViewer;
