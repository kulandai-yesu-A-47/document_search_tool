
import { useState } from "react";
import toast from "react-hot-toast";
import { downloadDocument } from "../utils/fileActions";

export default function DownloadButton({ document }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);
      await downloadDocument(document);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error(
        error.message || "Download failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className="btn-secondary"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? "Downloading..." : "↓ Download"}
    </button>
  );
}
