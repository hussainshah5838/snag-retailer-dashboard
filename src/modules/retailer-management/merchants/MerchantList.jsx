import React, { useEffect, useState } from "react";
import DataTable from "../../../shared/components/DataTable";
import Pagination from "../../../shared/components/Pagination";
import Loading from "../../../components/Loading";
import MerchantStatusBadge from "../components/MerchantStatusBadge";
import MerchantSearchFilters from "../components/MerchantSearchFilters";
import MerchantForm from "./MerchantForm";
import {
  fetchMerchants,
  createMerchant,
  updateMerchant,
  deactivateMerchant,
  activateMerchant,
} from "../api/merchants.service";

function MerchantList({ onSelectMerchant }) {
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [data, setData] = useState({ items: [], total: 0 });
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMerchant, setEditMerchant] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetchMerchants(
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
          setError("Failed to load merchants.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [filters, page, limit]);

  function handleCreate() {
    setEditMerchant(null);
    setIsFormOpen(true);
  }

  function handleEdit(row) {
    setEditMerchant(row);
    setIsFormOpen(true);
  }

  async function handleSave(form) {
    try {
      if (editMerchant) {
        const updated = await updateMerchant(editMerchant.id, form);
        // update local list immediately
        setData((prev) => ({
          ...prev,
          items: prev.items.map((it) => (it.id === updated.id ? updated : it)),
        }));
      } else {
        const created = await createMerchant(form);
        // prepend created and update total
        setData((prev) => ({
          items: [created, ...(prev.items || [])].slice(0, limit),
          total: (prev.total || 0) + 1,
        }));
      }
      // ensure pagination resets to first page
      setPage(1);
    } catch (err) {
      console.error("Failed to save merchant:", err);
      setError("Failed to save merchant.");
      // don't re-throw so the form can handle the error gracefully
    }
  }

  async function handleToggleStatus(row) {
    const isActive = row.status === "active";
    const action = isActive ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} this merchant?`))
      return;
    try {
      const updated = isActive
        ? await deactivateMerchant(row.id)
        : await activateMerchant(row.id);
      setData((prev) => ({
        ...prev,
        items: prev.items.map((it) => (it.id === updated.id ? updated : it)),
      }));
    } catch (err) {
      console.error(`Failed to ${action} merchant:`, err);
      setError(`Failed to ${action} merchant.`);
    }
  }

  const columns = [
    { 
      key: "name", 
      label: "Name",
      render: (row) => `${row.firstName} ${row.lastName}`.trim()
    },
    { key: "phoneNumber", label: "Phone" },
    { key: "email", label: "Email" },
    {
      key: "status",
      label: "Status",
      render: (row) => <MerchantStatusBadge status={row.status} />,
    },
    {
      key: "branchName",
      label: "Branch",
      render: (row) => row.branchName || "No Branch"
    },
    {
      key: "industry",
      label: "Industry",
      render: (row) => row.industry || "N/A"
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold">Merchants</h2>
        <button
          onClick={handleCreate}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md"
        >
          Add Merchant
        </button>
      </div>

      <MerchantSearchFilters filters={filters} onChange={setFilters} />

      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data.items}
            onRowClick={onSelectMerchant}
            actions={[
              {
                label: "Edit",
                onClick: handleEdit,
              },
              {
                label: (row) => row.status === "active" ? "Deactivate" : "Activate",
                onClick: handleToggleStatus,
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

      <MerchantForm
        initialValue={editMerchant}
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

export default MerchantList;
