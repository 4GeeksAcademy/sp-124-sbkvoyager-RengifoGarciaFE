import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PostDetailPage() {
	const { id } = useParams();

	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [images, setImages] = useState([]);
	const [newComment, setNewComment] = useState("");
	const [newPuntuation, setNewPuntuation] = useState(5);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

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
	}, [id]);

	const handleCommentSubmit = async (e) => {
		e.preventDefault();

		const token = localStorage.getItem("jwt-token");

		if (!token) {
			alert("Debes iniciar sesión para comentar");
			return;
		}

		try {
			const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/comments`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + token
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
				alert("No se pudo crear el comentario");
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
							<span className="badge bg-primary mb-3">{post.type}</span>
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
								<p className="mt-3">
									<strong>Ubicación:</strong> {post.ubication.city}, {post.ubication.country}
								</p>
							)}
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
										<p className="mb-1">{comment.text}</p>
										<p className="mb-1"><strong>Puntuación:</strong> ⭐ {comment.puntuation}</p>
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
										<img
											key={img.id}
											src={img.url}
											alt="Imagen del post"
											className="img-fluid rounded shadow-sm"
											style={{ maxHeight: "260px", objectFit: "cover", width: "100%" }}
										/>
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
									<textarea
										className="form-control"
										value={newComment}
										onChange={(e) => setNewComment(e.target.value)}
										placeholder="Escribe tu comentario"
										required
									/>
								</div>

								<div className="mb-3">
									<label className="form-label">Puntuación</label>
									<input
										type="number"
										min="1"
										max="5"
										className="form-control"
										value={newPuntuation}
										onChange={(e) => setNewPuntuation(e.target.value)}
										required
									/>
								</div>

								<button className="btn btn-primary w-100" type="submit">
									Publicar comentario
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}