import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {

	const location = useLocation();
  	const isAdminsPage = location.pathname.startsWith("/admins-user");

	return (
		<nav className="navbar">
			<div className="text-center mt-5">

			{!isAdminsPage && (
				<Link to="/admins-user" className="btn btn-success btn-lg m-2">
				Admins
				</Link>
			)}

			</div>
		</nav>
	);
	};