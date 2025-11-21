import React, { useEffect, useState } from "react";
import DataTable from "../../../shared/components/DataTable";
import Pagination from "../../../shared/components/Pagination";
import Loading from "../../../components/Loading";
import StoreForm from "./StoreForm";
import {
  fetchStores,
  createStore,
  updateStore,
  softDeleteStore,
} from "../api/stores.service";

function StoreList() {
  const [data, setData] = useState({ items: [], total: 0 });
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editStore, setEditStore] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetchStores({ page, limit }, controller.signal);
        setData({ items: res.items || [], total: res.total || 0 });
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setError("Failed to load stores.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [page, limit]);

  function handleCreate() {
    setEditStore(null);
    setIsFormOpen(true);
  }

  function handleEdit(row) {
    setEditStore(row);
    setIsFormOpen(true);
  }

  async function handleSave(form) {
    try {
      if (editStore) {
        const updated = await updateStore(editStore.id, form);
        setData((prev) => ({
          ...prev,
          items: (prev.items || []).map((it) =>
            it.id === updated.id ? updated : it
          ),
        }));
      } else {
        const created = await createStore(form);
        setData((prev) => ({
          items: [created, ...(prev.items || [])].slice(0, limit),
          total: (prev.total || 0) + 1,
        }));
      }
      setPage(1);
    } catch (err) {
      console.error("Failed to save store:", err);
      setError("Failed to save store.");
      // don't re-throw to allow the form to close gracefully and show the error
    }
  }

  async function handleDelete(row) {
    if (!window.confirm("Are you sure you want to deactivate this store?"))
      return;
    try {
      await softDeleteStore(row.id);
      setData((prev) => ({
        ...prev,
        items: (prev.items || []).filter((it) => it.id !== row.id),
        total: Math.max(0, (prev.total || 0) - 1),
      }));
    } catch (err) {
      console.error("Failed to deactivate store:", err);
      setError("Failed to deactivate store.");
    }
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "address", label: "Address" },
    { key: "storeNumber", label: "Store #" },
    { key: "appStoreId", label: "App Store ID" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold">Stores</h2>
        <button
          onClick={handleCreate}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md"
        >
          Add Store
        </button>
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
              { label: "Deactivate", onClick: handleDelete },
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

      <StoreForm
        initialValue={editStore}
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

export default StoreList;
