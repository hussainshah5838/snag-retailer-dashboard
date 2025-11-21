import React from "react";
import Badge from "../../../shared/components/Badge";

function TermsAcceptanceBadge({ accepted, version }) {
  if (!accepted) {
    return <Badge variant="warning">T&C Not Accepted</Badge>;
  }

  return (
    <Badge variant="success">
      T&C Accepted{version ? ` (v${version})` : ""}
    </Badge>
  );
}

export default TermsAcceptanceBadge;
