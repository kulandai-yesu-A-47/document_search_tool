import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { uploadDocument, listDocuments, deleteDocument } from "../api";
import { fileIcon } from "../utils/fileHelpers";
import DownloadButton from "../components/DownloadButton";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    let active = true;
    listDocuments()
      .then((data) => {
        if (active) setDocs(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error(error);
        if (active) toast.error("Failed to load documents");
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleUpload(event) {
    event.preventDefault();
    if (!title.trim() || !file) {
      toast.error("Add a document title and choose a file");
      return;
    }
    setLoading(true);
    try {
      const uploaded = await uploadDocument(title.trim(), file);
      setDocs((prev) => [uploaded, ...prev]);
      setTitle("");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      toast.success("Document uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error?.response?.data?.detail || "Upload failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

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
  const formatSize = (bytes) => {
    if (!Number.isFinite(bytes)) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <div className="page-intro">
        <div>
          <h2>Add to your knowledge base.</h2>
          <p>
            Upload a file, give it a clear title, and make its content
            searchable.
          </p>
        </div>
        <span className="pill">SECURE WORKFLOW</span>
      </div>
      <div className="upload-layout">
        <section className="section-card">
          <div className="panel-heading">
            <div>
              <h3>Upload a document</h3>
              <div className="muted-text" style={{ marginTop: 5 }}>
                Required fields are marked with an asterisk.
              </div>
            </div>
            <span className="pill">＋ NEW FILE</span>
          </div>
          <form onSubmit={handleUpload} style={{ padding: 22 }}>
            <div className="form-field">
              <label className="form-label" htmlFor="document-title">
                Document title <span style={{ color: "#bf5757" }}>*</span>
              </label>
              <input
                id="document-title"
                className="form-input"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Product requirements — Q4"
                maxLength={200}
              />
            </div>
            <div className="form-field">
              <label className="form-label">
                Choose a file <span style={{ color: "#bf5757" }}>*</span>
              </label>
              <label
                className="upload-dropzone"
                htmlFor="document-file"
                style={{ cursor: "pointer" }}
              >
                <span className="upload-drop-icon">↑</span>
                <strong>
                  {file ? file.name : "Choose a document to upload"}
                </strong>
                <p>
                  {file
                    ? `${formatSize(file.size)} · Ready to upload`
                    : "Click here to browse files on your device"}
                </p>
                <span className="btn-secondary">Browse files</span>
                <input
                  ref={inputRef}
                  id="document-file"
                  type="file"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                  style={{ display: "none" }}
                />
              </label>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <span className="muted-text">
                Avoid uploading sensitive personal information.
              </span>
              <button
                className="btn-primary"
                type="submit"
                disabled={loading}
                style={{ opacity: loading ? 0.65 : 1 }}
              >
                {loading ? "Uploading…" : "↑  Upload document"}
              </button>
            </div>
          </form>
        </section>
        <aside className="section-card" style={{ padding: 22 }}>
          <div className="upload-drop-icon" style={{ marginBottom: 15 }}>
            ✦
          </div>
          <h3
            style={{
              margin: "0 0 7px",
              font: "800 15px Manrope, sans-serif",
              color: "#203839",
            }}
          >
            What happens next?
          </h3>
          <p
            style={{
              margin: "0 0 20px",
              color: "#859396",
              fontSize: 11,
              lineHeight: 1.7,
            }}
          >
            Your document is added to the library and can be found using the
            search experience.
          </p>
          {[
            ["01", "Upload", "Choose a file and add a title."],
            [
              "02",
              "Index",
              "The backend processes supported document content.",
            ],
            ["03", "Discover", "Search for matching words and content."],
          ].map(([number, heading, description]) => (
            <div
              key={number}
              style={{
                display: "flex",
                gap: 12,
                padding: "13px 0",
                borderTop: "1px solid #edf1f2",
              }}
            >
              <span
                style={{
                  flex: "0 0 30px",
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 9,
                  background: "#eff8f4",
                  color: "#287764",
                  fontSize: 10,
                  fontWeight: 800,
                }}
              >
                {number}
              </span>
              <div>
                <strong
                  style={{ display: "block", color: "#385251", fontSize: 11 }}
                >
                  {heading}
                </strong>
                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#879593",
                    fontSize: 10,
                    lineHeight: 1.6,
                  }}
                >
                  {description}
                </p>
              </div>
            </div>
          ))}
        </aside>
      </div>
      <section className="section-card" style={{ marginTop: 22 }}>
        <div className="panel-heading">
          <div>
            <h3>Recently uploaded</h3>
            <div className="muted-text" style={{ marginTop: 5 }}>
              {docs.length} document{docs.length === 1 ? "" : "s"} in your
              library
            </div>
          </div>
        </div>
        {docs.length === 0 ? (
          <div className="empty-state" style={{ padding: 28 }}>
            <h3>No uploads yet</h3>
            <p>Your recent uploads will appear here.</p>
          </div>
        ) : (
          <div className="doc-list">
            {docs.slice(0, 5).map((doc) => {
              const filename = resolveFilename(doc);
              return (
                <article className="doc-row" key={doc.id}>
                  <div className="file-badge">
                    {fileIcon(doc.file_type, filename)}
                  </div>
                  <div className="doc-main">
                    <div className="doc-title">{doc.title || filename}</div>
                    <div className="doc-filename">{filename}</div>
                  </div>
                  <div className="doc-actions">
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
    </div>
  );
}
