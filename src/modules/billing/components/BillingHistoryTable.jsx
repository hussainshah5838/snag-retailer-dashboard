import React from "react";
import DataTable from "../../../shared/components/DataTable";

function BillingHistoryTable({ invoices, onSelect }) {
  const columns = [
    { key: "number", label: "Invoice #" },
    { key: "period", label: "Period" },
    { key: "amountFormatted", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created" },
  ];

  return <DataTable columns={columns} data={invoices} onRowClick={onSelect} />;
}

export default BillingHistoryTable;
