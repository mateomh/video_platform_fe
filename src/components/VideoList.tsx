import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import "../assets/stylesheets/videos.css";
import { apiUrl } from "../config/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VideoOwner {
  username: string;
}

interface Video {
  id: number;
  title: string;
  display_thumbnail_url: string;
  views: number;
  user: VideoOwner;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VideoList() {
  const { token } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(apiUrl("/videos"), {
      headers: token ? { Authorization: `Token ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load videos");
        return res.json();
      })
      .then((data: Video[]) => setVideos(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [token]);

  if (isLoading) return <LoadingGrid />;
  if (error) return <ErrorState message={error} />;

  return (
    <>
      <title>Videos - YouTube Clone</title>

      {videos.length > 0 ? (
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function VideoCard({ video }: { video: Video }) {
  return (
    // Mirrors: <a href="{% url 'videos:detail' video.id %}" class="video-card">
    <Link to={`/videos/${video.id}`} className="video-card">
      <div className="video-thumbnail">
        <img
          src={video.display_thumbnail_url}
          alt={video.title}
          loading="lazy"
        />
        <span className="play-icon">▶</span>
      </div>
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-meta">
          {video.user.username} | {video.views} views
        </p>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="empty-state">
      <span className="empty-icon">📹</span>
      <h2>No videos yet</h2>
      <p>Be the first to upload a video!</p>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="video-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="video-card" style={{ opacity: 0.4, pointerEvents: "none" }}>
          <div className="video-thumbnail" style={{ background: "var(--bg-tertiary)" }} />
          <div className="video-info">
            <div style={{ height: 16, background: "var(--bg-tertiary)", borderRadius: 4, marginBottom: 8 }} />
            <div style={{ height: 12, background: "var(--bg-tertiary)", borderRadius: 4, width: "60%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">⚠️</span>
      <h2>Something went wrong</h2>
      <p>{message}</p>
    </div>
  );
}
