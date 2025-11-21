import React, { useEffect, useRef } from "react";

/**
 * This is a thin wrapper so you can later plug Google Maps JS SDK.
 * For now, it just shows a placeholder box and calls onChange with lat/lng.
 */
function StoreMapPicker({ onChange }) {
  const _ref = useRef(null);

  useEffect(() => {
    // Integrate Google Maps here when ready.
    // For now, this is a stub that notifies parent with a placeholder coordinate.
    if (typeof onChange === "function") {
      // send a default placeholder coordinate (latitude, longitude)
      onChange({ lat: 0, lng: 0 });
    }
  }, [onChange]);

  return (
    <div className="border rounded-md h-48 flex items-center justify-center text-xs text-gray-500">
      Map picker placeholder (integrate Google Maps here)
    </div>
  );
}

export default StoreMapPicker;
