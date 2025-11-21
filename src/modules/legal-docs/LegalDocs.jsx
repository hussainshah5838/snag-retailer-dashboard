import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import DocsList from "./components/DocsList";
import DocViewer from "./components/DocViewer";
import TermsAndConditions from "./components/TermsAndConditions";
import RuntimeErrorBoundary from "../../components/RuntimeErrorBoundary";
import { fetchLegalDocs } from "./api/legal.service";

function LegalDocs() {
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [docsError, setDocsError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoadingDocs(true);
        setDocsError(null);
        const res = await fetchLegalDocs({}, controller.signal);
        const list = res.items || res || [];
        setDocs(list);
        setSelectedDoc(list[0] || null);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setDocsError("Failed to load legal docs.");
        }
      } finally {
        setLoadingDocs(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-base font-semibold">Legal & Documentation</h1>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div
          className="rounded-xl p-4 shadow-sm text-xs"
          style={{
            background: "var(--card)",
            borderColor: "var(--line)",
            borderWidth: 1,
          }}
        >
          <h2 className="text-sm font-semibold mb-2">Documents</h2>
          {loadingDocs ? (
            <Loading />
          ) : docsError ? (
            <p className="text-xs text-rose-400">{docsError}</p>
          ) : (
            <RuntimeErrorBoundary>
              <DocsList
                docs={docs}
                selectedId={selectedDoc?.id}
                onSelect={setSelectedDoc}
              />
            </RuntimeErrorBoundary>
          )}
        </div>

        <div className="lg:col-span-2">
          <DocViewer doc={selectedDoc} />
        </div>
      </div>

      <TermsAndConditions />
    </div>
  );
}

export default LegalDocs;
