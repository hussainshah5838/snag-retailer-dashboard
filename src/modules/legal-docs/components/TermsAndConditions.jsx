import React, { useEffect, useState } from "react";
import Loading from "../../../components/Loading";
import { fetchLatestTerms } from "../api/legal.service";

function TermsAndConditions() {
  const [terms, setTerms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchLatestTerms(controller.signal);
        setTerms(res || null);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setError("Failed to load terms & conditions.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div
        className="rounded-xl p-4 shadow-sm"
        style={{
          background: "var(--card)",
          borderColor: "var(--line)",
          borderWidth: 1,
        }}
      >
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-xl p-4 shadow-sm"
        style={{
          background: "var(--card)",
          borderColor: "var(--line)",
          borderWidth: 1,
        }}
      >
        <p className="text-xs text-rose-400">{error}</p>
      </div>
    );
  }

  if (!terms) {
    return (
      <div
        className="rounded-xl p-4 shadow-sm"
        style={{
          background: "var(--card)",
          borderColor: "var(--line)",
          borderWidth: 1,
        }}
      >
        <p className="text-xs text-slate-400">
          No terms & conditions available.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-4 shadow-sm text-xs space-y-2"
      style={{
        background: "var(--card)",
        borderColor: "var(--line)",
        borderWidth: 1,
      }}
    >
      <div>
        <h2 className="text-sm font-semibold text-slate-50">
          Terms & Conditions
        </h2>
        <p className="text-slate-400">
          {terms.version ? `Version ${terms.version} · ` : ""}
          {terms.updatedAt && `Updated ${terms.updatedAt}`}
        </p>
      </div>
      <div
        className="border-t pt-2 text-slate-200 whitespace-pre-wrap"
        style={{ borderColor: "var(--line)" }}
      >
        {terms.content}
      </div>
    </div>
  );
}

export default TermsAndConditions;
