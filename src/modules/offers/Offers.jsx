import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import SearchBar from "../../shared/components/SearchBar";
import Pagination from "../../shared/components/Pagination";
import OfferListTable from "./components/OfferListTable";
import OfferForm from "./components/OfferForm";
import OfferDetails from "./components/OfferDetails";
import TemplateList from "./templates/TemplateList";
import OfferCsvUpload from "./bulk-upload/OfferCsvUpload";
import OfferCsvImportLogs from "./bulk-upload/OfferCsvImportLogs";
import {
  fetchOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} from "./api/offers.service";

const TABS = [
  { id: "offers", label: "Offers" },
  { id: "templates", label: "Templates" },
  // { id: "bulk", label: "Bulk Upload" },
];

function Offers() {
  const [activeTab, setActiveTab] = useState("offers");

  const [filters, setFilters] = useState({ search: "", status: "" });
  const [offersData, setOffersData] = useState({ items: [], total: 0 });
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [offersError, setOffersError] = useState(null);

  const [selectedOffer, setSelectedOffer] = useState(null);
  const [editOffer, setEditOffer] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [lastUploadResult, setLastUploadResult] = useState(null);

  useEffect(() => {
    if (activeTab !== "offers") return;

    const controller = new AbortController();

    async function load() {
      try {
        setLoadingOffers(true);
        setOffersError(null);

        const res = await fetchOffers(
          {
            page,
            limit,
            search: filters.search || undefined,
            status: filters.status || undefined,
          },
          controller.signal
        );
        setOffersData({ items: res.items || [], total: res.total || 0 });
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setOffersError("Failed to load offers.");
        }
      } finally {
        setLoadingOffers(false);
      }
    }

    load();
    return () => controller.abort();
  }, [activeTab, page, limit, filters]);

  function handleCreateOffer() {
    setEditOffer(null);
    setIsFormOpen(true);
  }

  function handleEditOffer(row) {
    setEditOffer(row);
    setIsFormOpen(true);
  }

  function handleViewOffer(row) {
    setSelectedOffer(row);
  }

  async function handleSaveOffer(payload, bannerFile) {
    try {
      if (editOffer) {
        const updated = await updateOffer(editOffer.id, payload, bannerFile);
        setOffersData((prev) => ({
          ...prev,
          items: (prev.items || []).map((it) =>
            it.id === updated.id ? updated : it
          ),
        }));
      } else {
        const created = await createOffer(payload, bannerFile);
        setOffersData((prev) => ({
          items: [created, ...(prev.items || [])].slice(0, limit),
          total: (prev.total || 0) + 1,
        }));
      }
      setPage(1);
    } catch (err) {
      console.error("Failed to save offer:", err);
      setOffersError(err?.response?.data?.error?.message || "Failed to save offer.");
    }
  }

  async function handleDeleteOffer(row) {
    if (!window.confirm("Delete this offer?")) return;
    try {
      await deleteOffer(row.id);
      setOffersData((prev) => ({
        ...prev,
        items: (prev.items || []).filter((it) => it.id !== row.id),
        total: Math.max(0, (prev.total || 0) - 1),
      }));
    } catch (err) {
      console.error("Failed to delete offer:", err);
      setOffersError("Failed to delete offer.");
    }
  }

  function renderOffersTab() {
    return (
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex justify-between items-center">
            <SearchBar
              placeholder="Search offers..."
              value={filters.search}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, search: value }))
              }
            />
            <div className="flex gap-2 items-center">
              <select
                className="border rounded-md px-2 py-1 text-xs"
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
                <option value="draft">Draft</option>
                <option value="expired">Expired</option>
              </select>
              <button
                onClick={handleCreateOffer}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md"
              >
                Add Offer
              </button>
            </div>
          </div>

          {loadingOffers ? (
            <Loading />
          ) : offersError ? (
            <p className="text-xs text-red-500">{offersError}</p>
          ) : (
            <>
              <OfferListTable
                data={offersData.items}
                onEdit={handleEditOffer}
                onDelete={handleDeleteOffer}
                onView={handleViewOffer}
                onStatusChange={async (row, newStatus) => {
                  // quick status change handler: update and reflect locally
                  try {
                    const updated = await updateOffer(row.id, {
                      status: newStatus,
                    });
                    setOffersData((prev) => ({
                      ...prev,
                      items: (prev.items || []).map((it) =>
                        it.id === updated.id ? updated : it
                      ),
                    }));
                  } catch (err) {
                    console.error("Failed to change status:", err);
                    setOffersError("Failed to change status.");
                  }
                }}
              />
              <div className="mt-3">
                <Pagination
                  page={page}
                  pageSize={limit}
                  total={offersData.total}
                  onChange={setPage}
                />
              </div>
            </>
          )}
        </div>

        <div>
          <OfferDetails offer={selectedOffer} />
        </div>

        <OfferForm
          initialValue={editOffer}
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveOffer}
        />
      </div>
    );
  }

  function renderTemplatesTab() {
    return (
      <div className="bg-transparent">
        <TemplateList />
      </div>
    );
  }

  function renderBulkTab() {
    return (
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-sm font-semibold mb-2">Upload Offers CSV</h2>
          <OfferCsvUpload onUploaded={setLastUploadResult} />
          {lastUploadResult && (
            <p className="mt-2 text-xs text-gray-600">
              Import started with ID: {lastUploadResult.id}
            </p>
          )}
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <OfferCsvImportLogs />
        </div>
      </div>
    );
  }

  function renderTab() {
    if (activeTab === "offers") return renderOffersTab();
    if (activeTab === "templates") return renderTemplatesTab();
    if (activeTab === "bulk") return renderBulkTab();
    return null;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-base font-semibold">Offer Management</h1>

      <div className="border-b flex gap-4 text-xs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 px-1 border-b-2 ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderTab()}
    </div>
  );
}

export default Offers;
