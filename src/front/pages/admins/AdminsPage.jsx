import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminsForm from "../../components/admins/AdminsForm";

export default function AdminsPage() {
    const [adminsUser, setAdminsUser] = useState([]);
    const [editingAdminUser, setEditingAdminUser] = useState(null);

    const fetchAdminsUser = async () => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin-user`);
        const data = await res.json();
        setAdminsUser(data);
    };

    useEffect(() => {
        fetchAdminsUser();
    }, []);

    const deleteAdminUser = async (id) => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin-user/${id}`,
                { method: "DELETE" }
            );

            if (!res.ok) {
                console.error("Error al eliminar admin:", await res.text());
                return;
            }

            // Vuelves a pedir la lista
            fetchAdminsUser();
        } catch (error) {
            console.error("Error en deleteAdmin:", error);
        }
    };


    return (
        <div className="container mt-4">
            <div className="position-relative my-4">
                <h1 className="text-center m-0">ADMINS</h1>

                <button
                    className="btn btn-success position-absolute top-50 end-0 translate-middle-y"
                    onClick={() => setEditingAdminUser({ email: "", password: "" })}
                >
                    Crear Admin
                </button>
            </div>

            <div className="row">
                {adminsUser.map((c) => (
                    <div key={c.id} className="col-md-4">
                        <div className="card mb-3 shadow-sm">
                            <div className="card-body">
                                <p className="card-text text-center">{c.email}</p>
                                <div className="text-center">
                                    <Link to={`/admins-user/${c.id}`} className="btn btn-light me-2 ">
                                        Ver ficha
                                    </Link>

                                    <button className="btn btn-light me-2" onClick={() => setEditingAdminUser(c)}>
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
            </div>

            {editingAdminUser && (
                <AdminsForm
                    adminUser={editingAdminUser}
                    onClose={() => setEditingAdminUser(null)}
                    onUpdated={fetchAdminsUser}
                />
            )}
            <div className="text-center mt-4 mb-5">
                <Link to="/" className="btn btn-secondary btn-lg">
                    Volver a inicio
                </Link>
            </div>

        </div>
    );
}