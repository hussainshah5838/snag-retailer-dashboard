import React from "react";
import DataTable from "../../../shared/components/DataTable";

function AudienceSegmentTable({ data, onEdit, onDelete, onView }) {
  const columns = [
    { key: "name", label: "Segment" },
    { key: "description", label: "Description" },
    {
      key: "ageRange",
      label: "Age",
      render: (row) => {
        const f = row.filters || {};
        const min = f.minAge ?? "-";
        const max = f.maxAge ?? "-";
        return `${min} - ${max}`;
      },
    },
    {
      key: "gender",
      label: "Gender",
      render: (row) => row.filters?.gender || "Any",
    },
    {
      key: "interests",
      label: "Interests",
      render: (row) =>
        row.filters?.interests ? String(row.filters.interests) : "-",
    },
    {
      key: "maxDistanceKm",
      label: "Max Dist (km)",
      render: (row) => row.filters?.maxDistanceKm ?? "-",
    },
    {
      key: "behaviorTags",
      label: "Behavior Tags",
      render: (row) =>
        row.filters?.behaviorTags ? String(row.filters.behaviorTags) : "-",
    },
    // Estimated Size column removed per request
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={onView}
      actions={[
        { label: "Edit", onClick: onEdit },
        { label: "Delete", onClick: onDelete },
      ]}
    />
  );
}

export default AudienceSegmentTable;
