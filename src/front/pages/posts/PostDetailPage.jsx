import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostMap from "../../components/PostMap";

export default function PostDetailPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [images, setImages] = useState([]);
	const [currentUser, setCurrentUser] = useState(null);
	const [newComment, setNewComment] = useState("");
	const [newPuntuation, setNewPuntuation] = useState(5);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const adminToken = localStorage.getItem("admin-token");
	const userToken = localStorage.getItem("jwt-token");
	const fetchCurrentUser = async () => {
		if (!userToken) {
			setCurrentUser(null);
			return;
		}
		try {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/me`, {
				headers: {
					Authorization: "Bearer " + userToken
				}
			});

			if (res.status === 401 || res.status === 403 || res.status === 404) {
				localStorage.removeItem("jwt-token");
				setCurrentUser(null);
				return;
			}

			if (!res.ok) {
				setCurrentUser(null);
				return;
			}

			const data = await res.json();
			setCurrentUser(data);
		} catch (err) {
			setCurrentUser(null);
		}
	};
	const loadPostData = async () => {
		try {
			setLoading(true);
			setError("");

			const postResp = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/posts/${id}`);
			if (!postResp.ok) throw new Error("No se pudo cargar el post");
			const postData = await postResp.json();
			setPost(postData);

			const commentsResp = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/posts/${id}/comments`);
			if (!commentsResp.ok) throw new Error("No se pudieron cargar los comentarios");
			const commentsData = await commentsResp.json();
			setComments(commentsData);

			const imagesResp = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/posts/${id}/images`);
			if (!imagesResp.ok) throw new Error("No se pudieron cargar las imágenes");
			const imagesData = await imagesResp.json();
			setImages(imagesData);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadPostData();
		fetchCurrentUser();
	}, [id]);

	const canEditPost = () => {
		if (adminToken) return true;
		if (!currentUser || !post) return false;

		if (post.user && post.user.id) {
			return currentUser.id === post.user.id;
		}

		if (post.user_id) {
			return currentUser.id === post.user_id;
		}
		return false;
	};

	const handleDeletePost = async () => {
		if (!adminToken) {
			alert("Solo un admin puede eliminar posts");
			return;
		}
		const confirmed = window.confirm("¿Seguro que quieres eliminar este post?");
		if (!confirmed) return;

		try {
			const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/posts/${id}`, {
				method: "DELETE",
				headers: {
					Authorization: "Bearer " + adminToken
				}
			});

			const data = await resp.json();

			if (!resp.ok) {
				alert(data.msg || "No se pudo eliminar el post");
				return;
			}
			navigate("/posts");
		} catch (err) {
			alert("Error al eliminar el post");
		}
	};

	const handleDeleteComment = async (commentId) => {
		if (!adminToken) {
			alert("Solo un admin puede eliminar comentarios");
			return;
		}
		const confirmed = window.confirm("¿Seguro que quieres eliminar este comentario?");
		if (!confirmed) return;

		try {
			const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/comments/${commentId}`, {
				method: "DELETE",
				headers: {
					Authorization: "Bearer " + adminToken
				}
			});
			const data = await resp.json();

			if (!resp.ok) {
				alert(data.msg || "No se pudo eliminar el comentario");
				return;
			}
			await loadPostData();
		} catch (err) {
			alert("Error al eliminar el comentario");
		}
	};

	const handleDeleteImage = async (imageId) => {
		if (!adminToken) {
			alert("Solo un admin puede eliminar imágenes");
			return;
		}
		const confirmed = window.confirm("¿Seguro que quieres eliminar esta imagen?");
		if (!confirmed) return;

		try {
			const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/images-post/${imageId}`, {
				method: "DELETE",
				headers: {
					Authorization: "Bearer " + adminToken
				}
			});

			const data = await resp.json();
			if (!resp.ok) {
				alert(data.msg || "No se pudo eliminar la imagen");
				return;
			}

			await loadPostData();
		} catch (err) {
			alert("Error al eliminar la imagen");
		}
	};

	const handleCommentSubmit = async (e) => {
		e.preventDefault();
		if (!userToken) {
			alert("Debes iniciar sesión para comentar");
			return;
		}

		try {
			const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/comments`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + userToken
				},
				body: JSON.stringify({
					text: newComment,
					puntuation: Number(newPuntuation),
					post_id: Number(id)
				})
			});

			if (!resp.ok) {
				const errorData = await resp.json();
				console.error(errorData);
				alert(errorData.msg || "No se pudo crear el comentario");
				return;
			}

			setNewComment("");
			setNewPuntuation(5);
			await loadPostData();
		} catch (err) {
			console.error(err);
			alert("Error del servidor al comentar");
		}
	};

	if (loading) {
		return (
			<div className="container mt-5">
				<p>Cargando...</p>
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
	if (!post) {
		return (
			<div className="container mt-5">
				<div className="alert alert-warning">Post no encontrado</div>
			</div>
		);
	}

	return (
		<div className="container mt-5">
			<div className="row g-4">
				<div className="col-lg-7">
					<div className="card shadow border-0">
						<div className="card-body p-4">
							<div className="d-flex justify-content-between align-items-start mb-3">
								<span className="badge bg-primary">{post.type}</span>
								<div className="d-flex gap-2">
									{canEditPost() && (
										<button className="btn btn-outline-primary btn-sm" onClick={() => navigate(`/posts/${post.id}/edit`)}>
											Editar
										</button>
									)}

									{adminToken && (
										<button className="btn btn-danger btn-sm" onClick={handleDeletePost}>
											Eliminar
										</button>
									)}
								</div>
							</div>
							<h2 className="mb-3">{post.name}</h2>
							<div className="row mb-3">
								<div className="col-md-6">
									<p><strong>Fecha:</strong> {post.event_date}</p>
									<p><strong>Horario:</strong> {post.schedule}</p>
									<p><strong>Estilos:</strong> {post.styles}</p>
								</div>
								<div className="col-md-6">
									<p><strong>Teléfono:</strong> {post.contact_number}</p>
									<p><strong>Propietario/Director:</strong> {post.owner_name}</p>
								</div>
							</div>
							<p><strong>Descripción:</strong></p>
							<p>{post.description}</p>

							{post.ubication && (
								<div className="mt-3">
									<p className="mb-1">
										<strong>Ubicación:</strong> {post.ubication.city}, {post.ubication.country}
									</p>
									<p className="mb-1">
										<strong>Dirección:</strong> {post.ubication.street} {post.ubication.number}
									</p>
									<p className="mb-0">
										<strong>Código postal:</strong> {post.ubication.zip_code}
									</p>
								</div>
							)}

							{post.ubication && <PostMap ubication={post.ubication} />}
						</div>
					</div>
					<div className="card shadow border-0 mt-4">
						<div className="card-body p-4">
							<h3 className="mb-3">Comentarios</h3>
							{comments.length === 0 ? (
								<p className="text-muted">No hay comentarios todavía.</p>
							) : (
								comments.map((comment) => (
									<div key={comment.id} className="border rounded p-3 mb-3 bg-light">
										<div className="d-flex justify-content-between align-items-start gap-2">
											<div>
												<p className="mb-1">{comment.text}</p>
												<p className="mb-1"><strong>Puntuación:</strong> ⭐ {comment.puntuation}</p>
											</div>

											{adminToken && (
												<button className="btn btn-danger btn-sm" onClick={() => handleDeleteComment(comment.id)}>
													Eliminar
												</button>
											)}
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>
				<div className="col-lg-5">
					<div className="card shadow border-0 mb-4">
						<div className="card-body p-4">
							<h3 className="mb-3">Imágenes</h3>
							{images.length === 0 ? (
								<div className="bg-light rounded p-4 text-center text-muted">
									No hay imágenes para este post
								</div>
							) : (
								<div className="d-flex flex-column gap-3">
									{images.map((img) => (
										<div key={img.id} className="position-relative">
											<img src={img.url} alt="Imagen del post" className="img-fluid rounded shadow-sm"
												style={{ maxHeight: "260px", objectFit: "cover", width: "100%" }}/>

											{adminToken && (
												<button className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2" onClick={() => handleDeleteImage(img.id)}>
													Eliminar
												</button>
											)}
										</div>
									))}
								</div>
							)}
						</div>
					</div>
					<div className="card shadow border-0">
						<div className="card-body p-4">
							<h3 className="mb-3">Añadir comentario</h3>
							<form onSubmit={handleCommentSubmit}>
								<div className="mb-3">
									<label className="form-label">Comentario</label>
									<textarea className="form-control" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Escribe tu comentario" required/>
								</div>
								<div className="mb-3">
									<label className="form-label">Puntuación</label>
									<input type="number" min="1" max="5" className="form-control" value={newPuntuation} onChange={(e) => setNewPuntuation(e.target.value)} required/>
								</div>
								<button className="btn btn-primary w-100" type="submit"> Publicar comentario</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}