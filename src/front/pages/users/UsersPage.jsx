import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/users`
        );
        const data = await res.json();
        setUsers(data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;

        const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`,
            { method: "DELETE" }
        );

        if (res.ok) {
            fetchUsers();
        }
    };

    return (
        <div className="container mt-4">
            {/* Header */}
            <div className="position-relative my-4">
                <h1 className="text-center m-0">USERS</h1>

                <button
                    className="btn btn-warning position-absolute top-50 end-0 translate-middle-y"
                    onClick={() => navigate("/users/new")}
                >
                    Crear Usuario
                </button>
            </div>

            {/* Listado */}
            <div className="row">
                {users.map((u) => (
                    <div key={u.id} className="col-md-4">
                        <div className="card mb-3 shadow-sm">
                            <div className="card-body">
                                <p className="card-text text-center fw-bold">
                                    {u.nickname}
                                </p>

                                <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    <Link
                                        to={`/users/${u.id}`}
                                        className="btn btn-light"
                                    >
                                        Ver ficha
                                    </Link>

                                    <button
                                        className="btn btn-light"
                                        onClick={() =>
                                            navigate(`/users/${u.id}/edit`)
                                        }
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="btn btn-danger"
                                        onClick={() => deleteUser(u.id)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {users.length === 0 && (
                    <p className="text-center mt-5 text-muted">
                        No hay usuarios creados
                    </p>
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
