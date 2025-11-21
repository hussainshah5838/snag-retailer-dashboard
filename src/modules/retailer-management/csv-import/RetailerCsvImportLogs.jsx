import React, { useEffect, useState } from "react";
import Loading from "../../../components/Loading";
import DataTable from "../../../shared/components/DataTable";
import Pagination from "../../../shared/components/Pagination";
import CsvImportStatusBadge from "../components/CsvImportStatusBadge";
import { fetchRetailerCsvImports } from "../api/retailerCsv.service";

function RetailerCsvImportLogs() {
  const [data, setData] = useState({ items: [], total: 0 });
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchRetailerCsvImports(
          { page, limit },
          controller.signal
        );
        setData({ items: res.items || [], total: res.total || 0 });
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setError("Failed to load CSV imports.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [page, limit]);

  const columns = [
    { key: "id", label: "ID" },
    { key: "fileName", label: "File" },
    {
      key: "status",
      label: "Status",
      render: (row) => <CsvImportStatusBadge status={row.status} />,
    },
    { key: "createdAt", label: "Uploaded At" },
    { key: "processedAt", label: "Processed At" },
  ];

  return (
    <div>
      <h2 className="text-sm font-semibold mb-3">CSV Import Logs</h2>
      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : (
        <>
          <DataTable columns={columns} data={data.items} />
          <div className="mt-3">
            <Pagination
              page={page}
              pageSize={limit}
              total={data.total}
              onChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default RetailerCsvImportLogs;
