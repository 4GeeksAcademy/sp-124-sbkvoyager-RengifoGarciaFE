import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function PostFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        type: "",
        event_date: "",
        schedule: "",
        styles: "",
        name: "",
        contact_number: "",
        owner_name: "",
        description: ""
    });

    useEffect(() => {
        if (isEdit) {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${id}`)
                .then(res => res.json())
                .then(data => {
                    setForm({
                        type: data.type,
                        event_date: data.event_date,
                        schedule: data.schedule,
                        styles: data.styles,
                        name: data.name,
                        contact_number: data.contact_number,
                        owner_name: data.owner_name,
                        description: data.description
                    });
                });
        }
    }, [id]);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();

        const url = isEdit
            ? `${import.meta.env.VITE_BACKEND_URL}/api/posts/${id}`
            : `${import.meta.env.VITE_BACKEND_URL}/api/posts`;

        const method = isEdit ? "PUT" : "POST";

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        navigate("/posts");
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">
                {isEdit ? "Editar Post" : "Crear Post"}
            </h1>

            <form onSubmit={handleSubmit} className="card p-4 shadow mx-auto" style={{ maxWidth: "500px" }}>
                <div className="mb-3">
                    <label className="form-label">Tipo</label>
                    <input
                        name="type"
                        className="form-control"
                        value={form.type}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Fecha del Evento</label>
                    <input
                        name="event_date"
                        type="date"
                        className="form-control"
                        value={form.event_date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Horario</label>
                    <input
                        name="schedule"
                        className="form-control"
                        value={form.schedule}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Estilos</label>
                    <input
                        name="styles"
                        className="form-control"
                        value={form.styles}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Nombre del Evento</label>
                    <input
                        name="name"
                        className="form-control"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Número de Contacto</label>
                    <input
                        name="contact_number"
                        type="number"
                        className="form-control"
                        value={form.contact_number}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Nombre del Dueño</label>
                    <input
                        name="owner_name"
                        className="form-control"
                        value={form.owner_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                        name="description"
                        className="form-control"
                        value={form.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="d-flex justify-content-between">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/posts")}
                    >
                        Cancelar
                    </button>

                    <button type="submit" className="btn btn-success">
                        {isEdit ? "Guardar Cambios" : "Crear Post"}
                    </button>
                </div>
            </form>
        </div>
    );
}
