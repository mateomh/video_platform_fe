import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import { useMessages } from "./context/useMessages";
import { apiUrl } from "../config/api";
import "../assets/stylesheets/auth.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RegisterResponse {
  token?: string;
  error?: string;
  [key: string]: string | string[] | undefined;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Register() {
  const { login } = useAuth();
  const { addMessage } = useMessages();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }): Promise<void> => {
    e.preventDefault();
    setErrors([]);

    if (password !== confirmPassword) {
      setErrors(["Passwords do not match."]);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(apiUrl("/accounts/register/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          email,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      const data: RegisterResponse = await res.json();

      if (!res.ok) {
        const fieldErrors = Object.entries(data)
          .filter(([key]) => key !== "token")
          .flatMap(([, value]) =>
            Array.isArray(value) ? value : [value as string]
          );
        setErrors(fieldErrors.length > 0 ? fieldErrors : ["Registration failed."]);
        return;
      }

      await login(username, password);
      addMessage("Account created successfully. Welcome!", "success");
      navigate("/");
    } catch {
      setErrors(["Something went wrong. Please try again."]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <title>Create Account - YouTube Clone</title>

      <div className="auth-container register">

        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join YouTube Clone and start sharing</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>

          {errors.length > 0 && (
            <ul className="error-list">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}

          <div className="form-group">
            <label htmlFor="id_username">Username</label>
            <input
              type="text"
              id="id_username"
              className="form-input"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              maxLength={150}
            />
          </div>

          <div className="form-group">
            <label htmlFor="id_email">Email</label>
            <input
              type="email"
              id="id_email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="id_first_name">First Name</label>
            <input
              type="text"
              id="id_first_name"
              className="form-input"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="id_last_name">Last Name</label>
            <input
              type="text"
              id="id_last_name"
              className="form-input"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="id_password1">Password</label>
            <input
              type="password"
              id="id_password1"
              className="form-input"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="help-text">
              At least 8 characters, not entirely numeric.
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="id_password2">Confirm Password</label>
            <input
              type="password"
              id="id_password2"
              className="form-input"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </>
  );
}
