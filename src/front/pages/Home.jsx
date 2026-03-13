import { Link } from "react-router-dom";

export const Home = () => {
	const token = localStorage.getItem("jwt-token");

	return (
		<div className="container py-5">
			<div className="row align-items-center mb-5">
				<div className="col-lg-7">
					<h1 className="display-4 fw-bold mb-3">SBKVoyager</h1>
					<p className="lead text-muted mb-4">
						Encuentra escuelas, sesiones, talleres y lugares donde bailar salsa,
						bachata y kizomba. Comparte tus sitios favoritos y descubre nuevos
						planes de baile.
					</p>

					<div className="d-flex flex-wrap gap-3">
						<Link to="/posts" className="btn btn-primary btn-lg">
							Explorar publicaciones
						</Link>

						{token ? (
							<>
								<Link to="/posts/new" className="btn btn-success btn-lg">
									Crear publicación
								</Link>
								<Link to="/profile" className="btn btn-outline-dark btn-lg">
									Mi perfil
								</Link>
							</>
						) : (
							<Link to="/login" className="btn btn-outline-primary btn-lg">
								Iniciar sesión
							</Link>
						)}
					</div>
				</div>

				<div className="col-lg-5 mt-4 mt-lg-0">
					<div className="card shadow border-0">
						<div className="card-body p-4">
							<h4 className="mb-3">¿Qué puedes hacer?</h4>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">📍 Encontrar lugares para bailar</li>
								<li className="list-group-item">📝 Publicar escuelas, sesiones y talleres</li>
								<li className="list-group-item">💬 Leer y dejar comentarios</li>
								<li className="list-group-item">⭐ Valorar experiencias</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<div className="row g-4">
				<div className="col-md-4">
					<div className="card h-100 shadow-sm border-0">
						<div className="card-body">
							<h5 className="card-title">Escuelas</h5>
							<p className="card-text text-muted">
								Encuentra academias y escuelas donde aprender y mejorar tu baile.
							</p>
						</div>
					</div>
				</div>

				<div className="col-md-4">
					<div className="card h-100 shadow-sm border-0">
						<div className="card-body">
							<h5 className="card-title">Sesiones y fiestas</h5>
							<p className="card-text text-muted">
								Descubre sociales, fiestas y sesiones para salir a bailar.
							</p>
						</div>
					</div>
				</div>

				<div className="col-md-4">
					<div className="card h-100 shadow-sm border-0">
						<div className="card-body">
							<h5 className="card-title">Comunidad</h5>
							<p className="card-text text-muted">
								Comparte opiniones, deja comentarios y ayuda a otros bailarines.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};