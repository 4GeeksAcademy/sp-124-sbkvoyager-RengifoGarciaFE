import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function PostFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [ubications, setUbications] = useState([]);

    const [form, setForm] = useState({
        type: "",
        event_date: "",
        schedule: "",
        styles: "",
        name: "",
        contact_number: "",
        owner_name: "",
        description: "",
        ubication_id: ""
    });

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}api/ubications`)
            .then(res => res.json())
            .then(data => setUbications(data));

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
                        description: data.description,
                        ubication_id: data.ubication?.id || ""
                    });
                });
        }
    }, [id, isEdit]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const token = localStorage.getItem("jwt-token");

        if (!token) {
            alert("Debes iniciar sesión para crear un post");
            return;
        }

        const url = isEdit
            ? `${import.meta.env.VITE_BACKEND_URL}api/posts/${id}`
            : `${import.meta.env.VITE_BACKEND_URL}api/posts`;

        const method = isEdit ? "PUT" : "POST";

        await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(form)
        });

        navigate("/posts");
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">
                {isEdit ? "Editar Post" : "Crear Post"}
            </h1>

            <form className="card p-4 shadow mx-auto" style={{ maxWidth: "500px" }} onSubmit={handleSubmit}>

                <select className="form-control mb-3" name="type" value={form.type}	onChange={handleChange}	required>
                    <option value="">Selecciona el tipo</option>
                    <option value="Escuela">Escuela</option>
                    <option value="Sesión">Sesión</option>
                    <option value="Taller">Taller</option>
                </select>
                <input className="form-control mb-3" type="date" name="event_date" value={form.event_date} onChange={handleChange} required />
                <input className="form-control mb-3" name="schedule" placeholder="Horario" value={form.schedule} onChange={handleChange} required />
                <input className="form-control mb-3" name="styles" placeholder="Estilos" value={form.styles} onChange={handleChange} required />
                <input className="form-control mb-3" name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
                <input className="form-control mb-3" name="contact_number" placeholder="Teléfono" value={form.contact_number} onChange={handleChange} required />
                <input className="form-control mb-3" name="owner_name" placeholder="Propietario" value={form.owner_name} onChange={handleChange} required />
                <input className="form-control mb-3" name="description" placeholder="Descripción" value={form.description} onChange={handleChange} required />

                <select className="form-control mb-3" name="ubication_id" value={form.ubication_id} onChange={handleChange} required>
                    <option value="">Selecciona una ubicación</option>

                    {ubications.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.city} ({u.country}) - {u.street} {u.number}
                        </option>
                    ))}
                </select>
                <div className="mb-3">
                    <small>
                        ¿No encuentras la ubicación?{" "}
                        <a href="/ubications/new">Crear nueva ubicación</a>
                    </small>
                </div>

                <div className="d-flex justify-content-between">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/posts")}>
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