import React from "react";
import Badge from "../../../shared/components/Badge";

function MerchantStatusBadge({ status }) {
  const normalized = (status || "").toLowerCase();

  let variant = "default";
  if (normalized === "active") variant = "success";
  else if (normalized === "pending") variant = "warning";
  else if (normalized === "disabled" || normalized === "inactive")
    variant = "danger";

  return <Badge variant={variant}>{status}</Badge>;
}

export default MerchantStatusBadge;