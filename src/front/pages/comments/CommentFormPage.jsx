import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CommentFormPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const isEdit = Boolean(id);
	const [posts, setPosts] = useState([]);
	const [form, setForm] = useState({
		text: "",
		puntuation: 1,
		post_id: ""
	});

	useEffect(() => {
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts`)
			.then(res => res.json())
			.then(data => setPosts(data));

		if (isEdit) {
			fetch(`${import.meta.env.VITE_BACKEND_URL}/api/comments/${id}`)
				.then(res => res.json())
				.then(data => {
					setForm({
						text: data.text || "",
						puntuation: data.puntuation || 1,
						post_id: data.post?.id || data.post_id || ""
					});
				});
		}
	}, [id, isEdit]);

	const handleChange = e => {
		const { name, value } = e.target;
		setForm({
			...form,
			[name]:
				name === "puntuation" || name === "post_id"
					? Number(value)
					: value
		});
	};

	const handleSubmit = async e => {
		e.preventDefault();
		const token = localStorage.getItem("jwt-token");
		if (!token) {
			alert("Debes iniciar sesión para crear un comentario");
			return;
		}
		const url = isEdit
			? `${import.meta.env.VITE_BACKEND_URL}/api/comments/${id}`
			: `${import.meta.env.VITE_BACKEND_URL}/api/comments`;

		const method = isEdit ? "PUT" : "POST";
		const resp = await fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + token
			},
			body: JSON.stringify(form)
		});

		if (!resp.ok) {
			const errorData = await resp.json();
			console.error("Error al guardar comentario:", errorData);
			alert("No se pudo guardar el comentario");
			return;
		}
		navigate("/comments");
	};

	return (
		<div className="container mt-5">
			<h2 className="mb-4">{isEdit ? "Editar Comentario" : "Crear Comentario"}</h2>
			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<label className="form-label">Texto</label>
					<textarea className="form-control" name="text" value={form.text} onChange={handleChange} required/>
				</div>
				<div className="mb-3">
					<label className="form-label">Puntuación</label>
					<input type="number" min="1" max="5" className="form-control" name="puntuation" value={form.puntuation} onChange={handleChange} required/>
				</div>
				<div className="mb-3">
					<label className="form-label">Selecciona un post</label>
					<select className="form-select" name="post_id" value={form.post_id} onChange={handleChange} required>
						<option value="">-- Elige un post --</option>
						{posts.map(post => (
							<option key={post.id} value={post.id}>
								{post.name} - {post.type}
							</option>
						))}
					</select>
				</div>
				<div className="d-flex justify-content-between">
					<button type="button" className="btn btn-secondary" onClick={() => navigate("/comments")}>
						Cancelar
					</button>

					<button type="submit" className="btn btn-warning">
						{isEdit ? "Guardar Cambios" : "Crear"}
					</button>
				</div>
			</form>
		</div>
	);
}