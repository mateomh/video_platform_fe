import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import { useMessages } from "./context/useMessages";
import "../assets/stylesheets/auth.css";

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Login — replaces login.html
 *
 * DRF endpoint expected:
 *   POST /api/auth/login/ → { token: string }
 *   body: { username: string, password: string }
 */
export default function Login() {
  const { login } = useAuth();
  const { addMessage } = useMessages();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }): Promise<void> => {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    try {
      await login(username, password);
      addMessage(`Welcome back, ${username}!`, "success");
      navigate("/");
    } catch {
      setErrors(["Invalid username or password. Please try again."]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <title>Sign In - YouTube Clone</title>

      <div className="auth-container">

        {/* Header — mirrors <div class="auth-header"> */}
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue with YouTube Clone</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>

          {/* Errors — mirrors {% if form.errors %} */}
          {errors.length > 0 && (
            <ul className="error-list">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}

          {/* Username */}
          <div className="form-group">
            <label htmlFor="id_username">Username</label>
            <input
              type="text"
              id="id_username"
              className="form-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="id_password">Password</label>
            <input
              type="password"
              id="id_password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer — mirrors <div class="auth-footer"> */}
        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create One</Link>
        </div>
      </div>
    </>
  );
}
