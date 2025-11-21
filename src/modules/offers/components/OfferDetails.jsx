import React from "react";
import Badge from "../../../shared/components/Badge";

function OfferDetails({ offer }) {
  if (!offer) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-xs text-gray-500">No offer selected.</p>
      </div>
    );
  }

  const s = (offer.status || "").toLowerCase();
  let variant = "default";
  if (s === "live") variant = "success";
  else if (s === "scheduled") variant = "info";
  else if (s === "paused") variant = "warning";
  else if (s === "expired" || s === "cancelled") variant = "danger";

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm space-y-3 text-xs">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-semibold">{offer.name}</h2>
          <p className="text-gray-500">{offer.retailerName}</p>
        </div>
        <Badge variant={variant}>{offer.status}</Badge>
      </div>

      <div>
        <p className="font-medium mb-1">Description</p>
        <p className="text-gray-600 whitespace-pre-line">
          {offer.description || "No description"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <p className="font-medium">Template</p>
          <p className="text-gray-600">{offer.templateName || "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Discount</p>
          <p className="text-gray-600">
            {offer.discountType === "percent"
              ? `${offer.discountValue ?? "-"}%`
              : offer.discountValue ?? "-"}
          </p>
        </div>
        <div>
          <p className="font-medium">Schedule</p>
          <p className="text-gray-600">
            {offer.startAt || "?"} → {offer.endAt || "?"}
          </p>
        </div>
        <div>
          <p className="font-medium">Time of Day</p>
          <p className="text-gray-600">
            {offer.timeFrom || "All day"} → {offer.timeTo || "All day"}
          </p>
        </div>
        <div>
          <p className="font-medium">Radius (km)</p>
          <p className="text-gray-600">{offer.radiusKm ?? "Default"}</p>
        </div>
        <div>
          <p className="font-medium">Limits</p>
          <p className="text-gray-600">
            Max {offer.maxRedemptions ?? "-"} total, {offer.maxPerUser ?? "-"}{" "}
            per user, min spend {offer.minSpend ?? "-"}
          </p>
        </div>
      </div>

      {offer.imageUrl && (
        <div>
          <p className="font-medium mb-1">Image</p>
          <div className="border rounded-md p-2 w-40 h-40 flex items-center justify-center">
            <img
              src={offer.imageUrl}
              alt={offer.name}
              className="object-contain max-h-full max-w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default OfferDetails;
