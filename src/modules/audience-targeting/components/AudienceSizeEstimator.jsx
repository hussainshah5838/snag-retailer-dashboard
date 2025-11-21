import React from "react";

function AudienceSizeEstimator({ estimatedSize }) {
  if (estimatedSize == null) {
    return (
      <p className="text-xs text-gray-500">
        Adjust filters to see estimated audience size.
      </p>
    );
  }

  return (
    <p className="text-xs">
      Estimated audience size:{" "}
      <span className="font-semibold">{estimatedSize}</span>
    </p>
  );
}

export default AudienceSizeEstimator;
