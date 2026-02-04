import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    useEffect(() => {
        if (isEdit) {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin-user/${id}`)
                .then(res => res.json())
                .then(data => {
                    setForm({ email: data.email, password: "" });
                });
        }
    }, [id]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const url = isEdit
            ? `${import.meta.env.VITE_BACKEND_URL}/api/admin-user/${id}`
            : `${import.meta.env.VITE_BACKEND_URL}/api/admin-user`;

        const method = isEdit ? "PUT" : "POST";

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        navigate("/admins-user");
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">
                {isEdit ? "Editar Admin" : "Crear Admin"}
            </h1>

            <form onSubmit={handleSubmit} className="card p-4 shadow mx-auto" style={{ maxWidth: "500px" }}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        name="email"
                        className="form-control"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                {!isEdit && (
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            name="password"
                            type="password"
                            className="form-control"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}

                <div className="d-flex justify-content-between">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/admins-user")}
                    >
                        Cancelar
                    </button>

                    <button type="submit" className="btn btn-success">
                        {isEdit ? "Guardar Cambios" : "Crear Admin"}
                    </button>
                </div>
            </form>
        </div>
    );
}
