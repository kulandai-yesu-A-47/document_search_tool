import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchQuery, deleteDocument } from "../api";
import { fileIcon } from "../utils/fileHelpers";
import DocumentPreview from "../components/DocumentPreview";
import DownloadButton from "../components/DownloadButton";
import toast from "react-hot-toast";

export default function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const q = new URLSearchParams(location.search).get("q") || "";
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let active = true;
    if (!q.trim()) {
      setResults([]);
      setSearching(false);
      return () => {
        active = false;
      };
    }
    setSearching(true);
    searchQuery(q)
      .then((res) => {
        if (active) setResults(Array.isArray(res) ? res : []);
      })
      .catch((err) => {
        console.error("Search failed", err);
        if (active)
          toast.error("Search failed. Please check the API connection.");
      })
      .finally(() => {
        if (active) setSearching(false);
      });
    return () => {
      active = false;
    };
  }, [q]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this document? This action cannot be undone."))
      return;
    try {
      await deleteDocument(id);
      setResults((prev) => prev.filter((item) => item.id !== id));
      toast.success("Document deleted");
    } catch (error) {
      console.error(error);
      toast.error("Could not delete document");
    }
  }

  const resolveFilename = (doc) =>
    doc.filename ||
    doc.file_url?.split("/").pop() ||
    doc.file?.split("/").pop() ||
    "File";

  return (
    <div>
      <div className="page-intro">
        <div>
          <h2>Find what you need.</h2>
          <p>
            Search across your uploaded documents and discover relevant content
            faster.
          </p>
        </div>
        {q && <span className="pill">⌕ &nbsp; Search: “{q}”</span>}
      </div>
      <section className="section-card">
        <div className="panel-heading">
          <div>
            <h3>{q ? "Search results" : "Search your knowledge base"}</h3>
            <div className="muted-text" style={{ marginTop: 5 }}>
              {searching
                ? "Looking through your documents…"
                : q
                  ? `${results.length} result${results.length === 1 ? "" : "s"} found`
                  : "Enter a keyword in the search bar above to get started."}
            </div>
          </div>
          <span className="pill">FULL-TEXT SEARCH</span>
        </div>
        {searching ? (
          <div className="loading-state">Searching your documents…</div>
        ) : !q ? (
          <div className="empty-state">
            <div className="empty-icon">⌕</div>
            <h3>Search across your documents</h3>
            <p>
              Use the search field above to find documents by title, keywords,
              or matching text.
            </p>
            <button
              className="btn-primary"
              onClick={() =>
                document.getElementById("global-search-input")?.focus()
              }
            >
              Start searching
            </button>
          </div>
        ) : results.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⌕</div>
            <h3>No matching documents</h3>
            <p>
              Try a shorter keyword, check the spelling, or upload a document
              that contains this information.
            </p>
            <button
              className="btn-secondary"
              onClick={() => navigate("/upload")}
            >
              ＋ Upload a document
            </button>
          </div>
        ) : (
          <div className="doc-list">
            {results.map((doc) => {
              const filename = resolveFilename(doc);
              return (
                <article className="doc-row" key={doc.id}>
                  <div className="file-badge">
                    {fileIcon(doc.file_type, filename)}
                  </div>
                  <div className="doc-main">
                    <div className="doc-title">{doc.title || filename}</div>
                    <div className="doc-filename">{filename}</div>
                    {doc.tags && (
                      <div className="doc-tags">
                        Tags:{" "}
                        {Array.isArray(doc.tags)
                          ? doc.tags.join(", ")
                          : doc.tags}
                      </div>
                    )}
                    {doc.snippet && (
                      <p className="snippet-text">{doc.snippet}</p>
                    )}
                  </div>
                  <div className="doc-actions">
                    <button
                      className="btn-secondary"
                      onClick={() => setSelected(doc)}
                    >
                      Preview
                    </button>
                    {(doc.file_url || doc.file) && (
                      <DownloadButton document={doc} />
                    )}
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(doc.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
      <DocumentPreview document={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
