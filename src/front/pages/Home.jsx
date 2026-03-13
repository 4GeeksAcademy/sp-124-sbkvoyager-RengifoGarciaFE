import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Home = () => {
	const token = localStorage.getItem("jwt-token");
	const [posts, setPosts] = useState([]);
	const [postImages, setPostImages] = useState({});

	useEffect(() => {
		const loadPostsAndImages = async () => {
			try {
				const postsResp = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/posts`);
				const postsData = await postsResp.json();

				setPosts(postsData);

				const imagesMap = {};

				await Promise.all(
					postsData.slice(0, 6).map(async (post) => {
						try {
							const imgResp = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/posts/${post.id}/images`);
							const imgData = await imgResp.json();

							if (imgData.length > 0) {
								imagesMap[post.id] = imgData[0].url;
							}
						} catch (err) {
							console.error(`Error loading images for post ${post.id}`, err);
						}
					})
				);

				setPostImages(imagesMap);
			} catch (err) {
				console.error("Error loading posts:", err);
			}
		};

		loadPostsAndImages();
	}, []);

	const placeholderImage =
		"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80";

	return (
		<div className="container py-5">
			{/* HERO */}
			<div className="row align-items-center mb-5">
				<div className="col-lg-7">
					<h1 className="display-4 fw-bold mb-3">SBKVoyager</h1>
					<p className="lead text-muted mb-4">
						Descubre escuelas, sesiones, talleres y lugares donde bailar salsa,
						bachata y kizomba. Comparte tus sitios favoritos y encuentra nuevos
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
								<li className="list-group-item">📍 Encontrar sitios para bailar</li>
								<li className="list-group-item">📝 Publicar escuelas, sesiones y talleres</li>
								<li className="list-group-item">💬 Comentar experiencias</li>
								<li className="list-group-item">⭐ Valorar lugares y eventos</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			{/* INFO CARDS */}
			<div className="row g-4 mb-5">
				<div className="col-md-4">
					<div className="card h-100 shadow-sm border-0">
						<div className="card-body">
							<h5 className="card-title">Escuelas</h5>
							<p className="card-text text-muted">
								Encuentra academias y escuelas para aprender y mejorar tu baile.
							</p>
						</div>
					</div>
				</div>

				<div className="col-md-4">
					<div className="card h-100 shadow-sm border-0">
						<div className="card-body">
							<h5 className="card-title">Sesiones y fiestas</h5>
							<p className="card-text text-muted">
								Descubre sociales, fiestas y eventos para salir a bailar.
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

			{/* POSTS */}
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h2 className="mb-0">Últimas publicaciones</h2>
				<Link to="/posts" className="btn btn-outline-primary">
					Ver todas
				</Link>
			</div>

			<div className="row g-4">
				{posts.length === 0 ? (
					<div className="col-12">
						<div className="alert alert-light border">
							Aún no hay publicaciones disponibles.
						</div>
					</div>
				) : (
					posts.slice(0, 6).map((post) => (
						<div key={post.id} className="col-md-6 col-lg-4">
							<div className="card h-100 shadow-sm border-0 overflow-hidden">
								<img
									src={postImages[post.id] || placeholderImage}
									alt={post.name}
									className="card-img-top"
									style={{ height: "220px", objectFit: "cover" }}
								/>

								<div className="card-body d-flex flex-column">
									<span className="badge bg-primary mb-2 align-self-start">
										{post.type}
									</span>

									<h5 className="card-title">{post.name}</h5>

									<p className="card-text text-muted mb-2">
										{post.styles}
									</p>

									<p className="card-text">
										<strong>Horario:</strong> {post.schedule}
									</p>

									<p className="card-text text-muted small flex-grow-1">
										{post.description}
									</p>

									<Link
										to={`/posts/${post.id}`}
										className="btn btn-primary mt-auto"
									>
										Ver detalle
									</Link>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};