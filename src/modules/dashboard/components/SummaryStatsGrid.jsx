import React from "react";
import StatsCard from "../../../shared/charts/StatsCard";

function SummaryStatsGrid({ summary }) {
  if (!summary) return null;

  const {
    totalMerchants = 0,
    activeBranches = 0,
    liveOffers = 0,
    totalViews = 0,
    totalRedemptions = 0,
  } = summary;

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3 xl:grid-cols-5">
      <StatsCard title="Total Merchants" value={totalMerchants} />
      <StatsCard title="Active Branches" value={activeBranches} />
      <StatsCard title="Live Offers" value={liveOffers} />
      <StatsCard title="Total Views" value={totalViews} />
      <StatsCard title="Total Redemptions" value={totalRedemptions} />
    </div>
  );
}

export default SummaryStatsGrid;
