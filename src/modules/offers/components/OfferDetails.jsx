import React from "react";
import Badge from "../../../shared/components/Badge";

function statusBadge(status) {
  const s = (status || "").toLowerCase();
  let variant = "default";
  if (s === "active")         variant = "success";
  else if (s === "scheduled") variant = "info";
  else if (s === "draft")     variant = "warning";
  else if (s === "expired")   variant = "danger";
  return <Badge variant={variant}>{status}</Badge>;
}

function fmt(dateStr) {
  if (!dateStr) return "?";
  return new Date(dateStr).toLocaleDateString();
}

function Row({ label, value }) {
  return (
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-gray-400">{value ?? "-"}</p>
    </div>
  );
}

function OfferDetails({ offer }) {
  if (!offer) {
    return (
      <div className="rounded-xl p-4 shadow-sm text-xs"
        style={{ background: "var(--card)", borderColor: "var(--line)", borderWidth: 1 }}>
        <p className="text-gray-500">No offer selected.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-4 shadow-sm space-y-3 text-xs"
      style={{ background: "var(--card)", borderColor: "var(--line)", borderWidth: 1 }}>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-semibold text-gray-100">{offer.title}</h2>
          <p className="text-gray-400">{offer.merchantName}</p>
          <p className="text-gray-500">{offer.merchantEmail}</p>
        </div>
        {statusBadge(offer.status)}
      </div>

      {/* Banner */}
      {offer.bannerUrl && (
        <img
          src={offer.bannerUrl}
          alt={offer.title}
          className="w-full h-32 object-cover rounded-md"
        />
      )}

      {/* Description */}
      <div>
        <p className="font-medium">Description</p>
        <p className="text-gray-400 whitespace-pre-line">{offer.description || "No description"}</p>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-3">
        <Row label="Offer Type"       value={offer.offerType} />
        <Row label="Discount Type"    value={offer.discountType} />
        <Row label="Coupon Code"      value={offer.couponCode} />
        <Row label="Redemption Limit" value={offer.redemptionLimit} />
        <Row label="Start Date"       value={fmt(offer.startDate)} />
        <Row label="End Date"         value={fmt(offer.endDate)} />
        <Row label="Views"            value={offer.stats?.views ?? 0} />
        <Row label="Clicks"           value={offer.stats?.clicks ?? 0} />
        <Row label="Redemptions"      value={offer.stats?.redemptions ?? 0} />
      </div>

      {/* Categories */}
      {offer.categories?.length > 0 && (
        <div>
          <p className="font-medium mb-1">Categories</p>
          <div className="flex flex-wrap gap-1">
            {offer.categories.map((c) => (
              <span key={c} className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded-full text-[10px]">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Terms */}
      <div>
        <p className="font-medium">Terms & Conditions</p>
        <p className="text-gray-400 whitespace-pre-line">{offer.termsAndConditions}</p>
      </div>
    </div>
  );
}

export default OfferDetails;
