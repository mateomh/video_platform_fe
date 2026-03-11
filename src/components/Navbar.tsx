import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import { useMessages } from "./context/useMessages";
import "../assets/stylesheets/navbar.css";


export default function Navbar() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const { addMessage } = useMessages();
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    await logout();
    addMessage("You have been logged out.", "success");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">▶</span>
        VideoUpload
      </Link>

      <ul className="navbar-nav">
        {isLoading ? null : isAuthenticated ? (
          <>
            <li>
              <Link to="/upload" className="nav-link btn-upload">
                Upload
              </Link>
            </li>

            <li>
              <span className="nav-username">{user?.username}</span>
            </li>

            <li>
              <button
                onClick={handleLogout}
                className="nav-link btn-outline logout-btn"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="nav-link">
                Sign In
              </Link>
            </li>
            <li>
              <Link to="/register" className="nav-link btn-primary">
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
