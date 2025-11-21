import React, { useEffect, useState } from "react";
import Loading from "../../../components/Loading";
import Pagination from "../../../shared/components/Pagination";
import SearchBar from "../../../shared/components/SearchBar";
import AudienceSegmentTable from "../components/AudienceSegmentTable";
import SegmentForm from "./SegmentForm";
import SegmentDetails from "./SegmentDetails";
import {
  fetchAudienceSegments,
  createAudienceSegment,
  updateAudienceSegment,
  deleteAudienceSegment,
} from "../api/audienceSegments.service";

function SegmentList() {
  const [filters, setFilters] = useState({ search: "" });
  const [data, setData] = useState({ items: [], total: 0 });
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editSegment, setEditSegment] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchAudienceSegments(
          { page, limit, search: filters.search || undefined },
          controller.signal
        );
        setData({ items: res.items || [], total: res.total || 0 });
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setError("Failed to load segments.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [page, limit, filters]);

  function handleCreate() {
    setEditSegment(null);
    setIsFormOpen(true);
  }

  function handleEdit(row) {
    setEditSegment(row);
    setIsFormOpen(true);
  }

  async function handleSave(form) {
    try {
      if (editSegment) {
        const updated = await updateAudienceSegment(editSegment.id, form);
        setData((prev) => ({
          ...prev,
          items: (prev.items || []).map((it) =>
            it.id === updated.id ? updated : it
          ),
        }));
      } else {
        const created = await createAudienceSegment(form);
        setData((prev) => ({
          items: [created, ...(prev.items || [])].slice(0, limit),
          total: (prev.total || 0) + 1,
        }));
      }
      setPage(1);
    } catch (err) {
      console.error("Failed to save segment:", err);
      setError("Failed to save segment.");
    }
  }

  async function handleDelete(row) {
    if (!window.confirm("Delete this segment?")) return;
    try {
      await deleteAudienceSegment(row.id);
      setData((prev) => ({
        ...prev,
        items: (prev.items || []).filter((it) => it.id !== row.id),
        total: Math.max(0, (prev.total || 0) - 1),
      }));
    } catch (err) {
      console.error("Failed to delete segment:", err);
      setError("Failed to delete segment.");
    }
  }

  function handleView(row) {
    setSelectedSegment(row);
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-3">
        <div className="flex justify-between items-center">
          <SearchBar
            placeholder="Search segments..."
            value={filters.search}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, search: value }))
            }
          />
          <button
            onClick={handleCreate}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md"
          >
            Add Segment
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : error ? (
          <p className="text-xs text-red-500">{error}</p>
        ) : (
          <>
            <AudienceSegmentTable
              data={data.items}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
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
      </div>

      <div>
        <SegmentDetails segment={selectedSegment} />
      </div>

      <SegmentForm
        initialValue={editSegment}
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

export default SegmentList;
