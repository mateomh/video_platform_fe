import { Route, Routes } from "react-router-dom";
import App from "./App";
import VideoList from "./components/VideoList";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<App />}>

        {/* ── Public routes ── */}
        <Route path="/" element={<VideoList />} />
        <Route path="/login" element={<div>Login page — coming soon</div>} />
        <Route path="/register" element={<div>Register page — coming soon</div>} />

        {/* ── Protected routes ── */}
        <Route path="/upload" element={<div>Upload page — coming soon</div>} />
        <Route path="/videos/:id" element={<div>Video player — coming soon</div>} />
        <Route path="/channel/:username" element={<div>Channel page — coming soon</div>} />
        <Route path="/password-change" element={<div>Password change — coming soon</div>} />

        {/* ── 404 ── */}
        <Route path="*" element={<div>404 — Page not found</div>} />

      </Route>
    </Routes>
  );
}
