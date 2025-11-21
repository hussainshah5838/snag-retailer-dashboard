import React from "react";
import Badge from "../../../shared/components/Badge";

function CsvImportStatusBadge({ status }) {
  const normalized = (status || "").toLowerCase();

  let variant = "default";
  if (normalized === "completed") variant = "success";
  else if (normalized === "failed") variant = "danger";
  else if (normalized === "processing") variant = "warning";

  return <Badge variant={variant}>{status}</Badge>;
}

export default CsvImportStatusBadge;
