import React, { useEffect, useState } from "react";
import Loading from "../../../components/Loading";
import {
  fetchLiveOfferConstraint,
  updateLiveOfferConstraint,
} from "../api/promotionLimits.service";

function LiveOfferConstraintSettings() {
  const [config, setConfig] = useState({
    enforceSingleLiveOffer: true,
    resolutionStrategy: "block",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchLiveOfferConstraint(controller.signal);
        if (res) {
          setConfig((prev) => ({
            enforceSingleLiveOffer:
              res.enforceSingleLiveOffer ?? prev.enforceSingleLiveOffer,
            resolutionStrategy:
              res.resolutionStrategy || prev.resolutionStrategy,
          }));
        }
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setError("Failed to load live offer constraint.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);
      await updateLiveOfferConstraint(config);
      alert("Live offer constraint updated.");
    } catch {
      setError("Failed to save configuration.");
    } finally {
      setSaving(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <Loading />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm space-y-3 text-xs">
      <h2 className="text-sm font-semibold mb-2">
        One Live Offer Per Location
      </h2>
      {error && <p className="text-xs text-red-500 mb-1">{error}</p>}
      <div className="flex items-center gap-2">
        <input
          id="enforceSingleLiveOffer"
          type="checkbox"
          name="enforceSingleLiveOffer"
          checked={config.enforceSingleLiveOffer}
          onChange={handleChange}
        />
        <label
          htmlFor="enforceSingleLiveOffer"
          className="cursor-pointer text-gray-700"
        >
          Enforce that each store has only one live offer at a time
        </label>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">
          If conflict occurs when activating a new offer
        </label>
        <select
          name="resolutionStrategy"
          value={config.resolutionStrategy}
          onChange={handleChange}
          className="border rounded-md px-2 py-1 text-sm w-full"
        >
          <option value="block">
            Block activation and show conflict error
          </option>
          <option value="auto_pause_existing">
            Auto-pause existing live offer and activate new one
          </option>
        </select>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}

export default LiveOfferConstraintSettings;
