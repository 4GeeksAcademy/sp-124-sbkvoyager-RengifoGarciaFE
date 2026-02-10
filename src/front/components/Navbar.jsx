import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const location = useLocation();

  const isAdminsPage = location.pathname.startsWith("/admins-user");
  const isUbicationsPage = location.pathname.startsWith("/ubications");
  const isUsersPage = location.pathname.startsWith("/users");

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

      </div>
    </nav>
  );
};

