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
            fetch(`${import.meta.env.VITE_BACKEND_URL}api/posts/${id}`)
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

    const handleChange = e => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const url = isEdit
            ? `${import.meta.env.VITE_BACKEND_URL}api/posts/${id}`
            : `${import.meta.env.VITE_BACKEND_URL}api/posts`;

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

            <form
                onSubmit={handleSubmit}
                className="card p-4 shadow mx-auto"
                style={{ maxWidth: "500px" }}
            >
                <input className="form-control mb-3" name="type" placeholder="Tipo" value={form.type} onChange={handleChange} required />
                <input className="form-control mb-3" name="event_date" type="date" placeholder="Fecha del evento" value={form.event_date} onChange={handleChange} required />
                <input className="form-control mb-3" name="schedule" placeholder="Horario" value={form.schedule} onChange={handleChange} required />
                <input className="form-control mb-3" name="styles" placeholder="Estilos" value={form.styles} onChange={handleChange} required />
                <input className="form-control mb-3" name="name" placeholder="Nombre del evento" value={form.name} onChange={handleChange} required />
                <input className="form-control mb-3" name="contact_number" placeholder="Teléfono de contacto" value={form.contact_number} onChange={handleChange} required />
                <input className="form-control mb-3" name="owner_name" placeholder="Nombre del dueño" value={form.owner_name} onChange={handleChange} required />
                <input className="form-control mb-3" name="description" placeholder="Descripción" value={form.description} onChange={handleChange} required />

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
