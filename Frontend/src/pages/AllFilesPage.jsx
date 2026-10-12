import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listDocuments, deleteDocument } from "../api";
import { fileIcon } from "../utils/fileHelpers";
import DocumentPreview from "../components/DocumentPreview";
import DownloadButton from "../components/DownloadButton";
import toast from "react-hot-toast";

export default function AllFilesPage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    listDocuments()
      .then((data) => {
        if (active) setDocs(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Failed loading documents:", error);
        if (active) toast.error("Failed to load documents");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this document? This action cannot be undone."))
      return;
    try {
      await deleteDocument(id);
      setDocs((prev) => prev.filter((doc) => doc.id !== id));
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
          <h2>Your document library.</h2>
          <p>Browse, preview, download, and manage your uploaded files.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate("/upload")}>
          ＋ Upload document
        </button>
      </div>
      <section className="section-card">
        <div className="panel-heading">
          <div>
            <h3>All documents</h3>
            <div className="muted-text" style={{ marginTop: 5 }}>
              {loading
                ? "Loading your library…"
                : `${docs.length} document${docs.length === 1 ? "" : "s"} in your library`}
            </div>
          </div>
          <span className="pill">LIBRARY</span>
        </div>
        {loading ? (
          <div className="loading-state">Loading your documents…</div>
        ) : docs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">▤</div>
            <h3>Your library is ready</h3>
            <p>
              Upload your first document to start building a searchable
              knowledge base.
            </p>
            <button className="btn-primary" onClick={() => navigate("/upload")}>
              Upload your first file
            </button>
          </div>
        ) : (
          <div className="doc-list">
            {docs.map((doc) => {
              const filename = resolveFilename(doc);
              return (
                <article className="doc-row" key={doc.id}>
                  <div className="file-badge">
                    {doc.thumbnail_url ? (
                      <img
                        src={doc.thumbnail_url}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 11,
                        }}
                      />
                    ) : (
                      fileIcon(doc.file_type, filename)
                    )}
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
