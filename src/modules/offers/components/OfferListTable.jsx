import React from "react";
import DataTable from "../../../shared/components/DataTable";
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
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString();
}

function OfferListTable({ data, onEdit, onDelete, onView, onStatusChange }) {
  const columns = [
    { key: "title",        label: "Offer",       render: (row) => row.title },
    { key: "merchantName", label: "Merchant",    render: (row) => row.merchantName },
    { key: "status",       label: "Status",      render: (row) => statusBadge(row.status) },
    { key: "offerType",    label: "Type",        render: (row) => row.offerType },
    { key: "startDate",    label: "Start",       render: (row) => fmt(row.startDate) },
    { key: "endDate",      label: "End",         render: (row) => fmt(row.endDate) },
    { key: "discountType", label: "Discount",    render: (row) => row.discountType || "-" },
    { key: "couponCode",   label: "Coupon",      render: (row) => row.couponCode || "-" },
    { key: "redemptions",  label: "Redemptions", render: (row) => row.stats?.redemptions ?? 0 },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={onView}
      actions={[
        { label: "Edit",   onClick: onEdit },
        { label: "Delete", onClick: onDelete },
        onStatusChange
          ? {
              label: "Status",
              render: (row) => (
                <select
                  value={row.status || ""}
                  onChange={(e) => onStatusChange(row, e.target.value)}
                  className="text-xs bg-transparent border rounded px-2 py-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="draft">Draft</option>
                  <option value="expired">Expired</option>
                </select>
              ),
            }
          : null,
      ].filter(Boolean)}
    />
  );
}

export default OfferListTable;
