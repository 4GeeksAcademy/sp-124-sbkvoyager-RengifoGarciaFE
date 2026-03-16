import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ImageFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [posts, setPosts] = useState([]);
    const [form, setForm] = useState({
        url: "",
        post_id: ""
    });

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}api/posts`)
            .then(res => res.json())
            .then(data => setPosts(data));

        if (isEdit) {
            fetch(`${import.meta.env.VITE_BACKEND_URL}api/images-post/${id}`)
                .then(res => res.json())
                .then(data => {
                    setForm({
                        url: data.url,
                        post_id: data.post?.id || ""
                    });
                });
        }
    }, [id]);
    const handleChange = e => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };
    const handleSubmit = async e => {
        e.preventDefault();
        const url = isEdit
            ? `${import.meta.env.VITE_BACKEND_URL}api/images-post/${id}`
            : `${import.meta.env.VITE_BACKEND_URL}api/images-post`;

        const method = isEdit ? "PUT" : "POST";

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });
        navigate("/images-post");
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">{isEdit ? "Editar Imagen" : "Crear Imagen"}</h1>
            <form className="card p-4 shadow mx-auto" style={{ maxWidth: "500px" }} onSubmit={handleSubmit}>
                <input className="form-control mb-3" name="url" placeholder="URL de la imagen" value={form.url} onChange={handleChange} required/>
                <select className="form-control mb-3" name="post_id" value={form.post_id} onChange={handleChange} required>
                    <option value="">Selecciona un post</option>
                    {posts.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>
                <div className="d-flex justify-content-between">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/images-post")}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-success">
                        {isEdit ? "Guardar Cambios" : "Crear Imagen"}
                    </button>
                </div>
            </form>
        </div>
    );
}
