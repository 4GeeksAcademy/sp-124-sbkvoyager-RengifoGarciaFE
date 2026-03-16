import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function UbicationDetailPage() {
  const { id } = useParams();
  const [ubication, setUbication] = useState(null);
  const fetchUbication = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/ubications/${id}`);
    const data = await res.json();
    setUbication(data);
  };
  useEffect(() => {
    fetchUbication();
  }, [id]);

  if (!ubication) return <p className="text-center mt-5">Cargando...</p>;

  return (
    <div className="container mt-4">
      <h1>Ficha de Ubicación</h1>
      <div className="card mt-4 shadow">
        <div className="card-body">
          <p><strong>País:</strong> {ubication.country}</p>
          <p><strong>Ciudad:</strong> {ubication.city}</p>
          <p><strong>Código Postal:</strong> {ubication.zip_code}</p>
          <p><strong>Calle:</strong> {ubication.street}</p>
          <p><strong>Número:</strong> {ubication.number}</p>
          <Link to="/ubications" className="btn btn-secondary mt-3">
            Volver a Ubicaciones
          </Link>
        </div>
      </div>
    </div>
  );
}
