// src/modules/retailer-management/users/RetailerUserList.jsx
import React, { useEffect, useState } from "react";
import DataTable from "../../../shared/components/DataTable";
import Pagination from "../../../shared/components/Pagination";
import Loading from "../../../components/Loading";
import RetailerUserForm from "./RetailerUserForm";
import {
  fetchRetailerUsers,
  createRetailerUser,
  updateRetailerUser,
  deactivateRetailerUser,
} from "../api/retailerUsers.service";

function RetailerUserList({ retailerId }) {
  const [data, setData] = useState({ items: [], total: 0 });
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetchRetailerUsers(
          {
            page,
            limit,
            retailerId: retailerId || undefined,
          },
          controller.signal
        );

        setData({ items: res.items || [], total: res.total || 0 });
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setError("Failed to load users.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [page, limit, retailerId]);

  function handleCreate() {
    setEditUser(null);
    setIsFormOpen(true);
  }

  function handleEdit(row) {
    setEditUser(row);
    setIsFormOpen(true);
  }

  async function handleSave(form) {
    try {
      if (editUser) {
        const updated = await updateRetailerUser(editUser.id, {
          ...form,
          retailerId: retailerId || editUser.retailerId,
        });
        setData((prev) => ({
          ...prev,
          items: (prev.items || []).map((it) =>
            it.id === updated.id ? updated : it
          ),
        }));
      } else {
        const created = await createRetailerUser({
          ...form,
          retailerId: retailerId || form.retailerId,
        });
        setData((prev) => ({
          items: [created, ...(prev.items || [])].slice(0, limit),
          total: (prev.total || 0) + 1,
        }));
      }
      setPage(1);
    } catch (err) {
      console.error("Failed to save user:", err);
      setError("Failed to save user.");
    }
  }

  async function handleDeactivate(row) {
    if (!window.confirm("Deactivate this user?")) return;
    try {
      await deactivateRetailerUser(row.id);
      setData((prev) => ({
        ...prev,
        items: (prev.items || []).map((it) =>
          it.id === row.id ? { ...it, status: "inactive" } : it
        ),
      }));
    } catch (err) {
      console.error("Failed to deactivate user:", err);
      setError("Failed to deactivate user.");
    }
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold">Retailer Users</h2>
        <button
          onClick={handleCreate}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md"
        >
          Add User
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
              { label: "Deactivate", onClick: handleDeactivate },
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

      <RetailerUserForm
        initialValue={editUser}
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

export default RetailerUserList;
