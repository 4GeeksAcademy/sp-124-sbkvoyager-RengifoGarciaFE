import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CommentFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        text: "",
        puntuation: ""
    });

    useEffect(() => {
        if (isEdit) {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/comments/${id}`)
                .then(res => res.json())
                .then(data => {
                    setForm({
                        text: data.texto,
                        puntuation: data.puntuacion
                    });
                });
        }
    }, [id]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const url = isEdit
            ? `${import.meta.env.VITE_BACKEND_URL}/api/comments/${id}`
            : `${import.meta.env.VITE_BACKEND_URL}/api/comments`;

        const method = isEdit ? "PUT" : "POST";

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text: form.text,
                puntuation: Number(form.puntuation)
            })
        });

        navigate("/comments");
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">
                {isEdit ? "Editar Comentario" : "Crear Comentario"}
            </h1>

            <form
                onSubmit={handleSubmit}
                className="card p-4 shadow mx-auto"
                style={{ maxWidth: "500px" }}
            >
                <input
                    className="form-control mb-3"
                    name="text"
                    placeholder="Texto del comentario"
                    value={form.text}
                    onChange={handleChange}
                    required
                />

                <input
                    className="form-control mb-3"
                    type="number"
                    name="puntuation"
                    placeholder="Puntuación"
                    value={form.puntuation}
                    onChange={handleChange}
                    required
                />

                <div className="d-flex justify-content-between">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/comments")}
                    >
                        Cancelar
                    </button>

                    <button type="submit" className="btn btn-info">
                        {isEdit ? "Guardar Cambios" : "Crear Comentario"}
                    </button>
                </div>
            </form>
        </div>
    );
}
