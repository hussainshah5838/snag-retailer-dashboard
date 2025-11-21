import React from "react";

function AudienceFilterBuilder({ value, onChange }) {
  function handleChange(e) {
    const { name, value: v } = e.target;
    onChange({ ...value, [name]: v });
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <label className="block text-xs font-medium mb-1">Min Age</label>
          <input
            type="number"
            min="0"
            name="minAge"
            value={value.minAge || ""}
            onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Max Age</label>
          <input
            type="number"
            min="0"
            name="maxAge"
            value={value.maxAge || ""}
            onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Gender</label>
          <select
            name="gender"
            value={value.gender || ""}
            onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full"
          >
            <option value="">Any</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">
          Interests (comma separated)
        </label>
        <input
          name="interests"
          value={value.interests || ""}
          onChange={handleChange}
          placeholder="e.g. food, fashion, electronics"
          className="border rounded-md px-2 py-1 text-sm w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium mb-1">
            Max Distance (km)
          </label>
          <input
            type="number"
            min="0"
            name="maxDistanceKm"
            value={value.maxDistanceKm || ""}
            onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">
            Behavior Tags (comma separated)
          </label>
          <input
            name="behaviorTags"
            value={value.behaviorTags || ""}
            onChange={handleChange}
            placeholder="e.g. high_spender,inactive,frequent_visitor"
            className="border rounded-md px-2 py-1 text-sm w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default AudienceFilterBuilder;
