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

  return (
    <nav className="navbar">
      <div className="text-center mt-5">

        {!isAdminsPage && (
          <Link to="/admins-user" className="btn btn-success btn-lg m-2">
            Admins
          </Link>
        )}

        {!isUbicationsPage && (
          <Link to="/ubications" className="btn btn-primary btn-lg m-2">
            Ubications
          </Link>
        )}

        {!isUsersPage && (
          <Link to="/users" className="btn btn-warning btn-lg m-2">
            Users
          </Link>
        )}

        {!isPostsPage && (
          <Link to="/posts" className="btn btn-info btn-lg m-2">
            Posts
          </Link>
        )}

        {!isImagesPage && (
          <Link to="/images-post" className="btn btn-dark btn-lg m-2">
            Images
          </Link>
        )}

        {!isCommentsPage && (
          <Link to="/comments" className="btn btn-secondary btn-lg m-2">
            Comments
          </Link>
        )}

        {/* LOGIN / LOGOUT */}

        {!token ? (
          <Link to="/login" className="btn btn-outline-primary btn-lg m-2">
            Login
          </Link>
        ) : (
          <>
          <Link to="/profile" className="btn btn-outline-success btn-lg m-2">
            Profile
          </Link>

            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-lg m-2"
            >
              Logout
            </button>
          </>
        )}

      </div>
    </nav>
  );
};