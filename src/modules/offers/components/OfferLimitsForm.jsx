import React from "react";

function OfferScheduleForm({ value, onChange }) {
  function handleChange(e) {
    const { name, value: v } = e.target;
    onChange({ ...value, [name]: v });
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium mb-1">Start Date</label>
          <input
            type="datetime-local"
            name="startAt"
            value={value.startAt || ""}
            onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">End Date</label>
          <input
            type="datetime-local"
            name="endAt"
            value={value.endAt || ""}
            onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <label className="block text-xs font-medium mb-1">
            Time of Day From
          </label>
          <input
            type="time"
            name="timeFrom"
            value={value.timeFrom || ""}
            onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">
            Time of Day To
          </label>
          <input
            type="time"
            name="timeTo"
            value={value.timeTo || ""}
            onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">
            Target Radius (km)
          </label>
          <input
            type="number"
            name="radiusKm"
            min="0"
            value={value.radiusKm || ""}
            onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default OfferScheduleForm;
