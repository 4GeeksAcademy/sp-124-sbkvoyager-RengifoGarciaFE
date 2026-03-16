import { useEffect, useState } from "react";

export default function ProfilePage() {
	const [user, setUser] = useState(null);
	const [posts, setPosts] = useState([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("jwt-token");

		if (!token) {
			setError("Debes iniciar sesión");
			setLoading(false);
			return;
		}

		const loadProfile = async () => {
			try {
				const userResp = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/me`, {
					headers: {
						"Authorization": "Bearer " + token
					}
		});

		if (userResp.status === 401 || userResp.status === 403 || userResp.status === 404) {
			localStorage.removeItem("jwt-token");
			window.location.href = "/login";
			return;
		}

		if (!userResp.ok) {
			throw new Error("No se pudo cargar el perfil");
		}

				const userData = await userResp.json();
				setUser(userData);

				const postsResp = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/posts`);
				if (!postsResp.ok) {
					throw new Error("No se pudieron cargar los posts");
				}

				const postsData = await postsResp.json();

				const myPosts = postsData.filter(post => {
					if (post.user && post.user.id) return post.user.id === userData.id;
					if (post.user_id) return post.user_id === userData.id;
					return false;
				});

				setPosts(myPosts);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		loadProfile();
	}, []);

	if (loading) {
		return (
			<div className="container mt-5">
				<p>Cargando perfil...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mt-5">
				<div className="alert alert-danger">{error}</div>
			</div>
		);
	}

	return (
		<div className="container mt-5">
			<div className="card shadow border-0 mb-4">
				<div className="card-body p-4">
					<h2 className="mb-3">Mi perfil</h2>

					<p><strong>Nickname:</strong> {user?.nickname}</p>
					<p><strong>Email:</strong> {user?.email}</p>
					<p><strong>Nombre:</strong> {user?.name}</p>
					<p><strong>Apellido:</strong> {user?.surname}</p>
				</div>
			</div>

			<div className="card shadow border-0">
				<div className="card-body p-4">
					<h3 className="mb-3">Mis publicaciones</h3>

					{posts.length === 0 ? (
						<p className="text-muted">No tienes publicaciones todavía.</p>
					) : (
						<div className="row g-3">
							{posts.map(post => (
								<div key={post.id} className="col-md-6">
                                    <div className="border rounded p-3 h-100 bg-light">
                                        <h5>{post.name}</h5>
                                        <p className="mb-1"><strong>Tipo:</strong> {post.type}</p>
                                        <p className="mb-1"><strong>Estilos:</strong> {post.styles}</p>
                                        <p className="mb-3"><strong>Horario:</strong> {post.schedule}</p>

                                        <div className="d-flex gap-2 flex-wrap">
											<a
												href={`/posts/${post.id}`}
												className="btn btn-sm btn-outline-primary"
											>
												Ver detalle
											</a>

											<a
												href={`/posts/${post.id}/edit`}
												className="btn btn-sm btn-outline-success"
											>
												Editar
											</a>
										</div>
                                    </div>
                                </div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}