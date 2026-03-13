import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import { apiUrl } from "../config/api";
import "../assets/stylesheets/videos.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Video {
  id: number;
  title: string;
  display_thumbnail_url: string;
  views: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VideoChannel() {
  const { username } = useParams<{ username: string }>();
  const { token } = useAuth();

  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    fetch(apiUrl(`/channel/${username}/`), {
      headers: token ? { Authorization: `Token ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error("Channel not found");
        return res.json();
      })
      .then((data: Video[]) => setVideos(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [username, token]);

  if (isLoading) return <div className="main-content">Loading...</div>;
  if (error) return <div className="main-content">{error}</div>;

  return (
    <>
      <title>{username} - YouTube Clone</title>


      <div className="channel-header">
        <div className="channel-header-avatar">
          {username?.slice(0, 1).toUpperCase()}
        </div>
        <h1>{username}</h1>
      </div>

      {videos.length > 0 ? (
        <div className="video-grid">
          {videos.map((video) => (
            <Link
              key={video.id}
              to={`/videos/${video.id}`}
              className="video-card"
            >
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
                <p className="video-meta">{video.views} views</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">🎬</span>
          <h2>No Videos Yet</h2>
          <p>This channel hasn't uploaded any videos yet.</p>
        </div>
      )}
    </>
  );
}
