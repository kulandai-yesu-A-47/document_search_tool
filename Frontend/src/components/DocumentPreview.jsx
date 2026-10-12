
import { useEffect, useState } from "react";
import { fileIcon } from "../utils/fileHelpers";
import {
  getDocumentUrl,
  getDocumentFilename,
  downloadDocument,
} from "../utils/fileActions";

export default function DocumentPreview({ document, onClose }) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [textContent, setTextContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const url = document
    ? (() => {
        try {
          return getDocumentUrl(document);
        } catch {
          return "";
        }
      })()
    : "";

  const filename = document
    ? getDocumentFilename(document, url)
    : "";

  const extension = filename.split(".").pop()?.toLowerCase() || "";
  const imageTypes = ["png", "jpg", "jpeg", "gif", "bmp", "webp", "svg"];
  const videoTypes = ["mp4", "webm", "mov"];
  const textTypes = ["txt", "csv", "json", "log"];

  const canPreview =
    extension === "pdf" ||
    imageTypes.includes(extension) ||
    videoTypes.includes(extension) ||
    textTypes.includes(extension);

  useEffect(() => {
    if (!document || !url) {
      setPreviewUrl("");
      setTextContent("");
      setError("");
      return;
    }

    let active = true;
    let objectUrl = "";

    setLoading(true);
    setError("");
    setPreviewUrl("");
    setTextContent("");

    async function loadPreview() {
      try {
        if (!canPreview) return;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Unable to load file (${response.status}).`);
        }

        const blob = await response.blob();

        if (!active) return;

        if (textTypes.includes(extension)) {
          setTextContent(await blob.text());
        } else {
          objectUrl = URL.createObjectURL(blob);
          setPreviewUrl(objectUrl);
        }
      } catch (err) {
        if (active) {
          setError(
            err.message ||
              "Preview could not be loaded. Check your backend connection."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPreview();

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url, extension, document?.id]);

  async function handleDownload() {
    try {
      setDownloading(true);
      await downloadDocument(document);
    } catch (err) {
      setError(err.message || "Download failed.");
    } finally {
      setDownloading(false);
    }
  }

  useEffect(() => {
    if (!document) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [document, onClose]);

  if (!document) return null;

  return (
    <div
      className="preview-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="preview-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`Preview ${filename}`}
      >
        <header className="preview-header">
          <div className="file-badge">
            {fileIcon(document.file_type, filename)}
          </div>

          <div className="preview-header-copy">
            <strong>{document.title || filename}</strong>
            <small>{filename}</small>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? "Downloading..." : "↓ Download"}
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            ✕ Close
          </button>
        </header>

        <div className="preview-body">
          {loading && <p>Loading preview...</p>}

          {!url && !loading && (
            <p>File URL is missing. Please check the document API response.</p>
          )}

          {error && <p role="alert">{error}</p>}

          {!loading && !error && previewUrl && extension === "pdf" && (
            <iframe
              src={previewUrl}
              title={filename}
              style={{ width: "100%", height: "100%", border: 0 }}
            />
          )}

          {!loading && !error && previewUrl && imageTypes.includes(extension) && (
            <img src={previewUrl} alt={filename} />
          )}

          {!loading && !error && previewUrl && videoTypes.includes(extension) && (
            <video
              src={previewUrl}
              controls
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          )}

          {!loading && !error && textTypes.includes(extension) && (
            <pre
              style={{
                width: "100%",
                height: "100%",
                overflow: "auto",
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
                padding: 16,
                background: "#fff",
                color: "#243d3d",
              }}
            >
              {textContent}
            </pre>
          )}

          {!loading && !error && !canPreview && (
            <div className="empty-state">
              <div className="empty-icon">
                {fileIcon(document.file_type, filename)}
              </div>
              <h3>Preview not supported for this file type</h3>
              <p>
                You can download the document to open it in the appropriate app.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading ? "Downloading..." : "Download file"}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
