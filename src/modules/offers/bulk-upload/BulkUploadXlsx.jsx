import React, { useState } from "react";
import { createOffer } from "../api/offers.service";
import * as XLSX from "xlsx";

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length === 0) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = cols[i] || "";
    });
    return obj;
  });
  return rows;
}

function parseXLSX(arrayBuffer) {
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  return json;
}

export default function BulkUploadXlsx() {
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  function handleFile(e) {
    setError(null);
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const name = (file.name || "").toLowerCase();
    const isExcel = name.endsWith(".xlsx") || name.endsWith(".xls");
    const isCSV = name.endsWith(".csv");

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        if (isExcel) {
          const arr = ev.target.result;
          const rows = parseXLSX(arr);
          setPreview(rows);
        } else if (isCSV) {
          const text = ev.target.result;
          const rows = parseCSV(text);
          setPreview(rows);
        } else {
          setError("Unsupported file type. Use CSV or XLSX.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to parse file");
      }
    };

    if (isExcel) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  }

  async function handleUpload() {
    if (preview.length === 0) return;
    setUploading(true);
    try {
      for (const row of preview) {
        const payload = {
          name: row.name || row.Name || "Untitled",
          description: row.description || row.Description || "",
          retailerName: row.retailerName || row.RetailerName || "Demo Retailer",
          status: row.status || row.Status || "scheduled",
          startAt:
            row.startAt || row.StartAt || new Date().toISOString().slice(0, 10),
          endAt: row.endAt || row.EndAt || "",
          templateId: row.templateId || row.TemplateId || "tpl-percent",
          templateName: row.templateName || row.TemplateName || "Percent Off",
          discountType: row.discountType || row.DiscountType || "percent",
          discountValue: row.discountValue || row.DiscountValue || 0,
        };
        await createOffer(payload);
      }
      alert(`Uploaded ${preview.length} offers.`);
      setPreview([]);
    } catch (err) {
      console.error(err);
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-base font-semibold">Bulk Upload Offers</h1>
      <p className="text-sm text-gray-400">
        Upload a CSV or Excel file with columns: name, description,
        retailerName, status, startAt, endAt, templateId, templateName,
        discountType, discountValue
      </p>

      <div className="space-y-2">
        <input
          type="file"
          accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          onChange={handleFile}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {preview.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold">Preview ({preview.length})</h2>
          <div className="overflow-auto max-h-64 border rounded-md mt-2">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(preview[0]).map((h) => (
                    <th key={h} className="px-2 py-1 text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((r, idx) => (
                  <tr key={idx} className="border-t">
                    {Object.keys(preview[0]).map((h) => (
                      <td key={h} className="px-2 py-1">
                        {String(r[h] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-3 py-1 bg-blue-600 text-white rounded-md"
            >
              {uploading ? "Uploading…" : "Upload"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
