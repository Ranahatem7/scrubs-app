import { useRef, useState } from "react";
import { useAdmin } from "../context/AdminContext";
import { theme } from "../theme";

/**
 * ImageUploader
 * Props:
 *   value      - current image URL string (for single) or comma-separated string (for multiple)
 *   onChange   - called with new URL string
 *   multiple   - if true, appends to comma-separated list instead of replacing
 */
export default function ImageUploader({ value, onChange, multiple = false }) {
  const { adminToken } = useAdmin();
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setError("");
    setUploading(true);

    try {
      const urls = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("image", file);
       const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${adminToken}` },
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Upload failed");
        urls.push(data.url);
      }

      if (multiple) {
        const existing = value ? value.split(",").map((s) => s.trim()).filter(Boolean) : [];
        onChange([...existing, ...urls].join(", "));
      } else {
        onChange(urls[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const s = {
    wrap: { display: "flex", flexDirection: "column", gap: 8 },
    row: { display: "flex", gap: 8, alignItems: "center" },
    urlInput: {
      flex: 1, padding: "9px 12px", background: theme.surfaceLight,
      border: `1px solid ${theme.hairlineOnLight}`, borderRadius: theme.radius,
      color: theme.textOnLight, fontSize: 13, fontFamily: theme.fontBody, outline: "none",
    },
    uploadBtn: {
      padding: "9px 14px", background: theme.surfaceMuted,
      border: `1px solid ${theme.hairlineOnLight}`, borderRadius: theme.radius,
      color: theme.accent, fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
      textTransform: "uppercase", cursor: "pointer", fontFamily: theme.fontBody,
      whiteSpace: "nowrap",
    },
    error: { fontSize: 11, color: "#b43c3c" },
    preview: {
      display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4,
    },
    previewImg: {
      width: 60, height: 72, objectFit: "cover",
      borderRadius: theme.radius, border: `1px solid ${theme.hairlineOnLight}`,
    },
  };

  // Build preview URLs
  const previewUrls = value
    ? value.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div style={s.wrap}>
      <div style={s.row}>
        <input
          style={s.urlInput}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={multiple ? "https://... (or upload below)" : "https://..."}
        />
        <button
          type="button"
          style={s.uploadBtn}
          onClick={() => inputRef.current.click()}
          disabled={uploading}
        >
          {uploading ? "Uploading…" : "📁 Upload"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          style={{ display: "none" }}
          onChange={handleFile}
        />
      </div>
      {error && <span style={s.error}>{error}</span>}
      {previewUrls.length > 0 && (
        <div style={s.preview}>
          {previewUrls.map((url, i) => (
            <img key={i} src={url} alt="" style={s.previewImg} />
          ))}
        </div>
      )}
    </div>
  );
}