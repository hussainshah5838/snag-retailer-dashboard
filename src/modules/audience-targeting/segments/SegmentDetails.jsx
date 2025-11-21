import React from "react";

function SegmentDetails({ segment }) {
  if (!segment) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-xs text-gray-500">No segment selected.</p>
      </div>
    );
  }

  const filters = segment.filters || {};

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm space-y-3 text-xs">
      <div>
        <h2 className="text-sm font-semibold">{segment.name}</h2>
        <p className="text-gray-600">{segment.description}</p>
      </div>

      <div>
        <p className="font-medium mb-1">Filters</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <p className="text-gray-500">Age</p>
            <p className="text-gray-700">
              {filters.minAge || "-"} → {filters.maxAge || "-"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Gender</p>
            <p className="text-gray-700">{filters.gender || "Any"}</p>
          </div>
          <div>
            <p className="text-gray-500">Interests</p>
            <p className="text-gray-700">{filters.interests || "Any"}</p>
          </div>
          <div>
            <p className="text-gray-500">Max Distance (km)</p>
            <p className="text-gray-700">
              {filters.maxDistanceKm || "Default"}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-500">Behavior Tags</p>
            <p className="text-gray-700">{filters.behaviorTags || "Any"}</p>
          </div>
        </div>
      </div>

      {segment.estimatedSize != null && (
        <div>
          <p className="font-medium mb-1">Estimated Size</p>
          <p className="text-gray-700 font-semibold">{segment.estimatedSize}</p>
        </div>
      )}
    </div>
  );
}

export default SegmentDetails;
