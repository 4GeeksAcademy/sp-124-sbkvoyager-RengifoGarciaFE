import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function UserDetailPage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const fetchUser = async () => {
        const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`
        );
        const data = await res.json();
        setUser(data);
    };

    useEffect(() => {
        fetchUser();
    }, []);
    if (!user) return <p className="text-center mt-5">Cargando...</p>;
    return (
        <div className="container mt-4">
            <h1>Ficha del Usuario</h1>
            <div className="card mt-4 shadow">
                <div className="card-body">
                    <p><strong>Nickname:</strong> {user.nickname}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Nombre:</strong> {user.name} {user.surname}</p>
                    <p><strong>Bailarín profesional:</strong> {user.is_professional_dancer ? "Sí" : "No"}</p>

                    {user.ubication && (
                        <p><strong>Ubicación:</strong> {user.ubication.city}, {user.ubication.country}</p>
                    )}

                    <Link to="/users" className="btn btn-secondary mt-3">
                        Volver a Users
                    </Link>
                </div>
            </div>
        </div>
    );
}
