import React, { useEffect, useState } from "react";
import DataTable from "../../../shared/components/DataTable";
import Pagination from "../../../shared/components/Pagination";
import Loading from "../../../components/Loading";
import RetailerStatusBadge from "../components/RetailerStatusBadge";
import TermsAcceptanceBadge from "../components/TermsAcceptanceBadge";
import RetailerSearchFilters from "../components/RetailerSearchFilters";
import RetailerForm from "./RetailerForm";
import {
  fetchRetailers,
  createRetailer,
  updateRetailer,
  softDeleteRetailer,
} from "../api/retailers.service";

function RetailerList({ onSelectRetailer }) {
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [data, setData] = useState({ items: [], total: 0 });
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editRetailer, setEditRetailer] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetchRetailers(
          {
            search: filters.search || undefined,
            status: filters.status || undefined,
            page,
            limit,
          },
          controller.signal
        );

        setData({ items: res.items || [], total: res.total || 0 });
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setError("Failed to load retailers.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [filters, page, limit]);

  function handleCreate() {
    setEditRetailer(null);
    setIsFormOpen(true);
  }

  function handleEdit(row) {
    setEditRetailer(row);
    setIsFormOpen(true);
  }

  async function handleSave(form) {
    try {
      if (editRetailer) {
        const updated = await updateRetailer(editRetailer.id, form);
        // update local list immediately
        setData((prev) => ({
          ...prev,
          items: prev.items.map((it) => (it.id === updated.id ? updated : it)),
        }));
      } else {
        const created = await createRetailer(form);
        // prepend created and update total
        setData((prev) => ({
          items: [created, ...(prev.items || [])].slice(0, limit),
          total: (prev.total || 0) + 1,
        }));
      }
      // ensure pagination resets to first page
      setPage(1);
    } catch (err) {
      console.error("Failed to save retailer:", err);
      setError("Failed to save retailer.");
      // don't re-throw so the form can handle the error gracefully
    }
  }

  async function handleDelete(row) {
    if (!window.confirm("Are you sure you want to deactivate this retailer?"))
      return;
    try {
      await softDeleteRetailer(row.id);
      // Update local list immediately so UI reflects deactivated status
      setData((prev) => ({
        ...prev,
        items: (prev.items || []).map((it) =>
          it.id === row.id ? { ...it, status: "inactive" } : it
        ),
      }));
      // If caller wants a full reload they can change page; otherwise local update is enough
    } catch (err) {
      console.error("Failed to deactivate retailer:", err);
      setError("Failed to deactivate retailer.");
    }
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "contactNumber", label: "Contact" },
    { key: "email", label: "Email" },
    {
      key: "status",
      label: "Status",
      render: (row) => <RetailerStatusBadge status={row.status} />,
    },
    {
      key: "termsAccepted",
      label: "T&C",
      render: (row) => (
        <TermsAcceptanceBadge
          accepted={row.termsAccepted}
          version={row.termsVersion}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold">Retailers</h2>
        <button
          onClick={handleCreate}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md"
        >
          Add Retailer
        </button>
      </div>

      <RetailerSearchFilters filters={filters} onChange={setFilters} />

      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data.items}
            onRowClick={onSelectRetailer}
            actions={[
              {
                label: "Edit",
                onClick: handleEdit,
              },
              {
                label: "Deactivate",
                onClick: handleDelete,
              },
            ]}
          />
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

      <RetailerForm
        initialValue={editRetailer}
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

export default RetailerList;
