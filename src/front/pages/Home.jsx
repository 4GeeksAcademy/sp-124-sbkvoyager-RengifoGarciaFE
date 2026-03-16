import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaPenFancy, FaComments, FaMusic } from "react-icons/fa";
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
							console.error(err);
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
			<div className="hero-home mb-5">
				<div className="row align-items-center">
					<div className="col-lg-7">
						<h1 className="hero-title">SBKVoyager</h1>
						<p className="hero-subtitle">
							Descubre escuelas, sesiones y talleres donde bailar salsa,
							bachata y kizomba. Encuentra tu próximo plan de baile.
						</p>
						<div className="d-flex flex-wrap gap-3 mt-4">
							<Link to="/posts" className="btn btn-danger btn-lg">
								Explorar
							</Link>
							{token ? (
								<>
									<Link to="/posts/new" className="btn btn-outline-danger btn-lg">
										Publicar evento
									</Link>
								</>
							) : (
								<Link to="/login" className="btn btn-outline-dark btn-lg">
									Iniciar sesión
								</Link>
							)}
						</div>
					</div>
					<div className="col-lg-5 mt-4 mt-lg-0">
						<div className="feature-card-main">
							<h4 className="mb-4">¿Qué puedes hacer?</h4>
							<div className="d-flex align-items-center mb-3 feature-line">
								<FaMapMarkerAlt className="feature-icon" />
								<span>Encontrar sitios donde bailar</span>
							</div>
							<div className="d-flex align-items-center mb-3 feature-line">
								<FaPenFancy className="feature-icon" />
								<span>Publicar escuelas, sesiones y talleres</span>
							</div>
							<div className="d-flex align-items-center mb-3 feature-line">
								<FaComments className="feature-icon" />
								<span>Compartir opiniones y experiencias</span>
							</div>
							<div className="d-flex align-items-center feature-line">
								<FaMusic className="feature-icon" />
								<span>Explorar la comunidad SBK</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="row g-4 mb-5">
				<div className="col-md-4">
					<div className="info-card-home">
						<h5>Escuelas</h5>
						<p>Encuentra academias y espacios para aprender y mejorar tu baile.</p>
					</div>
				</div>
				<div className="col-md-4">
					<div className="info-card-home">
						<h5>Sesiones y fiestas</h5>
						<p>Descubre sociales, fiestas y eventos para salir a bailar.</p>
					</div>
				</div>
				<div className="col-md-4">
					<div className="info-card-home">
						<h5>Comunidad</h5>
						<p>Comparte opiniones y ayuda a otros bailarines con tus experiencias.</p>
					</div>
				</div>
			</div>
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h2 className="section-title">¿Dónde bailar hoy?</h2>
				<Link to="/posts" className="btn btn-outline-danger">
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
							<div className="post-card-home h-100">
								<img src={postImages[post.id] || placeholderImage} alt={post.name} className="post-card-home-img"/>
								<div className="p-3 d-flex flex-column h-100">
									<span className="badge bg-danger mb-2 align-self-start">
										{post.type}
									</span>

									<h5>{post.name}</h5>
									<p className="text-muted mb-2">{post.styles}</p>
									<p><strong>Horario:</strong> {post.schedule}</p>
									<Link to={`/posts/${post.id}`} className="btn btn-danger mt-auto">
										¡Ver más!
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