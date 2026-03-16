import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function AdminDetailPage() {
  const { id } = useParams();
  const [adminUser, setAdminUser] = useState(null);
  const fetchCliente = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin-user/${id}`);
    const data = await res.json();
    setAdminUser(data);
  };

  useEffect(() => {
    fetchCliente();
  }, []);

  if (!adminUser) return <p className="text-center mt-5">Cargando...</p>;

  return (
    <div className="container mt-4">
      <h1>Ficha del Admin</h1>
      <div className="card mt-4 shadow">
        <div className="card-body">
          <p><strong>Email:</strong> {adminUser.email}</p>
          <p><strong>ID:</strong> {adminUser.id}</p>

          <Link to="/admins-user" className="btn btn-secondary mt-3">
            Volver a Admins
          </Link>
        </div>
      </div>
    </div>
  );
}