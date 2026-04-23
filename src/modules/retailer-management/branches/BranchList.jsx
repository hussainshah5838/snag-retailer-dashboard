import React, { useEffect, useState } from "react";
import DataTable from "../../../shared/components/DataTable";
import Pagination from "../../../shared/components/Pagination";
import Loading from "../../../components/Loading";
import SearchBar from "../../../shared/components/SearchBar";
import BranchForm from "./BranchForm";
import {
  fetchBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../api/branches.service";

function BranchList() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState({ items: [], total: 0 });
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editBranch, setEditBranch] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchBranches(
          { page, limit, search: search || undefined },
          controller.signal
        );
        setData({ items: res.items || [], total: res.total || 0 });
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError")
          setError("Failed to load branches.");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [page, limit, search]);

  function handleCreate() {
    setEditBranch(null);
    setIsFormOpen(true);
  }

  function handleEdit(row) {
    setEditBranch(row);
    setIsFormOpen(true);
  }

  async function handleSave(form) {
    try {
      if (editBranch) {
        const updated = await updateBranch(editBranch.id, form);
        setData((prev) => ({
          ...prev,
          items: prev.items.map((it) => (it.id === updated.id ? updated : it)),
        }));
      } else {
        const created = await createBranch(form);
        setData((prev) => ({
          items: [created, ...(prev.items || [])].slice(0, limit),
          total: (prev.total || 0) + 1,
        }));
      }
      setPage(1);
    } catch (err) {
      console.error("Failed to save branch:", err);
      setError(err?.response?.data?.error?.message || "Failed to save branch.");
    }
  }

  async function handleDelete(row) {
    if (!window.confirm("Are you sure you want to delete this branch?")) return;
    try {
      await deleteBranch(row.id);
      setData((prev) => ({
        ...prev,
        items: prev.items.filter((it) => it.id !== row.id),
        total: Math.max(0, (prev.total || 0) - 1),
      }));
    } catch (err) {
      console.error("Failed to delete branch:", err);
      setError("Failed to delete branch.");
    }
  }

  const columns = [
    { key: "branchName", label: "Branch Name" },
    { key: "merchantName", label: "Merchant" },
    { key: "branchAddress", label: "Address" },
    { key: "industry", label: "Industry" },
    { key: "phoneNumber", label: "Phone" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold">Branches</h2>
        <button
          onClick={handleCreate}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md"
        >
          Add Branch
        </button>
      </div>

      <div className="mb-4">
        <SearchBar
          placeholder="Search by branch name or address..."
          value={search}
          onChange={(val) => { setSearch(val); setPage(1); }}
        />
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data.items}
            actions={[
              { label: "Edit", onClick: handleEdit },
              { label: "Delete", onClick: handleDelete },
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

      <BranchForm
        initialValue={editBranch}
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

export default BranchList;