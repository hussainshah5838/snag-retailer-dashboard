import React from "react";
import DataTable from "../../../shared/components/DataTable";
import Badge from "../../../shared/components/Badge";

function statusBadge(status) {
  const s = (status || "").toLowerCase();
  let variant = "default";
  if (s === "live") variant = "success";
  else if (s === "scheduled") variant = "info";
  else if (s === "paused") variant = "warning";
  else if (s === "expired" || s === "cancelled") variant = "danger";
  return <Badge variant={variant}>{status}</Badge>;
}

function OfferListTable({ data, onEdit, onDelete, onView, onStatusChange }) {
  const columns = [
    { key: "name", label: "Offer" },
    { key: "retailerName", label: "Retailer" },
    {
      key: "status",
      label: "Status",
      render: (row) => statusBadge(row.status),
    },
    { key: "startAt", label: "Start" },
    { key: "endAt", label: "End" },
    { key: "templateName", label: "Template" },
    {
      key: "discount",
      label: "Discount",
      render: (row) =>
        row.discountType === "amount"
          ? `$${row.discountValue}`
          : `${row.discountValue}%`,
    },
    { key: "radiusKm", label: "Radius (km)" },
    { key: "maxRedemptions", label: "Max Redemptions" },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={onView}
      actions={[
        { label: "Edit", onClick: onEdit },
        { label: "Delete", onClick: onDelete },
        onStatusChange
          ? {
              label: "Status",
              render: (row) => (
                <select
                  value={row.status || ""}
                  onChange={(e) => onStatusChange(row, e.target.value)}
                  className="text-xs bg-transparent border rounded px-2 py-1"
                >
                  <option value="">-</option>
                  <option value="live">Live</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="paused">Paused</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              ),
            }
          : null,
      ].filter(Boolean)}
    />
  );
}

export default OfferListTable;
