const API_BASE =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const API_ORIGIN = new URL(API_BASE, window.location.origin).origin;

export function getDocumentUrl(document) {
  const rawUrl = document?.file_url || document?.file || "";

  if (!rawUrl) {
    throw new Error("File URL is missing.");
  }

  return new URL(rawUrl, API_ORIGIN).href;
}

export function getDocumentFilename(document, url = "") {
  if (document?.filename) return document.filename;

  try {
    return decodeURIComponent(
      new URL(url || getDocumentUrl(document)).pathname.split("/").pop()
    ) || "download";
  } catch {
    return "download";
  }
}

export async function downloadDocument(document) {
  const url = getDocumentUrl(document);
  const filename = getDocumentFilename(document, url);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Download failed (${response.status}).`);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  const link = window.document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  link.style.display = "none";

  window.document.body.appendChild(link);
  link.click();
  link.remove();

  // Give the browser time to start the download.
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}
