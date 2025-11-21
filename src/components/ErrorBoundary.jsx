import React from "react";

export default function ErrorBoundary({ error }) {
  // react-router passes an `error` object when using errorElement
  const message = error?.message ?? (error ? String(error) : "Unknown error");
  const stack = error && error.stack ? error.stack : null;

  return (
    <div className="page min-h-screen flex items-center justify-center p-6">
      <div className="card max-w-3xl w-full p-6">
        <h2 className="text-lg font-semibold mb-2">
          Unexpected Application Error
        </h2>
        <div className="mb-4 text-sm text-muted">{message}</div>
        {stack && (
          <pre
            className="text-xs bg-[#0b0b0b]/6 p-3 rounded-md overflow-auto"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {stack}
          </pre>
        )}
        <div className="mt-4 text-xs text-muted">
          You can open the browser console for more details.
        </div>
      </div>
    </div>
  );
}
