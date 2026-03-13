import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const location = useLocation();
  const token = localStorage.getItem("jwt-token");

  const handleLogout = () => {
    localStorage.removeItem("jwt-token");
    window.location.href = "/";
  };

  const isAdminsPage = location.pathname.startsWith("/admins-user");
  const isUbicationsPage = location.pathname.startsWith("/ubications");
  const isUsersPage = location.pathname.startsWith("/users");
  const isPostsPage = location.pathname.startsWith("/posts");
  const isImagesPage = location.pathname.startsWith("/images-post");
  const isCommentsPage = location.pathname.startsWith("/comments");
  const isProfilePage = location.pathname.startsWith("/profile");
  const isLoginPage = location.pathname.startsWith("/login");

  return (
    <nav className="navbar navbar-expand-lg bg-light border-bottom">
      <div className="container py-3">
        <Link to="/" className="navbar-brand fw-bold fs-3">
          SBKVoyager
        </Link>

        <div className="d-flex flex-wrap gap-2 justify-content-center">
          {!isPostsPage && (
            <Link to="/posts" className="btn btn-info">
              Posts
            </Link>
          )}

          {!isUbicationsPage && (
            <Link to="/ubications" className="btn btn-primary">
              Ubications
            </Link>
          )}

          {!isUsersPage && (
            <Link to="/users" className="btn btn-warning">
              Users
            </Link>
          )}

          {!isCommentsPage && (
            <Link to="/comments" className="btn btn-secondary">
              Comments
            </Link>
          )}

          {!isImagesPage && (
            <Link to="/images-post" className="btn btn-dark">
              Images
            </Link>
          )}

          {!isAdminsPage && (
            <Link to="/admins-user" className="btn btn-success">
              Admins
            </Link>
          )}

          {!token ? (
            !isLoginPage && (
              <Link to="/login" className="btn btn-outline-primary">
                Login
              </Link>
            )
          ) : (
            <>
              {!isProfilePage && (
                <Link to="/profile" className="btn btn-outline-success">
                  Profile
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-outline-danger">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};