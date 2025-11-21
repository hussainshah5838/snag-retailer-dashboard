import React from "react";
import { downloadInvoicePdf } from "../api/invoices.service";

function InvoiceDetails({ invoice }) {
  if (!invoice) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-xs text-gray-500">Select an invoice.</p>
      </div>
    );
  }

  async function handleDownload() {
    try {
      const blob = await downloadInvoicePdf(invoice.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoice.number}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download invoice.");
    }
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm text-xs space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm font-semibold">Invoice #{invoice.number}</h2>
          <p className="text-gray-500">{invoice.period}</p>
        </div>
        <button
          onClick={handleDownload}
          className="px-3 py-1 text-xs bg-gray-800 text-white rounded-md"
        >
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <p className="font-medium">Amount</p>
          <p className="text-gray-700">
            {invoice.amountFormatted || invoice.amount}
          </p>
        </div>
        <div>
          <p className="font-medium">Status</p>
          <p className="text-gray-700">{invoice.status}</p>
        </div>
        <div>
          <p className="font-medium">Created</p>
          <p className="text-gray-700">{invoice.createdAt}</p>
        </div>
        <div>
          <p className="font-medium">Due Date</p>
          <p className="text-gray-700">{invoice.dueAt || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetails;
