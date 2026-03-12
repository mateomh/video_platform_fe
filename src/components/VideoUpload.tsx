import { useState, useRef, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import { apiUrl } from "../config/api";
import "../assets/stylesheets/videos.css";
import "../assets/stylesheets/upload.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UploadResponse {
  success: boolean;
  error?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function VideoUpload() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFileName, setVideoFileName] = useState<string | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [thumbnailData, setThumbnailData] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("Uploading Video...");

  const videoFileRef = useRef<HTMLInputElement>(null);
  const thumbFileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // ── Video file selection — mirrors $("id_video_file").onchange ────────────

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setVideoFileName(file ? file.name : null);
  };

  // ── Thumbnail selection — mirrors $("customThumbnail").onchange ───────────

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setThumbPreview(result);
      setThumbnailData(result);
    };
    reader.readAsDataURL(file);
  };

  // ── Form submit — mirrors $("uploadForm").onsubmit ────────────────────────

  const handleSubmit = async (e: { preventDefault: () => void; currentTarget: HTMLFormElement }): Promise<void> => {
    e.preventDefault();
    setErrors([]);

    const videoFile = videoFileRef.current?.files?.[0];
    if (!videoFile || !title.trim()) return;

    setIsUploading(true);

    window.onbeforeunload = () => "Upload in progress";

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video_file", videoFile);
    if (thumbnailData) formData.append("thumbnail_data", thumbnailData);

    try {
      const res = await fetch(apiUrl("/upload"), {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
        body: formData,
      });

      const data: UploadResponse = await res.json();
      window.onbeforeunload = null;

      if (data.success) {
        setUploadStatus("Upload complete!");
        setTimeout(() => navigate("/"), 500);
      } else {
        throw new Error(data.error ?? "Upload failed");
      }
    } catch (err) {
      window.onbeforeunload = null;
      setIsUploading(false);
      setErrors([(err as Error).message ?? "Upload failed"]);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <title>Upload Video - YouTube Clone</title>

      <div className={`upload-overlay ${isUploading ? "active" : ""}`}>
        <div className="upload-progress-container">
          <div className="upload-spinner" />
          <h2>{uploadStatus}</h2>
          <p className="upload-warning">Please don't close this page</p>
        </div>
      </div>

      <div className="upload-container">
        <div className="upload-card">
          <h1>Upload Video</h1>

          <form
            ref={formRef}
            className="upload-form"
            onSubmit={handleSubmit}
          >
            {errors.length > 0 && (
              <ul className="error-list">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}

            <div className="form-group">
              <label htmlFor="id_title">Title</label>
              <input
                type="text"
                id="id_title"
                className="form-input"
                placeholder="Enter video title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="id_description">Description</label>
              <textarea
                id="id_description"
                className="form-input"
                placeholder="Enter video description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="id_video_file">Video File</label>
              <label
                className="file-input-wrapper"
                htmlFor="id_video_file"
              >
                <span>{videoFileName ?? "Click to select a video file"}</span>
              </label>
              <input
                ref={videoFileRef}
                type="file"
                id="id_video_file"
                accept="video/*"
                required
                style={{ display: "none" }}
                onChange={handleVideoChange}
              />
              <span className="help-text">
                MP4, WebM, MOV, or AVI. Max 100MB
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="customThumbnail">
                Thumbnail{" "}
                <span className="optional">(optional)</span>
              </label>
              <label
                className="file-input-wrapper thumb-wrapper"
                htmlFor="customThumbnail"
              >
                {thumbPreview ? (
                  <img
                    src={thumbPreview}
                    className="visible"
                    style={{
                      maxWidth: 160,
                      maxHeight: 90,
                      borderRadius: "var(--radius-md)",
                      objectFit: "cover",
                    }}
                    alt="Thumbnail preview"
                  />
                ) : (
                  <span>Click to select a thumbnail</span>
                )}
              </label>
              <input
                ref={thumbFileRef}
                type="file"
                id="customThumbnail"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleThumbnailChange}
              />
              <span className="help-text">
                Leave empty to auto-generate from your video
              </span>
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={isUploading}
            >
              Upload Video
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
