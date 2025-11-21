import React from "react";
import DataTable from "../../../shared/components/DataTable";

function PromotionRuleTable({ data, onEdit, onDelete }) {
  const columns = [
    { key: "name", label: "Name" },
    { key: "scope", label: "Scope" },
    { key: "retailerId", label: "Retailer ID" },
    { key: "maxLiveOffersPerStore", label: "Max Live/Store" },
    { key: "maxDurationDays", label: "Max Duration (days)" },
    {
      key: "allowOpenEnded",
      label: "Open Ended?",
      render: (row) => (row.allowOpenEnded ? "Yes" : "No"),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      actions={[
        { label: "Edit", onClick: onEdit },
        { label: "Delete", onClick: onDelete },
      ]}
    />
  );
}

export default PromotionRuleTable;
