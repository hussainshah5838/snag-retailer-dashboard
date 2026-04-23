import React from "react";
import DataTable from "../../../shared/components/DataTable";

const SAMPLE_OFFERS = [
  {
    id: "o_1",
    name: "50% off Coffee",
    retailerName: "Joe's Diner",
    views: 2400,
    redemptions: 120,
    ctr: 5.0,
  },
  {
    id: "o_2",
    name: "Buy 1 Get 1 Pizza",
    retailerName: "Tony's Pizzeria",
    views: 1800,
    redemptions: 98,
    ctr: 5.4,
  },
  {
    id: "o_3",
    name: "20% off Electronics",
    retailerName: "ElectroMart",
    views: 1500,
    redemptions: 74,
    ctr: 4.9,
  },
];

function TopOffersTable({ offers }) {
  // Don't show sample data if offers is empty/null - show loading instead
  if (!offers || offers.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-3 text-gray-100">Top Offers</h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-400 text-sm">Loading offers...</div>
        </div>
      </div>
    );
  }
  
  // Transform backend data to match table structure
  const transformedOffers = offers.map(offer => ({
    id: offer.id,
    name: offer.title || offer.name,
    retailerName: offer.merchantName || offer.retailerName || "Unknown Merchant",
    views: offer.views || 0,
    redemptions: offer.redemptions || 0,
    ctr: offer.ctr || (offer.views > 0 ? ((offer.redemptions / offer.views) * 100).toFixed(1) : 0),
  }));

  const columns = [
    { key: "name", label: "Offer" },
    { key: "retailerName", label: "Merchant" },
    { key: "views", label: "Views" },
    { key: "redemptions", label: "Redemptions" },
    { key: "ctr", label: "CTR %" },
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold mb-3 text-gray-100">Top Offers</h3>
      <DataTable columns={columns} data={transformedOffers} />
    </div>
  );
}

export default TopOffersTable;
