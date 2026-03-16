import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaCompass,
  FaSignInAlt,
  FaUserShield,
  FaUserPlus,
  FaUser,
  FaPlusCircle,
  FaTools,
  FaSignOutAlt
} from "react-icons/fa";

export const Navbar = () => {

  const [openMenu, setOpenMenu] = useState(false);
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

        <div className="d-flex align-items-center gap-3">
          <Link to="/posts" className="btn btn-outline-danger">
            <FaCompass className="me-2" />
            Explorar
          </Link>

          <div className="nav-dropdown">
            <button className="btn btn-danger nav-plus-btn" onClick={() => setOpenMenu(!openMenu)}>
              <FaPlus />
            </button>

            {openMenu && (
              <div className="nav-dropdown-menu">
                {!token && !adminToken && (
                  <>
                    <Link to="/login" className="dropdown-item" onClick={() => setOpenMenu(false)}>
                      <FaSignInAlt className="menu-icon"/>
                      Login
                    </Link>

                    <Link to="/admin-login" className="dropdown-item" onClick={() => setOpenMenu(false)}>
                      <FaUserShield className="menu-icon"/>
                      Admin Login
                    </Link>

                    <Link to="/register" className="dropdown-item" onClick={() => setOpenMenu(false)}>
                      <FaUserPlus className="menu-icon"/>
                      Register
                    </Link>
                  </>
                )}

                {token && !adminToken && (
                  <>
                    <Link to="/profile" className="dropdown-item" onClick={() => setOpenMenu(false)}>
                      <FaUser className="menu-icon"/>
                      Perfil
                    </Link>

                    <Link to="/posts/new" className="dropdown-item" onClick={() => setOpenMenu(false)}>
                      <FaPlusCircle className="menu-icon"/>
                      Publicar evento
                    </Link>

                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <FaSignOutAlt className="menu-icon"/>
                      Logout
                    </button>
                  </>
                )}

                {adminToken && !token && (
                  <>
                    <Link to="/admin-panel" className="dropdown-item" onClick={() => setOpenMenu(false)}>
                      <FaTools className="menu-icon"/>
                      Panel Admin
                    </Link>

                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <FaSignOutAlt className="menu-icon"/>
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};