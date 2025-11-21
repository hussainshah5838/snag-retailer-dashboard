import React from "react";
import SegmentList from "./segments/SegmentList";

function AudienceTargeting() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-base font-semibold">Audience Targeting</h1>
      <SegmentList />
    </div>
  );
}

export default AudienceTargeting;
