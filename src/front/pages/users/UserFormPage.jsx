import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UserFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [ubications, setUbications] = useState([]);
    const [form, setForm] = useState({
        nickname: "",
        email: "",
        password: "",
        name: "",
        surname: "",
        birthdate: "",
        is_professional_dancer: false,
        ubication_id: ""
    });

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ubications`)
            .then(res => res.json())
            .then(data => setUbications(data));

        if (isEdit) {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`)
                .then(res => res.json())
                .then(data => {
                    setForm({
                        nickname: data.nickname,
                        email: data.email,
                        password: "",
                        name: data.name,
                        surname: data.surname,
                        birthdate: data.birthdate,
                        is_professional_dancer: data.is_professional_dancer,
                        ubication_id: data.ubication?.id || ""
                    });
                });
        }
    }, [id]);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const url = isEdit
            ? `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`
            : `${import.meta.env.VITE_BACKEND_URL}/api/users`;

        const method = isEdit ? "PUT" : "POST";
        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });
        navigate("/users");
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">{isEdit ? "Editar Usuario" : "Crear Usuario"} </h1>
            <form onSubmit={handleSubmit} className="card p-4 shadow mx-auto" style={{ maxWidth: "500px" }}>
                <input className="form-control mb-3" name="nickname" placeholder="Nickname" value={form.nickname} onChange={handleChange} required/>
                <input className="form-control mb-3" name="email" placeholder="Email" value={form.email} onChange={handleChange} required/>
                {!isEdit && (
                    <input className="form-control mb-3" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required/>
                )}
                <input className="form-control mb-3" name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required/>
                <input className="form-control mb-3" name="surname" placeholder="Apellidos" value={form.surname} onChange={handleChange} required/>
                <input className="form-control mb-3" type="date" name="birthdate" value={form.birthdate} onChange={handleChange} required/>
                <select className="form-control mb-3" name="ubication_id" value={form.ubication_id} onChange={handleChange} required>
                    <option value="">Selecciona una ubicación</option>
                    {ubications.map(u => (
                        <option key={u.id} value={u.id}> {u.city} ({u.country}) </option>
                    ))}
                </select>

                <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" name="is_professional_dancer" checked={form.is_professional_dancer} onChange={handleChange}/>
                    <label className="form-check-label"> Bailarín profesional</label>
                </div>

                <div className="d-flex justify-content-between">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/users")}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-warning">
                        {isEdit ? "Guardar Cambios" : "Crear Usuario"}
                    </button>
                </div>
            </form>
        </div>
    );
}
