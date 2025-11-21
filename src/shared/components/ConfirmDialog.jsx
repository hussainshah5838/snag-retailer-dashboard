// src/shared/components/ConfirmDialog.jsx
import React from "react";

function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onClose,
  onConfirm,
  confirmDisabled = false,
}) {
  if (!open) return null;

  function handleConfirm() {
    if (!onConfirm) return;
    // Provide a fake event so handlers using e.preventDefault() don't break
    const fakeEvent = { preventDefault: () => {} };
    onConfirm(fakeEvent);
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        style={{ background: "rgba(15,21,42,0.6)" }}
      />

      {/* Drawer panel (slide-in from right) */}
      <div
        className="absolute top-0 right-0 h-full w-full max-w-md transform transition-transform"
        style={{
          background: "rgb(15,21,42)",
          borderLeft: "1px solid var(--line)",
          boxShadow: "-20px 0 40px rgba(0,0,0,0.6)",
        }}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            {title ? (
              <h2 className="text-sm font-semibold text-slate-50">{title}</h2>
            ) : (
              <div />
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          </div>

          <div className="text-xs text-slate-200 mb-3 flex-1 overflow-auto">
            {children}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs rounded-md border text-slate-200 hover:bg-slate-800"
              style={{ borderColor: "var(--line)" }}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={confirmDisabled}
              className={`px-3 py-1.5 text-xs rounded-md text-white ${
                confirmDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
