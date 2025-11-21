import React, { useEffect, useState } from "react";
import DataTable from "../../../shared/components/DataTable";
import Pagination from "../../../shared/components/Pagination";
import Loading from "../../../components/Loading";
import TemplateForm from "./TemplateForm";
import {
  fetchOfferTemplates,
  createOfferTemplate,
  updateOfferTemplate,
  deleteOfferTemplate,
} from "../api/offerTemplates.service";

function TemplateList() {
  const [data, setData] = useState({ items: [], total: 0 });
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editTemplate, setEditTemplate] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchOfferTemplates(
          { page, limit },
          controller.signal
        );
        setData({ items: res.items || [], total: res.total || 0 });
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setError("Failed to load templates.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [page, limit]);

  function handleCreate() {
    setEditTemplate(null);
    setIsFormOpen(true);
  }

  function handleEdit(row) {
    setEditTemplate(row);
    setIsFormOpen(true);
  }

  async function handleSave(form) {
    try {
      if (editTemplate) {
        const updated = await updateOfferTemplate(editTemplate.id, form);
        setData((prev) => ({
          ...prev,
          items: (prev.items || []).map((it) =>
            it.id === updated.id ? updated : it
          ),
        }));
      } else {
        const created = await createOfferTemplate(form);
        setData((prev) => ({
          items: [created, ...(prev.items || [])].slice(0, limit),
          total: (prev.total || 0) + 1,
        }));
      }
      setPage(1);
    } catch (err) {
      console.error("Failed to save template:", err);
      setError("Failed to save template.");
    }
  }

  async function handleDelete(row) {
    if (!window.confirm("Delete this template?")) return;
    try {
      await deleteOfferTemplate(row.id);
      setData((prev) => ({
        ...prev,
        items: (prev.items || []).filter((it) => it.id !== row.id),
        total: Math.max(0, (prev.total || 0) - 1),
      }));
    } catch (err) {
      console.error("Failed to delete template:", err);
      setError("Failed to delete template.");
    }
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { key: "description", label: "Description" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold">Templates</h2>
        <button
          onClick={handleCreate}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md"
        >
          Add Template
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

      <TemplateForm
        initialValue={editTemplate}
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

export default TemplateList;
