import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import DocsList from "./components/DocsList";
import DocViewer from "./components/DocViewer";
import RuntimeErrorBoundary from "../../components/RuntimeErrorBoundary";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import {
  fetchLegalDocs,
  createLegalDoc,
  updateLegalDoc,
  deleteLegalDoc,
} from "./api/legal.service";

const DOC_TYPES = ["terms", "privacy", "dpa", "other"];

function DocForm({ initialValue, open, onClose, onSave }) {
  const [form, setForm] = useState({ title: "", type: "other", version: "", content: "" });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setForm({
        title:   initialValue.title   || "",
        type:    initialValue.type    || "other",
        version: initialValue.version || "",
        content: initialValue.content || "",
      });
    } else {
      setForm({ title: "", type: "other", version: "", content: "" });
    }
    setFile(null);
    setErrors({});
  }, [initialValue, open]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.title.trim() || form.title.trim().length < 2)
      errs.title = "Title must be at least 2 characters";
    if (!form.version.trim())
      errs.version = "Version is required";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    try {
      setSubmitting(true);
      await onSave(form, file);
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={initialValue ? "Edit Document" : "Upload Document"}
      confirmLabel={initialValue ? "Save Changes" : "Upload"}
      onConfirm={handleSubmit}
      confirmDisabled={submitting}
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-medium mb-1">Title</label>
          <input name="title" value={form.title} onChange={handleChange}
            className="border rounded-md px-2 py-1 text-sm w-full" />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium mb-1">Type</label>
            <select name="type" value={form.type} onChange={handleChange}
              className="border rounded-md px-2 py-1 text-sm w-full">
              {DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Version</label>
            <input name="version" value={form.version} onChange={handleChange}
              placeholder="e.g. 2025.1"
              className="border rounded-md px-2 py-1 text-sm w-full" />
            {errors.version && <p className="text-xs text-red-500 mt-1">{errors.version}</p>}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">
            Content / Terms <span className="text-slate-400">(optional)</span>
          </label>
          <textarea name="content" value={form.content} onChange={handleChange}
            rows={4} placeholder="Paste terms and conditions text here..."
            className="border rounded-md px-2 py-1 text-sm w-full" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">
            Upload File <span className="text-slate-400">(optional)</span>
          </label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])}
            className="text-xs w-full" />
          {initialValue?.fileName && !file && (
            <p className="text-xs text-slate-400 mt-1">Current: {initialValue.fileName}</p>
          )}
        </div>
      </form>
    </ConfirmDialog>
  );
}

function LegalDocs() {
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [docsError, setDocsError] = useState(null);
  const [editDoc, setEditDoc] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoadingDocs(true);
        setDocsError(null);
        const res = await fetchLegalDocs({}, controller.signal);
        const list = res.items || [];
        setDocs(list);
        setSelectedDoc(list[0] || null);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError")
          setDocsError("Failed to load legal docs.");
      } finally {
        setLoadingDocs(false);
      }
    }
    load();
    return () => controller.abort();
  }, []);

  function handleCreate() {
    setEditDoc(null);
    setIsFormOpen(true);
  }

  function handleEdit(doc) {
    setEditDoc(doc);
    setIsFormOpen(true);
  }

  async function handleDelete(doc) {
    if (!window.confirm(`Delete "${doc.title}"?`)) return;
    try {
      await deleteLegalDoc(doc.id);
      const updated = docs.filter((d) => d.id !== doc.id);
      setDocs(updated);
      if (selectedDoc?.id === doc.id) setSelectedDoc(updated[0] || null);
    } catch {
      setDocsError("Failed to delete document.");
    }
  }

  async function handleSave(form, file) {
    try {
      if (editDoc) {
        const updated = await updateLegalDoc(editDoc.id, form, file);
        const updatedList = docs.map((d) => (d.id === updated.id ? updated : d));
        setDocs(updatedList);
        if (selectedDoc?.id === updated.id) setSelectedDoc(updated);
      } else {
        const created = await createLegalDoc(form, file);
        const updatedList = [created, ...docs];
        setDocs(updatedList);
        setSelectedDoc(created);
      }
    } catch (err) {
      setDocsError(err?.response?.data?.error?.message || "Failed to save document.");
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">Legal & Documentation</h1>
        <button onClick={handleCreate}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md">
          + Upload Document
        </button>
      </div>

      {docsError && <p className="text-xs text-rose-400">{docsError}</p>}

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* Left panel - docs list */}
        <div className="rounded-xl p-4 shadow-sm text-xs"
          style={{ background: "var(--card)", borderColor: "var(--line)", borderWidth: 1 }}>
          <h2 className="text-sm font-semibold mb-2">Documents</h2>
          {loadingDocs ? (
            <Loading />
          ) : (
            <RuntimeErrorBoundary>
              <DocsList
                docs={docs}
                selectedId={selectedDoc?.id}
                onSelect={setSelectedDoc}
              />
              {/* Edit / Delete actions for selected doc */}
              {selectedDoc && (
                <div className="flex gap-2 mt-3 pt-3 border-t" style={{ borderColor: "var(--line)" }}>
                  {selectedDoc.fileUrl && (
                    <a href={selectedDoc.fileUrl} target="_blank" rel="noreferrer"
                      className="flex-1 text-center px-2 py-1 text-[10px] bg-blue-600/20 text-blue-400 rounded-md">
                      View File
                    </a>
                  )}
                  <button onClick={() => handleEdit(selectedDoc)}
                    className="flex-1 px-2 py-1 text-[10px] bg-slate-700 text-slate-200 rounded-md">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(selectedDoc)}
                    className="flex-1 px-2 py-1 text-[10px] border border-red-500 text-red-400 rounded-md">
                    Delete
                  </button>
                </div>
              )}
            </RuntimeErrorBoundary>
          )}
        </div>

        {/* Right panel - doc viewer */}
        <div className="lg:col-span-2">
          <DocViewer doc={selectedDoc} />
        </div>
      </div>

      <DocForm
        initialValue={editDoc}
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

export default LegalDocs;
