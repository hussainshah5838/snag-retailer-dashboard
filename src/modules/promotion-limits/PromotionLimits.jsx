import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Pagination from "../../shared/components/Pagination";
import PromotionRuleTable from "./components/PromotionRuleTable";
import PromotionRuleForm from "./components/PromotionRuleForm";
import LiveOfferConstraintSettings from "./components/LiveOfferConstraintSettings";
import {
  fetchPromotionRules,
  createPromotionRule,
  updatePromotionRule,
  deletePromotionRule,
} from "./api/promotionLimits.service";

function PromotionLimits() {
  const [rulesData, setRulesData] = useState({ items: [], total: 0 });
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loadingRules, setLoadingRules] = useState(true);
  const [rulesError, setRulesError] = useState(null);
  const [editRule, setEditRule] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoadingRules(true);
        setRulesError(null);
        const res = await fetchPromotionRules(
          { page, limit },
          controller.signal
        );
        setRulesData({ items: res.items || [], total: res.total || 0 });
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setRulesError("Failed to load promotion rules.");
        }
      } finally {
        setLoadingRules(false);
      }
    }

    load();
    return () => controller.abort();
  }, [page, limit]);

  function handleCreateRule() {
    setEditRule(null);
    setIsFormOpen(true);
  }

  function handleEditRule(row) {
    setEditRule(row);
    setIsFormOpen(true);
  }

  async function handleSaveRule(form) {
    try {
      if (editRule) {
        const updated = await updatePromotionRule(editRule.id, form);
        setRulesData((prev) => ({
          ...prev,
          items: (prev.items || []).map((it) =>
            it.id === updated.id ? updated : it
          ),
        }));
      } else {
        const created = await createPromotionRule(form);
        setRulesData((prev) => ({
          items: [created, ...(prev.items || [])].slice(0, limit),
          total: (prev.total || 0) + 1,
        }));
      }
      setPage(1);
    } catch (err) {
      console.error("Failed to save rule:", err);
      setRulesError("Failed to save rule.");
    }
  }

  async function handleDeleteRule(row) {
    if (!window.confirm("Delete this rule?")) return;
    try {
      await deletePromotionRule(row.id);
      setRulesData((prev) => ({
        ...prev,
        items: (prev.items || []).filter((it) => it.id !== row.id),
        total: Math.max(0, (prev.total || 0) - 1),
      }));
    } catch (err) {
      console.error("Failed to delete rule:", err);
      setRulesError("Failed to delete rule.");
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-base font-semibold">Promotion Limits</h1>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold">Promotion Rules</h2>
            <button
              onClick={handleCreateRule}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md"
            >
              Add Rule
            </button>
          </div>

          {loadingRules ? (
            <Loading />
          ) : rulesError ? (
            <p className="text-xs text-red-500">{rulesError}</p>
          ) : (
            <>
              <PromotionRuleTable
                data={rulesData.items}
                onEdit={handleEditRule}
                onDelete={handleDeleteRule}
              />
              <div className="mt-3">
                <Pagination
                  page={page}
                  pageSize={limit}
                  total={rulesData.total}
                  onChange={setPage}
                />
              </div>
            </>
          )}
        </div>

        <div>
          <LiveOfferConstraintSettings />
        </div>
      </div>

      <PromotionRuleForm
        initialValue={editRule}
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveRule}
      />
    </div>
  );
}

export default PromotionLimits;
