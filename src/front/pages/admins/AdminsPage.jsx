import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminsPage() {
    const [adminsUser, setAdminsUser] = useState([]);
    const navigate = useNavigate();
    const fetchAdminsUser = async () => {
        const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/admin-user`
        );
        const data = await res.json();
        setAdminsUser(data);
    };

    useEffect(() => {
        fetchAdminsUser();
    }, []);
    const deleteAdminUser = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este admin?")) return;
        const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/admin-user/${id}`,
            { method: "DELETE" }
        );
        if (res.ok) {
            fetchAdminsUser();
        }
    };

    return (
        <div className="container mt-4">
            <div className="position-relative my-4">
                <h1 className="text-center m-0">ADMINS</h1>
                <button className="btn btn-success position-absolute top-50 end-0 translate-middle-y" onClick={() => navigate("/admins-user/new")}>
                    Crear Admin
                </button>
            </div>

            <div className="row">
                {adminsUser.map((c) => (
                    <div key={c.id} className="col-md-4">
                        <div className="card mb-3 shadow-sm">
                            <div className="card-body">
                                <p className="card-text text-center fw-bold"> {c.email} </p>
                                <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    <Link to={`/admins-user/${c.id}`} className="btn btn-light">
                                        Ver ficha
                                    </Link>
                                    <button className="btn btn-light" onClick={() => navigate(`/admins-user/${c.id}/edit`)}>
                                        Editar
                                    </button>
                                    <button className="btn btn-danger" onClick={() => deleteAdminUser(c.id)}>
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {adminsUser.length === 0 && (
                    <p className="text-center mt-5 text-muted"> No hay admins creados</p>
                )}
            </div>
            <div className="text-center mt-4 mb-5">
                <Link to="/" className="btn btn-secondary btn-lg">
                    Volver a inicio
                </Link>
            </div>
        </div>
    );
}
