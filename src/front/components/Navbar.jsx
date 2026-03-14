import { Link } from "react-router-dom";

export const Navbar = () => {
  const token = localStorage.getItem("jwt-token");
  const adminToken = localStorage.getItem("admin-token");

  const handleLogout = () => {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("admin-token");
    window.location.href = "/";
  };

  return (
    <nav className="navbar navbar-expand-lg bg-light shadow-sm">
      <div className="container">

        <Link to="/" className="navbar-brand fw-bold fs-4">
          SBKVoyager
        </Link>

        <div className="d-flex gap-2">

          <Link to="/posts" className="btn btn-outline-primary">
            Explorar
          </Link>

          {adminToken && (
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