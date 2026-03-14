import { useEffect, useState } from "react";

export default function AdminPanelPage() {
	const [posts, setPosts] = useState([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	const loadPendingPosts = async () => {
		const token = localStorage.getItem("admin-token");

		if (!token) {
			setError("Debes iniciar sesión como admin");
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError("");

			const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/admin/posts/pending`, {
				headers: {
					"Authorization": "Bearer " + token
				}
			});

			const data = await resp.json();

			if (!resp.ok) {
				throw new Error(data.msg || "No se pudieron cargar los posts pendientes");
			}

			setPosts(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadPendingPosts();
	}, []);

	const handleApprove = async (postId) => {
		const token = localStorage.getItem("admin-token");

		try {
			const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/admin/posts/${postId}/approve`, {
				method: "PUT",
				headers: {
					"Authorization": "Bearer " + token
				}
			});

			const data = await resp.json();

			if (!resp.ok) {
				throw new Error(data.msg || "No se pudo aprobar el post");
			}

			await loadPendingPosts();
		} catch (err) {
			alert(err.message);
		}
	};

	const handleDelete = async (postId) => {
		const token = localStorage.getItem("admin-token");

		const confirmed = window.confirm("¿Seguro que quieres eliminar este post?");
		if (!confirmed) return;

		try {
			const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/admin/posts/${postId}`, {
				method: "DELETE",
				headers: {
					"Authorization": "Bearer " + token
				}
			});

			const data = await resp.json();

			if (!resp.ok) {
				throw new Error(data.msg || "No se pudo eliminar el post");
			}

			await loadPendingPosts();
		} catch (err) {
			alert(err.message);
		}
	};

	if (loading) {
		return (
			<div className="container mt-5">
				<p>Cargando panel admin...</p>
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
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h1>Panel Admin</h1>
			</div>

			<div className="card shadow border-0">
				<div className="card-body p-4">
					<h3 className="mb-3">Posts pendientes de aprobación</h3>

					{posts.length === 0 ? (
						<p className="text-muted mb-0">No hay posts pendientes.</p>
					) : (
						<div className="row g-3">
							{posts.map((post) => (
								<div key={post.id} className="col-md-6">
									<div className="border rounded p-3 h-100 bg-light">
										<h5>{post.name}</h5>
										<p className="mb-1"><strong>Tipo:</strong> {post.type}</p>
										<p className="mb-1"><strong>Estilos:</strong> {post.styles}</p>
										<p className="mb-1"><strong>Horario:</strong> {post.schedule}</p>
										<p className="mb-3"><strong>Descripción:</strong> {post.description}</p>

										<div className="d-flex gap-2">
											<button
												className="btn btn-success btn-sm"
												onClick={() => handleApprove(post.id)}
											>
												Aprobar
											</button>

											<button
												className="btn btn-danger btn-sm"
												onClick={() => handleDelete(post.id)}
											>
												Eliminar
											</button>
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