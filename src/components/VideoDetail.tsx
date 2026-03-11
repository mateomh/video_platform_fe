import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import { apiUrl } from "../config/api";
import Hls from "hls.js";
import "../assets/stylesheets/videos.css";
import "../assets/stylesheets/videoplayer.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VideoOwner {
  id: number;
  username: string;
}

interface Video {
  id: number;
  title: string;
  description: string | null;
  views: number;
  likes: number;
  dislikes: number;
  created_at: string;
  display_thumbnail_url: string;
  streaming_url: string;
  optimized_url: string;
  user: VideoOwner;
}

interface VideoDetailResponse extends Video {
  user_vote: 1 | -1 | null;
}

interface VoteResponse {
  likes: number;
  dislikes: number;
  user_vote: 1 | -1 | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VideoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, user, isAuthenticated } = useAuth();

  const [video, setVideo] = useState<Video | null>(null);
  const [userVote, setUserVote] = useState<1 | -1 | null>(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // ── Fetch video data ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!id) return;

    fetch(apiUrl(`/videos/${id}`), {
      headers: token ? { Authorization: `Token ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error("Video not found");
        return res.json();
      })
      .then((data: VideoDetailResponse) => {
        const { user_vote, ...videoData } = data;
        console.log("DATAAAAAAA");
        console.log(videoData)
        setVideo(videoData);
        setUserVote(user_vote);
        setLikes(videoData.likes);
        setDislikes(videoData.dislikes);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id, token]);

  // ── HLS player setup — mirrors the {% block extra_js %} script ─────────────

  useEffect(() => {
    if (!video || !videoRef.current) return;

    const videoEl = videoRef.current;
    const { streaming_url, optimized_url } = video;

    const setupHls = async () => {
    //   // Dynamically import hls.js — replaces the CDN <script> tag
      const { default: Hls } = await import("hls.js");

      if (Hls.isSupported()) {
        const hls = new Hls({ startLevel: -1, capLevelToPlayerSize: true });
        hlsRef.current = hls;
        hls.loadSource(streaming_url);
        hls.attachMedia(videoEl);
        hls.on(Hls.Events.ERROR, (_event: unknown, data: { fatal: boolean }) => {
          if (data.fatal) {
            videoEl.src = optimized_url;
          }
        });
      } else if (videoEl.canPlayType("application/vnd.apple.mpegurl")) {
        // Native HLS (Safari)
        videoEl.src = streaming_url;
      } else {
        videoEl.src = optimized_url;
      }
    };

    setupHls();

    return () => {
      // Cleanup HLS instance on unmount
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [video]);

  // ── Vote handler — replaces vote() JS function ────────────────────────────

  const handleVote = async (voteType: "like" | "dislike"): Promise<void> => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const res = await fetch(apiUrl(`/videos/${id}/vote/`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ vote: voteType }),
    });

    if (!res.ok) return;

    const data: VoteResponse = await res.json();
    setLikes(data.likes);
    setDislikes(data.dislikes);
    setUserVote(data.user_vote);
  };

  // ── Delete handler — replaces deleteVideo() JS function ──────────────────

  const handleDelete = async (): Promise<void> => {
    if (!confirm("Are you sure you want to delete this?")) return;

    const res = await fetch(apiUrl(`/videos/${id}/delete/`), {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
    });

    const data = await res.json();
    if (data.success) {
      navigate("/");
    } else {
      alert(data.error ?? "Failed to delete.");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (isLoading) return <div className="main-content">Loading...</div>;
  if (error || !video) return <div className="main-content">{error ?? "Video not found"}</div>;

  const isOwner = user?.id === video.user.id;
  const formattedDate = new Date(video.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <title>{video.title} - YouTube Clone</title>

      <div className="video-player-container">

        <div className="video-player">
          {!videoError ? (
            <video
              ref={videoRef}
              controls
              preload="none"
              poster={video.display_thumbnail_url}
              onError={() => setVideoError(true)}
            />
          ) : (
            <div className="video-error">
              <span className="error-icon">⚠</span>
              <p>Video Unavailable</p>
              <small>The video file could not be loaded.</small>
            </div>
          )}
        </div>

        <div className="video-details">
          <h1>{video.title}</h1>

          <div className="video-stats">
            <span className="video-stats-left">
              {video.views} views | {formattedDate}
            </span>
            <div className="video-actions">
              <button
                className={`vote-btn ${userVote === 1 ? "active" : ""}`}
                onClick={() => handleVote("like")}
              >
                👍 <span>{likes}</span>
              </button>
              <button
                className={`vote-btn ${userVote === -1 ? "active" : ""}`}
                onClick={() => handleVote("dislike")}
              >
                👎 <span>{dislikes}</span>
              </button>
            </div>
          </div>

          <div className="video-channel">
            <div className="channel-avatar">
              {video.user.username.slice(0, 1).toUpperCase()}
            </div>
            <Link
              to={`/channel/${video.user.username}`}
              className="channel-name"
            >
              {video.user.username}
            </Link>
          </div>

          {video.description && (
            <p className="video-description">{video.description}</p>
          )}

          {isOwner && (
            <div className="video-owner-actions">
              <button className="delete-btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
