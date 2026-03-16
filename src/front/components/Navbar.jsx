import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const [token, setToken] = useState(localStorage.getItem("jwt-token"));
  const [adminToken, setAdminToken] = useState(localStorage.getItem("admin-token"));

  useEffect(() => {
    const syncAuth = () => {
      setToken(localStorage.getItem("jwt-token"));
      setAdminToken(localStorage.getItem("admin-token"));
    };

    window.addEventListener("auth-changed", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("auth-changed", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("admin-token");
    window.dispatchEvent(new Event("auth-changed"));
    window.location.href = "/";
  };

  return (
    <nav className="navbar navbar-expand-lg bg-light shadow-sm">
      <div className="container">

        <Link to="/" className="navbar-brand fw-bold fs-4">
          SBKVoyager
        </Link>

        <div className="d-flex gap-2 flex-wrap">

          <Link to="/posts" className="btn btn-outline-primary">
            Explorar
          </Link>

          {!adminToken ? (
            <Link to="/admin-login" className="btn btn-outline-warning">
              Admin Login
            </Link>
          ) : (
            <Link to="/admin-panel" className="btn btn-outline-warning">
              Admin Panel
            </Link>
          )}

          {token && (
            <Link to="/posts/new" className="btn btn-outline-success">
              Crear Post
            </Link>
          )}

          {token && (
            <Link to="/profile" className="btn btn-outline-dark">
              Perfil
            </Link>
          )}

          {!token ? (
            <>
              <Link to="/register" className="btn btn-outline-secondary">
                Register
              </Link>
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  );
};