import { Route, Routes } from "react-router-dom";
import App from "./App";
import VideoList from "./components/VideoList";
import VideoDetail from "./components/VideoDetail";
import VideoUpload from "./components/VideoUpload";
import VideoChannel from "./components/VideoChannel";
import Register from "./components/Register";
import Login from "./components/Login";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<App />}>

        {/* ── Public routes ── */}
        <Route path="/" element={<VideoList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Protected routes ── */}
        <Route path="/upload" element={<VideoUpload />} />
        <Route path="/videos/:id" element={<VideoDetail />} />
        <Route path="/channel/:username" element={<VideoChannel />} />
        <Route path="/password-change" element={<div>Password change — coming soon</div>} />

        {/* ── 404 ── */}
        <Route path="*" element={<div>404 — Page not found</div>} />

      </Route>
    </Routes>
  );
}
