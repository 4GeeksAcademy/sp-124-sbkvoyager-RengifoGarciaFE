import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PostDetailPage() {
	const { id } = useParams();

	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");
	const [newPuntuation, setNewPuntuation] = useState(5);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	const loadPostData = async () => {
		try {
			setLoading(true);
			setError("");

			const postResp = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/posts/${id}`);
			if (!postResp.ok) {
				throw new Error("No se pudo cargar el post");
			}
			const postData = await postResp.json();
			setPost(postData);

			const commentsResp = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/posts/${id}/comments`);
			if (!commentsResp.ok) {
				throw new Error("No se pudieron cargar los comentarios");
			}
			const commentsData = await commentsResp.json();
			setComments(commentsData);
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
		return <div className="container mt-5"><p>Cargando...</p></div>;
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
			<div className="card shadow p-4 mb-4">
				<h2 className="mb-3">{post.name}</h2>

				<p><strong>Tipo:</strong> {post.type}</p>
				<p><strong>Fecha:</strong> {post.event_date}</p>
				<p><strong>Horario:</strong> {post.schedule}</p>
				<p><strong>Estilos:</strong> {post.styles}</p>
				<p><strong>Teléfono:</strong> {post.contact_number}</p>
				<p><strong>Propietario/Director:</strong> {post.owner_name}</p>
				<p><strong>Descripción:</strong> {post.description}</p>

				{post.ubication && (
					<p>
						<strong>Ubicación:</strong>{" "}
						{post.ubication.city}, {post.ubication.country}
					</p>
				)}

				{post.user && (
					<p>
						<strong>Publicado por:</strong> {post.user.nickname}
					</p>
				)}
			</div>

			<div className="card shadow p-4 mb-4">
				<h3 className="mb-3">Comentarios</h3>

				{comments.length === 0 ? (
					<p>No hay comentarios todavía.</p>
				) : (
					comments.map((comment) => (
						<div key={comment.id} className="border rounded p-3 mb-3">
							<p className="mb-1">{comment.text}</p>
							<p className="mb-1"><strong>Puntuación:</strong> ⭐ {comment.puntuation}</p>

							{comment.user && (
								<small className="text-muted">
									Usuario: {comment.user.nickname}
								</small>
							)}
						</div>
					))
				)}
			</div>

			<div className="card shadow p-4">
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

					<button className="btn btn-primary" type="submit">
						Publicar comentario
					</button>
				</form>
			</div>
		</div>
	);
}